# Services HTTP et authentification JWT en Angular

> **Prérequis** : Angular 17+, `HttpClient`, signals, injection de dépendances.  
> **Objectif** : Créer des services Angular qui communiquent avec une API REST Express sécurisée par JWT.

---

## Contexte — L'architecture mise en place

```
┌─────────────────────────────────┐        HTTP / JSON         ┌─────────────────────────────┐
│   Angular (port 4200)           │ ◄──────────────────────►  │  Express API (port 3001)    │
│                                 │                            │                             │
│  AuthDemandeService             │   POST /auth/login         │  /auth/login                │
│  DemandeService                 │   GET  /demandes           │  /demandes  (protégé JWT)   │
│  TypeDemandeService             │   GET  /types-demande      │  /types-demande (protégé)   │
└─────────────────────────────────┘                            └─────────────────────────────┘
```

Le back-end `backendDemande` expose trois groupes de routes :

| Préfixe         | Rôle                               | Authentification ?  |
|-----------------|------------------------------------|---------------------|
| `/auth`         | Création de compte, connexion      | Non (routes publiques) |
| `/demandes`     | CRUD des demandes (tech / com)     | **Oui** — JWT requis |
| `/types-demande`| Liste des types de demande         | **Oui** — JWT requis |

---

## Étape 1 — Créer les interfaces TypeScript (modèles)

Avant d'écrire un service, on crée les interfaces qui décrivent les données échangées avec l'API.  
C'est le **contrat** entre le front-end et le back-end.

### 1.1 `ITypeDemande.ts`

```typescript
// src/app/model/ITypeDemande.ts
export interface ITypeDemande {
  IdTypeDemande: string;
  LibTypeDemande: string;
}
```

Simple : un identifiant et un libellé, tel que renvoyé par `GET /types-demande`.

---

### 1.2 `IDemande.ts` — Plusieurs interfaces dans un même fichier

Ce fichier regroupe tous les types liés aux demandes, car ils sont fortement liés entre eux.

#### Le modèle de base `IDemande`

```typescript
export interface IDemande {
  IdDemande: number;
  CodeActiviteDT: string;
  IdTypeDemande: string;
  // ... (tous les champs retournés par l'API)
  DateDemande: string; // ISO 8601 : "2026-05-12T08:30:00.000Z"
}
```

#### L'héritage d'interface : `IDemandeTechnique`

Le WSDL d'origine définit une **demande technique** comme une extension d'une demande de base.  
On traduit cela en TypeScript avec `extends` :

```typescript
export interface IDemandeTechnique extends IDemande {
  // Champs supplémentaires spécifiques aux demandes techniques
  CompteRenduClient: string;
  DatePlan: string;
  // ...
}
```

> `IDemandeTechnique` hérite de **tous** les champs de `IDemande` et en ajoute de nouveaux.

#### Les filtres de recherche

Les routes `GET /demandes/client` et `GET /demandes/collab` acceptent des paramètres de requête (`?pEnCours=true&pSite=SITE-A`). On les type explicitement pour éviter les erreurs :

```typescript
export interface CliSearchFilters {
  pEnCours: boolean;   // obligatoire
  pIdTiers?: string;   // ? = optionnel
  pMessage?: string;
  // ...
}
```

#### Les interfaces d'authentification

```typescript
export interface LoginRequest { username: string; password: string; }
export interface AuthResponse  { token: string; user: PublicUser; }
```

Ces interfaces décrivent exactement ce qu'on envoie au `POST /auth/login` et ce qu'on reçoit en retour.

---

## Étape 2 — Comprendre le JWT avant de coder

### Qu'est-ce qu'un JWT ?

**JSON Web Token** (JWT) est un jeton d'authentification. C'est une chaîne de caractères encodée en Base64, composée de **3 parties** séparées par des points :

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9   ← Header  (algorithme + type)
.eyJzdWIiOiJ1c2VyMSIsInJvbGUiOiJjbGllbnQifQ  ← Payload (données utiles)
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← Signature (vérification)
```

Le **payload** contient des informations (appelées *claims*) sur l'utilisateur :

```json
{
  "sub": "abc123",
  "username": "alice",
  "role": "client",
  "idTiers": "CLI001",
  "iat": 1750000000,
  "exp": 1750003600
}
```

> **Important** : le payload est **encodé** (Base64) mais **pas chiffré**. N'y mettez jamais de mot de passe.

### Comment fonctionne l'authentification par JWT ?

```
Client                          Serveur Express
  │                                  │
  │  POST /auth/login                │
  │  { username, password }  ──────► │  Vérifie les identifiants
  │                                  │  Génère un JWT signé
  │  ◄──────  { token, user }        │
  │                                  │
  │  Stocke le token (localStorage) │
  │                                  │
  │  GET /demandes                   │
  │  Authorization: Bearer <token>  ──► Vérifie la signature du JWT
  │                                  │  Extrait le rôle et l'idTiers
  │  ◄──────  [ ...demandes ]        │
```

1. L'utilisateur s'authentifie : le serveur vérifie le mot de passe et retourne un **JWT signé**.
2. Le client **stocke** ce token et le **renvoie** dans chaque requête suivante via le header `Authorization`.
3. Le serveur **vérifie** la signature du token (sans accès à une base de données) et autorise ou refuse la requête.

---

## Étape 3 — `AuthDemandeService` : gérer le cycle de vie du token

```typescript
// src/app/services/auth-demande-service.ts
@Injectable({ providedIn: 'root' })
export class AuthDemandeService {

  private readonly apiUrl = 'http://localhost:3001/auth';
  private http = inject(HttpClient);
```

### 3.1 Stocker le token avec un Signal

```typescript
private _token = signal<string | null>(localStorage.getItem('demande_token'));
readonly token = this._token.asReadonly();
```

**Pourquoi un Signal ?**  
Un `signal` est **réactif** : tout composant ou service qui lit `token()` sera automatiquement notifié quand sa valeur change (connexion ou déconnexion). C'est l'équivalent Angular d'un `BehaviorSubject` RxJS, mais plus simple.

**Pourquoi `localStorage` ?**  
`localStorage` persiste les données même après fermeture de l'onglet. Ainsi, si l'utilisateur recharge la page, il reste connecté tant que son token n'est pas expiré. À l'initialisation du service, on relit immédiatement le token stocké.

> **Note de sécurité** : `localStorage` est accessible par JavaScript. Pour des applications très sensibles, on peut préférer un cookie `httpOnly` (inaccessible en JS). Dans notre contexte pédagogique, `localStorage` est suffisant.

### 3.2 La connexion avec `tap`

```typescript
login$(credentials: LoginRequest): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
    tap(response => {
      this._token.set(response.token);
      localStorage.setItem('demande_token', response.token);
    }),
  );
}
```

L'opérateur `tap` permet d'**effectuer un effet de bord** (stocker le token) **sans modifier** la valeur de l'Observable. Le composant qui souscrit reçoit toujours la réponse complète `AuthResponse`.

### 3.3 La déconnexion

```typescript
logout(): void {
  this._token.set(null);
  localStorage.removeItem('demande_token');
}
```

Supprimer le token = déconnecter l'utilisateur. La prochaine requête protégée sera rejetée par le serveur avec un `401 Unauthorized`.

### 3.4 Construire les headers d'autorisation

```typescript
authHeaders(): Record<string, string> {
  const token = this._token();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
```

Cette méthode retourne un objet de headers HTTP. Elle est conçue pour être **injectée dans les autres services** : ils l'appellent pour obtenir le bon header à chaque requête.

---

## Étape 4 — `DemandeService` : les requêtes protégées

```typescript
@Injectable({ providedIn: 'root' })
export class DemandeService {

  private readonly apiUrl = 'http://localhost:3001/demandes';
  private http = inject(HttpClient);
  private authService = inject(AuthDemandeService);  // ← injection du service d'auth
```

### 4.1 Le getter `options`

```typescript
private get options() {
  return { headers: this.authService.authHeaders() };
}
```

Un getter `private` calcule **à chaque appel** les options HTTP (avec le token courant). Grâce à cela, toutes les méthodes du service peuvent simplement écrire `this.options` au lieu de répéter la logique.

### 4.2 Les routes de lecture

```typescript
// Toutes les demandes (admin / collaborateur)
getAllDemandes$(): Observable<IDemandeTechnique[]> {
  return this.http.get<IDemandeTechnique[]>(this.apiUrl, this.options);
}

// Une demande par id
getDemandeById$(id: number): Observable<IDemandeTechnique> {
  return this.http.get<IDemandeTechnique>(`${this.apiUrl}/${id}`, this.options);
}
```

Le token JWT est transmis dans le **header HTTP** `Authorization: Bearer <token>`. Le serveur Express lit ce header via son middleware `authenticate`, vérifie la signature, puis autorise ou refuse la requête.

### 4.3 Les routes de recherche avec paramètres de requête

```typescript
getClientDemandes$(filters: CliSearchFilters): Observable<IDemandeTechnique[]> {
  return this.http.get<IDemandeTechnique[]>(`${this.apiUrl}/client`, {
    headers: this.authService.authHeaders(),
    params: filters as Record<string, any>,  // ← transformé en ?pEnCours=true&pSite=...
  });
}
```

`HttpClient` convertit automatiquement l'objet `filters` en **paramètres d'URL**.  
`{ pEnCours: true, pSite: 'SITE-A' }` devient `?pEnCours=true&pSite=SITE-A`.

### 4.4 Les routes de création (POST)

```typescript
createDemandeTechnique$(input: CreateDemTechInput): Observable<{ CreateDemTechResult: number }> {
  return this.http.post<{ CreateDemTechResult: number }>(
    `${this.apiUrl}/technique`,
    input,          // ← corps de la requête (JSON)
    this.options    // ← headers avec JWT
  );
}
```

Pour un `POST`, `HttpClient` prend trois arguments : l'URL, le **corps** (sérialisé en JSON automatiquement) et les **options** (headers).

---

## Étape 5 — `TypeDemandeService` : service simple et focalisé

```typescript
@Injectable({ providedIn: 'root' })
export class TypeDemandeService {

  private readonly apiUrl = 'http://localhost:3001/types-demande';
  private http = inject(HttpClient);
  private authService = inject(AuthDemandeService);

  getAllTypes$(): Observable<ITypeDemande[]> {
    return this.http.get<ITypeDemande[]>(this.apiUrl, {
      headers: this.authService.authHeaders(),
    });
  }
}
```

Même si cette route est simple (une seule méthode GET), elle nécessite un token valide car le back-end exige une authentification. Le header `Authorization` est ajouté de la même façon.

---

## Récapitulatif — Les fichiers créés

```
src/app/
├── model/
│   ├── IDemande.ts          ← IDemande, IDemandeTechnique, filtres, inputs création, types auth
│   └── ITypeDemande.ts      ← ITypeDemande
└── services/
    ├── auth-demande-service.ts   ← login, register, logout, stockage JWT
    ├── demande-service.ts        ← toutes les opérations sur /demandes
    └── type-demande-service.ts   ← GET /types-demande
```

---

## Utilisation dans un composant

### Se connecter

```typescript
@Component({ ... })
export class LoginComponent {
  private authService = inject(AuthDemandeService);

  onLogin(username: string, password: string) {
    this.authService.login$({ username, password }).subscribe({
      next: (response) => console.log('Connecté en tant que', response.user.role),
      error: (err) => console.error('Identifiants invalides', err),
    });
  }
}
```

### Afficher la liste des demandes

```typescript
@Component({ ... })
export class DemandesComponent {
  private demandeService = inject(DemandeService);

  demandes = signal<IDemandeTechnique[]>([]);

  ngOnInit() {
    this.demandeService.getAllDemandes$().subscribe(data => {
      this.demandes.set(data);
    });
  }
}
```

### Vérifier si l'utilisateur est connecté

```typescript
// Le signal token() est null si déconnecté, contient le JWT sinon.
private authService = inject(AuthDemandeService);
estConnecte = computed(() => this.authService.token() !== null);
```

---

## Points clés à retenir

| Concept | Explication |
|---|---|
| **JWT** | Jeton signé contenant les infos utilisateur (rôle, idTiers). Valide sans accès BDD. |
| **Bearer token** | Convention : `Authorization: Bearer <jwt>` dans le header HTTP. |
| **Signal** | Valeur réactive Angular. La vue se met à jour automatiquement quand le token change. |
| **localStorage** | Persistance côté navigateur. Le token survit au rechargement de la page. |
| **`tap`** | Opérateur RxJS pour effet de bord (stocker le token) sans altérer le flux Observable. |
| **`providedIn: 'root'`** | Le service est un **singleton** : une seule instance partagée dans toute l'application. |
