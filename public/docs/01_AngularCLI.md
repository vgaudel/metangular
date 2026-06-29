# Créer un projet Angular pas à pas

Ce guide décrit la création d'un projet Angular, la structure générée par le CLI et les grands principes du framework.

---

## 1. Pré-requis

- **Node.js** (LTS 20.x ou 22.x) et **npm**
- **Angular CLI** installé globalement :

```powershell
npm install -g @angular/cli
ng version
```

---

## 2. Création du projet pas à pas

### Étape 1 — Générer le projet

Placez-vous dans le dossier parent puis exécutez :

```powershell
ng new mon-projet
```

Le CLI vous pose plusieurs questions :

1. **Would you like to add Angular routing?** → `Yes` (recommandé pour gérer plusieurs vues)
2. **Which stylesheet format would you like to use?** → `SCSS` (recommandé), `CSS`, `Sass`, `Less`
3. **Server-Side Rendering (SSR)?** → `No` pour débuter, `Yes` pour une app SEO/SSR

Variante non-interactive :

```powershell
ng new mon-projet --routing --style=scss --skip-tests=false
```

### Étape 2 — Entrer dans le projet

```powershell
cd mon-projet
```

### Étape 3 — Lancer le serveur de développement

```powershell
ng serve --open
```

L'application est disponible sur `http://localhost:4200`. Le rechargement est automatique à chaque modification.

### Étape 4 — Générer un premier composant

```powershell
ng generate component header
# ou plus court :
ng g c header
```

Le CLI crée :
- `src/app/header/header.component.ts`
- `src/app/header/header.component.html`
- `src/app/header/header.component.scss`
- `src/app/header/header.component.spec.ts`


## 3. Structure d'un projet Angular

```
mon-projet/
├── .vscode/                  # Configuration VS Code (debug, launch)
├── node_modules/             # Dépendances npm
├── public/                   # Assets statiques (favicon, images publiques)
├── src/                      # Code source de l'application
│   ├── app/                  # Composants, services, modules de l'app
│   │   ├── app.component.ts        # Composant racine (logique)
│   │   ├── app.component.html      # Template du composant racine
│   │   ├── app.component.scss      # Styles du composant racine
│   │   ├── app.component.spec.ts   # Tests unitaires
│   │   ├── app.config.ts           # Configuration de l'app (standalone)
│   │   └── app.routes.ts           # Définition des routes
│   ├── assets/               # Images, fonts, fichiers JSON (selon version)
│   ├── environments/         # Configurations par environnement (dev/prod)
│   ├── index.html            # Page HTML hôte (contient <app-root>)
│   ├── main.ts               # Point d'entrée — bootstrap de l'application
│   └── styles.scss           # Styles globaux
├── angular.json              # Configuration Angular CLI (build, serve, test)
├── package.json              # Dépendances et scripts npm
├── tsconfig.json             # Configuration TypeScript globale
├── tsconfig.app.json         # Config TS pour l'application
├── tsconfig.spec.json        # Config TS pour les tests
└── README.md
```

### Fichiers clés

| Fichier | Rôle |
|---|---|
| `main.ts` | Démarre l'application via `bootstrapApplication()` |
| `app.component.ts` | Composant racine, contient `<router-outlet>` |
| `app.config.ts` | Fournit les providers globaux (routing, HTTP, etc.) |
| `app.routes.ts` | Tableau des routes de l'application |
| `angular.json` | Configure le build, le serveur, les assets, les styles |
| `package.json` | Scripts (`start`, `build`, `test`) et dépendances |
| `tsconfig.json` | Options du compilateur TypeScript |

---

## 4. Les grands principes du framework Angular

### 4.1 Architecture par composants

Une application Angular est un **arbre de composants**. Chaque composant encapsule :
- une **classe TypeScript** (logique),
- un **template HTML** (vue),
- des **styles** (CSS/SCSS) avec encapsulation par défaut.

```typescript
@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  title = 'Mon Application';
}
```

### 4.2 Composants standalone (Angular 17+)

Les composants standalone se déclarent eux-mêmes leurs dépendances via `imports`, sans passer par un `NgModule`. C'est l'approche recommandée pour les nouveaux projets.

```typescript
@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  // ...
})
```

### 4.3 Templates et data binding

Angular propose plusieurs types de liaisons :

| Syntaxe | Type | Exemple |
|---|---|---|
| `{{ valeur }}` | Interpolation | `{{ user.name }}` |
| `[propriete]="expr"` | Property binding | `[disabled]="isLoading"` |
| `(event)="handler()"` | Event binding | `(click)="save()"` |
| `[(ngModel)]="x"` | Two-way binding | nécessite `FormsModule` |

### 4.4 Directives et nouvelle syntaxe de contrôle (Angular 17+)

```html
<!-- Ancien (toujours supporté) -->
<div *ngIf="user">{{ user.name }}</div>
<li *ngFor="let item of items">{{ item }}</li>

<!-- Nouvelle syntaxe (recommandée) -->
@if (user) {
  <div>{{ user.name }}</div>
}

@for (item of items; track item.id) {
  <li>{{ item }}</li>
}

@switch (status) {
  @case ('ok') { <p>OK</p> }
  @default { <p>...</p> }
}
```

### 4.5 Services et Injection de dépendances

Les **services** centralisent la logique métier et les appels HTTP. Angular les injecte automatiquement.

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}
  getUsers() { return this.http.get('/api/users'); }
}
```

Utilisation dans un composant :

```typescript
export class UsersComponent {
  private userService = inject(UserService); // ou via constructor
}
```

### 4.6 Routing

Le routing permet la navigation entre différentes vues sans rechargement.

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/:id', component: UserDetailComponent },
  { path: '**', redirectTo: '' },
];
```

```html
<a routerLink="/users">Utilisateurs</a>
<router-outlet></router-outlet>
```

### 4.7 Signals (Angular 17+)

Les **signals** sont le nouveau modèle de réactivité d'Angular.

```typescript
import { signal, computed } from '@angular/core';

count = signal(0);
double = computed(() => this.count() * 2);

increment() {
  this.count.update(v => v + 1);
}
```

### 4.8 RxJS et Observables

Pour les flux asynchrones (HTTP, événements), Angular utilise **RxJS** :

```typescript
this.userService.getUsers()
  .pipe(map(users => users.filter(u => u.active)))
  .subscribe(users => this.users = users);
```

Dans le template, le pipe `async` gère automatiquement la souscription :

```html
@for (user of users$ | async; track user.id) {
  <p>{{ user.name }}</p>
}
```

### 4.9 Formulaires

Deux approches :
- **Template-driven** (`FormsModule`) : simple, basé sur `ngModel`.
- **Reactive Forms** (`ReactiveFormsModule`) : recommandé pour les formulaires complexes.

```typescript
form = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', Validators.required),
});
```

### 4.10 HttpClient

```typescript
// app.config.ts
providers: [provideHttpClient()]

// service
constructor(private http: HttpClient) {}
getData() { return this.http.get<Data[]>('/api/data'); }
```

### 4.11 Pipes

Les pipes transforment les données dans le template.

```html
{{ price | currency:'EUR' }}
{{ date | date:'dd/MM/yyyy' }}
{{ name | uppercase }}
```

### 4.12 Tests

- **Tests unitaires** : Karma + Jasmine (`ng test`)
- **Tests E2E** : Cypress, Playwright (`ng e2e` après ajout)

---

## 5. Cycle de développement type

1. `ng new` — créer le projet
2. `ng serve` — développer en local
3. `ng g component|service|...` — générer les briques
4. Écrire la logique et les tests
5. `ng test` — exécuter les tests
6. `ng build --configuration production` — préparer la mise en production
7. Déployer le contenu de `dist/` sur un serveur statique ou un CDN

---

## 6. Aller plus loin

- Documentation officielle : https://angular.dev
- Angular Material (UI) : `ng add @angular/material`
- State management : NgRx, Akita, signals
- PWA : `ng add @angular/pwa`
- SSR : `ng add @angular/ssr`
