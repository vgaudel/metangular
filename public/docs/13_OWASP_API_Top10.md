# Sécurité des API — OWASP API Top 10 (niveau essentiel)

> **Public** : Développeurs en poste (Angular / Node.js), niveau intermédiaire.  
> **Objectif** : Comprendre les 10 vulnérabilités les plus critiques des API REST, savoir les reconnaître et les corriger.

---

## Qu'est-ce que l'OWASP ?

**OWASP** (Open Worldwide Application Security Project) est une fondation à but non lucratif qui publie des guides et des listes de référence sur la sécurité des applications web. Ses publications sont libres et gratuites.

Le **OWASP API Security Top 10** recense les 10 risques les plus fréquents et les plus dangereux rencontrés dans les API REST modernes. Il est mis à jour régulièrement (dernière version : **2023**).

> Ces risques ne sont pas théoriques : ils sont à l'origine des plus grandes fuites de données de ces dernières années (Facebook, Uber, T-Mobile, etc.).

---

## Vue d'ensemble des 10 risques

| # | Nom (EN) | Traduction courte |
|---|---|---|
| API1 | Broken Object Level Authorization | Autorisation objet défaillante |
| API2 | Broken Authentication | Authentification défaillante |
| API3 | Broken Object Property Level Authorization | Exposition excessive de propriétés |
| API4 | Unrestricted Resource Consumption | Consommation de ressources non limitée |
| API5 | Broken Function Level Authorization | Autorisation de fonction défaillante |
| API6 | Unrestricted Access to Sensitive Business Flows | Accès non contrôlé aux flux métier |
| API7 | Server Side Request Forgery (SSRF) | Falsification de requête côté serveur |
| API8 | Security Misconfiguration | Mauvaise configuration de sécurité |
| API9 | Improper Inventory Management | Mauvaise gestion des versions d'API |
| API10 | Unsafe Consumption of APIs | Consommation non sécurisée d'API tierces |

---

## API1 — Broken Object Level Authorization (BOLA)

### Le problème

C'est la vulnérabilité **la plus fréquente** de toutes les API. L'API ne vérifie pas que l'utilisateur connecté a le droit d'accéder à la **ressource identifiée** dans la requête.

### Exemple concret

Un utilisateur est connecté avec l'identifiant `42`. Il appelle :

```http
GET /demandes/1337
Authorization: Bearer <token_utilisateur_42>
```

Si l'API retourne la demande `1337` — qui appartient à un autre client — **sans vérifier l'appartenance**, c'est une BOLA.

Il suffit de changer l'id dans l'URL pour accéder aux données de n'importe qui.

### Correction

```typescript
// ❌ Mauvais : on retourne la demande sans vérifier le propriétaire
app.get('/demandes/:id', authenticate, (req, res) => {
  const demande = db.getById(req.params.id);
  res.json(demande);
});

// ✅ Correct : on vérifie que la demande appartient à l'utilisateur connecté
app.get('/demandes/:id', authenticate, (req, res) => {
  const demande = db.getById(req.params.id);
  if (!demande) return res.status(404).json({ message: 'Non trouvé' });

  if (req.user.role === 'client' && demande.IdTiersDem !== req.user.idTiers) {
    return res.status(403).json({ message: 'Accès refusé' });
  }

  res.json(demande);
});
```

> **Règle d'or** : ne jamais faire confiance à un identifiant fourni par le client. Toujours recroiser avec l'identité du token.

---

## API2 — Broken Authentication

### Le problème

Les mécanismes d'authentification sont mal implémentés : tokens faibles, absence d'expiration, secrets JWT en dur dans le code, mots de passe non hachés, etc.

### Exemples de failles

```typescript
// ❌ Secret JWT trop simple et en dur dans le code
const token = jwt.sign(payload, 'secret');

// ❌ Token sans expiration (valable indéfiniment)
const token = jwt.sign(payload, process.env.JWT_SECRET);

// ❌ Mot de passe stocké en clair dans la base
db.createUser({ username, password }); // password = "monmotdepasse"
```

### Corrections

```typescript
// ✅ Secret fort via variable d'environnement + expiration courte
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

// ✅ Mot de passe haché avec bcrypt (coût = 12)
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 12);

// ✅ Vérification du mot de passe
const isValid = await bcrypt.compare(passwordFourni, hashStocke);
```

> Ne jamais committer un fichier `.env` contenant un secret JWT dans un dépôt Git.  
> Ajouter `.env` au `.gitignore`.

---

## API3 — Broken Object Property Level Authorization

### Le problème

L'API retourne **plus de données que nécessaire** (mass assignment ou over-exposure). Un utilisateur peut voir des champs qu'il ne devrait pas (hash de mot de passe, données internes) ou modifier des champs sensibles.

### Exemple — Sur-exposition en lecture

```typescript
// ❌ On retourne l'objet complet, y compris le hash du mot de passe
app.get('/auth/me', authenticate, (req, res) => {
  const user = db.getUserById(req.user.sub);
  res.json(user); // contient passwordHash !
});

// ✅ On ne retourne que les champs publics
res.json({
  id: user.id,
  username: user.username,
  role: user.role,
  idTiers: user.idTiers,
});
```

### Exemple — Mass assignment en écriture

```typescript
// ❌ On applique directement le body sans filtrage
app.put('/users/:id', (req, res) => {
  db.updateUser(req.params.id, req.body); // l'utilisateur peut changer son propre "role" !
});

// ✅ On liste explicitement les champs autorisés
const { username, email } = req.body; // on ignore tout le reste
db.updateUser(req.params.id, { username, email });
```

---

## API4 — Unrestricted Resource Consumption

### Le problème

L'API n'impose aucune limite sur la taille des requêtes, le nombre d'appels ou la complexité des opérations. Cela permet des attaques par **déni de service** (DoS) ou des abus fonctionnels.

### Exemples de limites à mettre en place

```typescript
import rateLimit from 'express-rate-limit';
import express from 'express';

const app = express();

// ✅ Limiter la taille du corps des requêtes JSON
app.use(express.json({ limit: '10kb' }));

// ✅ Rate limiting général : max 100 requêtes par 15 minutes par IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Trop de requêtes, réessayez dans 15 minutes.' },
});
app.use(limiter);

// ✅ Rate limiting renforcé sur les routes sensibles (login)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // max 10 tentatives de connexion
});
app.use('/auth/login', loginLimiter);
```

> Sans rate limiting, un attaquant peut tenter des milliers de mots de passe par seconde (brute force).

---

## API5 — Broken Function Level Authorization

### Le problème

Alors qu'API1 concerne l'accès à un **objet** (une ressource), API5 concerne l'accès à une **fonction** (une route entière). Des routes d'administration sont accessibles à des utilisateurs ordinaires.

### Exemple

```http
DELETE /admin/users/42
```

Cette route devrait être réservée aux administrateurs. Si l'API ne vérifie pas le rôle, n'importe quel utilisateur connecté peut supprimer un autre compte.

### Correction — Middleware d'autorisation par rôle (RBAC)

```typescript
// Middleware authorize : vérifie que l'utilisateur a l'un des rôles autorisés
export function authorize(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès interdit' });
    }
    next();
  };
}

// Utilisation sur les routes
app.delete('/admin/users/:id', authenticate, authorize('admin'), (req, res) => {
  // Seuls les admins arrivent ici
});

app.get('/demandes/collab', authenticate, authorize('collaborateur', 'admin'), (req, res) => {
  // Collaborateurs et admins uniquement
});
```

---

## API6 — Unrestricted Access to Sensitive Business Flows

### Le problème

Des flux métier sensibles ne sont pas protégés contre les abus automatisés : achat en masse de billets limités, envoi en masse d'emails via un formulaire de contact, récupération de données par scraping.

### Exemple

Une API d'inscription à un événement à places limitées :

```http
POST /evenements/42/inscrire
```

Sans protection, un bot peut s'inscrire 500 fois en quelques secondes, épuisant toutes les places.

### Corrections possibles

- **CAPTCHA** sur les formulaires publics
- **Rate limiting métier** (ex. : max 2 inscriptions par utilisateur)
- **Vérification d'email** avant activation
- **Détection d'anomalies** (volume inhabituel d'actions d'un même compte)

---

## API7 — Server Side Request Forgery (SSRF)

### Le problème

L'API accepte une URL fournie par l'utilisateur et effectue une requête HTTP **depuis le serveur** vers cette URL. Un attaquant peut cibler des services internes (base de données, métadonnées cloud) normalement inaccessibles depuis l'extérieur.

### Exemple

```typescript
// ❌ Dangereux : l'URL vient du client
app.get('/preview', async (req, res) => {
  const url = req.query.url as string;
  const response = await fetch(url); // peut cibler http://169.254.169.254 (metadata AWS)
  res.send(await response.text());
});
```

### Correction

```typescript
// ✅ Valider que l'URL appartient à une liste blanche de domaines autorisés
const ALLOWED_HOSTS = ['api.partenaire.com', 'cdn.monsite.com'];

function isAllowedUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return ALLOWED_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

app.get('/preview', (req, res) => {
  const url = req.query.url as string;
  if (!isAllowedUrl(url)) {
    return res.status(400).json({ message: 'URL non autorisée' });
  }
  // ...
});
```

---

## API8 — Security Misconfiguration

### Le problème

La configuration par défaut des outils, frameworks et serveurs expose des informations inutiles ou laisse des portes ouvertes : messages d'erreur détaillés, stack traces en production, CORS trop permissif, headers de sécurité absents, ports inutiles ouverts.

### Exemples et corrections

```typescript
// ❌ CORS trop permissif (autorise tout le monde)
app.use(cors());

// ✅ CORS restreint au domaine Angular
app.use(cors({ origin: 'https://monapp.example.com' }));

// ❌ Erreur retournée avec la stack trace complète
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message, stack: err.stack });
});

// ✅ En production, message générique uniquement
app.use((err, req, res, next) => {
  console.error(err); // log interne
  res.status(500).json({ message: 'Erreur interne du serveur' });
});
```

```typescript
import helmet from 'helmet';

// ✅ Helmet ajoute automatiquement ~15 headers de sécurité HTTP
app.use(helmet());
// Exemples de headers ajoutés :
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// Strict-Transport-Security: max-age=31536000
```

---

## API9 — Improper Inventory Management

### Le problème

Des anciennes versions de l'API restent accessibles et non maintenues (`/api/v1/`, `/api/v2/`), ou des environnements de développement/staging sont exposés sur internet avec des configurations laxistes.

### Bonnes pratiques

- Documenter et versionner explicitement les API (`/v1/`, `/v2/`)
- **Désactiver** les versions obsolètes plutôt que de les laisser en place
- Ne jamais exposer un environnement de staging sur une URL publique sans protection
- Utiliser des variables d'environnement différentes par environnement (`dev`, `preprod`, `prod`)
- Maintenir un **inventaire** à jour de toutes les API exposées

```typescript
// ✅ Versionnage explicite des routes
app.use('/api/v2/demandes', demandesRouter);

// ✅ Redirection ou refus de l'ancienne version
app.use('/api/v1', (req, res) => {
  res.status(410).json({ message: 'API v1 désactivée. Veuillez utiliser /api/v2.' });
});
```

---

## API10 — Unsafe Consumption of APIs

### Le problème

Notre API consomme elle-même des API tierces (services de paiement, géolocalisation, météo, etc.) et leur fait **confiance aveuglément** : sans valider les données reçues, sans gérer les erreurs, sans limiter les appels.

### Exemple d'erreur courante

```typescript
// ❌ On insère directement les données d'une API tierce en base sans validation
app.post('/commandes', async (req, res) => {
  const prixData = await fetch('https://api-tarification.exemple.com/prix/42');
  const { prix } = await prixData.json();
  db.createCommande({ ...req.body, prix }); // et si l'API tierce retourne prix = 0 ?
});
```

### Corrections

- **Valider** les données reçues des API tierces (schéma, types, plages de valeurs)
- **Ne pas faire confiance** aux données externes pour des décisions critiques (prix, autorisations)
- **Gérer les erreurs** : timeout, réponse malformée, service indisponible
- **Limiter les appels** avec un cache pour éviter la sur-consommation et les coûts

```typescript
// ✅ Validation + gestion d'erreur
const response = await fetch('https://api-tarification.exemple.com/prix/42');
if (!response.ok) throw new Error('Service de tarification indisponible');

const data = await response.json();
const prix = Number(data.prix);

if (!Number.isFinite(prix) || prix <= 0) {
  throw new Error('Prix invalide reçu du service tiers');
}
```

---

## Récapitulatif — Checklist rapide

| # | Risque | Action principale |
|---|---|---|
| API1 | BOLA | Vérifier l'appartenance de chaque ressource à l'utilisateur connecté |
| API2 | Auth défaillante | Hasher les mots de passe, expirer les tokens, secret JWT fort |
| API3 | Sur-exposition | Ne retourner que les champs nécessaires, interdire le mass assignment |
| API4 | Abus de ressources | Rate limiting, limiter la taille des payloads |
| API5 | Auth de fonction | Middleware RBAC sur chaque route sensible |
| API6 | Abus de flux métier | Limites métier, CAPTCHA, détection d'anomalies |
| API7 | SSRF | Valider les URLs, liste blanche de domaines |
| API8 | Mauvaise config | Helmet, CORS restreint, pas de stack trace en prod |
| API9 | Mauvais inventaire | Versionner, désactiver les anciennes routes, pas de staging public |
| API10 | API tierces non sécurisées | Valider les données reçues, gérer les erreurs et timeouts |

---

## Pour aller plus loin

- [OWASP API Security Top 10 (officiel)](https://owasp.org/API-Security/editions/2023/en/0x00-header/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [JWT.io — déboguer et comprendre les tokens JWT](https://jwt.io/)
- [Helmet.js — documentation](https://helmetjs.github.io/)

---

---

# Plan de présentation — Slides

> **Format suggéré** : 15 slides, durée ~45 min à 1h, avec échanges et démos.  
> **Cible** : Développeurs Angular / Node.js en poste, niveaux intermédiaires.  
> **Fil conducteur** : partir d'une API "naïve" et la sécuriser progressivement en live-coding ou pseudo-code commenté.

---

## Slide 1 — Accroche : "Vos API sont-elles sécurisées ?"

**Type** : titre + question de mise en situation  
**Contenu** :
- Afficher 2-3 titres de presse réels sur des fuites de données API (Facebook 2021, Twitter 2022)
- Question posée à l'audience : *"Qui a déjà retourné un objet complet depuis une route GET ?"*
- Objectif : créer une prise de conscience immédiate

---

## Slide 2 — Qu'est-ce que l'OWASP ?

**Type** : contexte / légitimité  
**Contenu** :
- Fondation internationale, open source, indépendante des éditeurs
- Le Top 10 Web (le plus connu) vs le **Top 10 API** (plus récent, 2019, révisé 2023)
- Pourquoi se concentrer sur les API : les SPA Angular découplées multiplient les surfaces d'attaque

---

## Slide 3 — Architecture de référence

**Type** : schéma technique  
**Contenu** :
- Schéma : navigateur → Angular SPA → API REST Express → base de données
- Mettre en évidence les **surfaces d'attaque** : le réseau entre Angular et l'API, les paramètres d'URL, les headers, les corps de requêtes
- Transition : *"C'est ici que vivent les 10 vulnérabilités qu'on va voir"*

---

## Slide 4 — API1 : BOLA — "Je peux voir les données des autres"

**Type** : vulnérabilité + démo  
**Contenu** :
- Scénario : changer l'id dans `GET /users/42` → `GET /users/43`
- Code ❌ vs code ✅ (vérification de l'appartenance)
- **Message clé** : *"Toujours croiser l'ID de l'URL avec l'identité du token"*
- Temps estimé : 5-7 min (le plus important, mérite plus de temps)

---

## Slide 5 — API2 : Authentification défaillante — "Mon token vaut de l'or"

**Type** : vulnérabilité + bonnes pratiques  
**Contenu** :
- Anatomie d'un JWT (rappel rapide : header / payload / signature)
- Les 3 erreurs classiques : secret faible, pas d'expiration, mot de passe en clair
- Code ✅ : bcrypt + secret via `.env` + `expiresIn`
- **Message clé** : *"Un secret JWT dans le code source = faille critique"*

---

## Slide 6 — API3 : Sur-exposition — "Je retourne trop"

**Type** : vulnérabilité  
**Contenu** :
- Exemple : retourner `passwordHash` dans `GET /me`
- Exemple : mass assignment sur `PUT /users/:id` permet de changer son propre rôle
- Code ✅ : DTO explicite, liste blanche des champs autorisés
- **Message clé** : *"Ce qui n'est pas retourné ne peut pas être volé"*

---

## Slide 7 — API4 : Abus de ressources — "Mon API ne dit jamais non"

**Type** : vulnérabilité + démo outil  
**Contenu** :
- Scénario : brute force d'un endpoint `/login` (montrer avec un simple `for` loop en JS)
- Solution : `express-rate-limit` — montrer la configuration en 10 lignes
- Bonus : limiter la taille des payloads avec `express.json({ limit: '10kb' })`
- **Message clé** : *"Chaque endpoint sans limite est une porte ouverte au DoS"*

---

## Slide 8 — API5 : Autorisation de fonction — "J'ai accès aux routes admin"

**Type** : vulnérabilité  
**Contenu** :
- Différence entre API1 (qui accède à **quel objet**) et API5 (qui accède à **quelle route**)
- Montrer un middleware `authorize('admin')` en Node.js
- Côté Angular : les guards de route (`canActivate`) ne suffisent pas — il faut **toujours** valider côté serveur
- **Message clé** : *"Le frontend protège l'UX. Le backend protège les données."*

---

## Slide 9 — API6 & API7 : Abus métier et SSRF — "Les attaques invisibles"

**Type** : deux vulnérabilités en une slide  
**Contenu** :
- **API6** : bot qui réserve tous les places d'un événement → CAPTCHA, limite métier
- **API7** : URL fournie par le client exploitée par le serveur → liste blanche de domaines
- Ces risques sont moins connus mais très ciblés dans les attaques professionnelles
- **Message clé** : *"Valider les entrées ne suffit pas — il faut valider le comportement"*

---

## Slide 10 — API8 : Mauvaise configuration — "Mon serveur bavarde trop"

**Type** : démo live (optionnelle)  
**Contenu** :
- Montrer la différence de réponse d'erreur en dev (stack trace) vs prod (message générique)
- `helmet()` : un seul appel, ~15 headers de sécurité ajoutés automatiquement
- CORS : montrer la différence entre `cors()` et `cors({ origin: '...' })`
- **Message clé** : *"La configuration par défaut est conçue pour le développeur, pas pour la sécurité"*

---

## Slide 11 — API9 & API10 : Inventaire et confiance aveugle

**Type** : bonnes pratiques organisationnelles  
**Contenu** :
- **API9** : versionner les API, désactiver les anciennes routes (`410 Gone`)
- **API10** : ne jamais faire confiance aux données d'une API tierce (valider, gérer les erreurs)
- Mention : les API de staging exposées sur internet sont une source majeure de fuites
- **Message clé** : *"Ce qu'on ne contrôle pas peut nous trahir"*

---

## Slide 12 — Zoom Angular : ce que le frontend peut (et ne peut pas) faire

**Type** : focus framework  
**Contenu** :
- Ce que Angular **peut** faire : guards de route, masquage conditionnel, validation de formulaires, sanitisation HTML automatique (DomSanitizer)
- Ce que Angular **ne peut pas** garantir : sécurité des données (toujours contournable côté client)
- **Message clé** : *"Angular protège l'expérience utilisateur. L'API protège les données."*

---

## Slide 13 — Checklist de sécurité minimale avant mise en production

**Type** : synthèse visuelle (checklist)  
**Contenu** :
```
✅ Mots de passe hachés (bcrypt)
✅ Secrets JWT dans .env, hors du dépôt Git
✅ Tokens avec expiration (≤ 1h pour l'access token)
✅ CORS restreint au domaine de production
✅ Helmet activé
✅ Rate limiting sur /login et les routes sensibles
✅ Pas de stack trace en production
✅ Vérification d'appartenance sur chaque ressource (BOLA)
✅ Middleware d'autorisation par rôle (RBAC)
✅ Variables d'environnement différentes par env (dev / prod)
```

---

## Slide 14 — Exercice pratique (atelier)

**Type** : mise en pratique  
**Contenu** :
- Donner aux participants une API Express "intentionnellement vulnérable" (5-10 routes)
- Tâches :
  1. Identifier les vulnérabilités présentes (5 min)
  2. Corriger les 3 plus critiques (15 min)
  3. Revue collective en groupe
- Outils suggérés : Bruno / Postman pour tester les routes

---

## Slide 15 — Ressources et pour aller plus loin

**Type** : conclusion + ressources  
**Contenu** :
- [owasp.org/API-Security](https://owasp.org/API-Security/editions/2023/en/0x00-header/) — la source officielle
- [jwt.io](https://jwt.io/) — décoder et comprendre les tokens
- [helmetjs.github.io](https://helmetjs.github.io/) — documentation Helmet
- [cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org/) — fiches pratiques par thème
- Rappel : la sécurité n'est pas un état, c'est un **processus continu**

---

> **Conseil de facilitation** : pour une formation en présentiel, intercaler une question ou un mini-sondage à main levée à chaque slide de vulnérabilité (*"Qui a déjà écrit ce code ?"*). L'objectif est de dédramatiser et de montrer que ces erreurs sont communes — pas de culpabiliser.
