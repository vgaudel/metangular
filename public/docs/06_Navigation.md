# La navigation avec le routeur Angular

Ce guide explique le fonctionnement du **routeur Angular** : comment définir des routes, naviguer entre les vues, passer des paramètres et protéger l'accès. Les exemples s'appuient sur le projet `camAngular`.

---

## 1. À quoi sert le routeur ?

Une application Angular est une **Single Page Application (SPA)** : une seule page HTML est chargée, et le routeur **échange dynamiquement les composants** affichés selon l'URL, sans recharger la page.

Le routeur associe :

```
URL du navigateur   ───►   Composant à afficher
/welcome            ───►   Welcome
/pipes              ───►   Pipes
/demandesfromback   ───►   DemandeBackEnd
```

---

## 2. Mise en place du routeur

### 2.1 Déclarer les providers (`app.config.ts`)

Le routeur est fourni à l'application via `provideRouter(routes)` :

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // ... autres providers (HttpClient, PrimeNG, etc.)
  ],
};
```

### 2.2 Le point d'affichage : `<router-outlet>`

Le composant correspondant à la route est inséré là où se trouve la balise `<router-outlet>`, généralement dans `app.html` :

```html
<app-header [titleHeader]="title()" />
<h1>Camangular</h1>

<!-- Le composant de la route active s'affiche ici -->
<router-outlet />

<app-footer />
```

> Tout ce qui entoure le `<router-outlet>` (header, footer) reste affiché : seule la zone de l'outlet change.

---

## 3. Définir les routes (`app.routes.ts`)

Une route est un objet `{ path, component }`. L'ensemble est un tableau de type `Routes` :

```typescript
import { Routes } from '@angular/router';
import { Welcome } from './components/welcome/welcome';
import { Pipes } from './components/pipes/pipes';
import { NotFound } from './components/not-found/not-found';

export const routes: Routes = [
  // Route normale
  { path: 'welcome', component: Welcome },
  { path: 'pipes', component: Pipes },

  // Redirection : '' (racine) renvoie vers /welcome
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },

  // Route avec paramètre dynamique (voir §6)
  { path: 'exos-io/:numExo', component: ExosIO },

  // Route "catch-all" : toute URL inconnue → page 404
  { path: '**', component: NotFound },
];
```

### Points importants sur l'ordre et les chemins

| Élément | Rôle |
|---|---|
| `path: 'welcome'` | Chemin **sans** le `/` initial |
| `redirectTo` + `pathMatch: 'full'` | Redirige une URL exacte vers une autre route |
| `path: ':numExo'` | Segment **dynamique** (paramètre d'URL) |
| `path: '**'` | Joker : capture toutes les URLs non reconnues |

> **L'ordre compte.** Angular prend la **première** route qui correspond. Le joker `'**'` doit donc toujours être **en dernier**.

---

## 4. Naviguer avec des liens : `routerLink`

Dans un template, on remplace le `href` classique par la directive **`routerLink`** (qui évite le rechargement de la page). Il faut importer `RouterLink` dans le composant.

**Composant** (`header.ts`) :

```typescript
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink], // ← indispensable pour utiliser routerLink
  templateUrl: './header.html',
})
export class Header {
  titleHeader = input.required<string>();
}
```

**Template** (`header.html`) :

```html
<a routerLink="/basics"> Bases d'Angular </a>
<a routerLink="/pipes"> Pipes </a>
<a routerLink="/demandesfromback"> Demandes </a>
<a routerLink="/demandesfromback-table"> Demandes (table) </a>
```

### Lien actif : `routerLinkActive`

Pour appliquer un style au lien correspondant à la page courante :

```html
<a routerLink="/pipes" routerLinkActive="lien-actif"> Pipes </a>
```

```scss
.lien-actif {
  font-weight: bold;
  text-decoration: underline;
}
```

---

## 5. Naviguer depuis le code : le service `Router`

Pour rediriger l'utilisateur **par programmation** (après un clic, une connexion, etc.), on injecte le service `Router`.

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({ /* ... */ })
export class Header {
  private _router = inject(Router);

  goToWelcome() {
    // Navigue vers /welcome
    this._router.navigate(['welcome']);
  }
}
```

```html
<b (click)="goToWelcome()">{{ titleHeader() }}</b>
```

> `navigate()` prend un **tableau de segments**. Exemple avec paramètre :
> `this._router.navigate(['exos-io', 3])` → `/exos-io/3`.

---

## 6. Passer des paramètres dans l'URL

### 6.1 Paramètre de route (`:param`)

La route déclare un segment dynamique :

```typescript
{ path: 'exos-io/:numExo', component: ExosIO },
```

On peut alors ouvrir `/exos-io/5`. Le composant lit le paramètre via `ActivatedRoute`.

**Lecture en lisant le signal (API moderne)** :

```typescript
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({ /* ... */ })
export class ExosIO {
  private route = inject(ActivatedRoute);

  ngOnInit() {
    // Lecture ponctuelle (instantané)
    const num = this.route.snapshot.paramMap.get('numExo');
    console.log('Exercice n°', num);

    // Lecture réactive (si le paramètre change sans détruire le composant)
    this.route.paramMap.subscribe(params => {
      console.log('numExo =', params.get('numExo'));
    });
  }
}
```

> **`snapshot`** suffit si le composant est recréé à chaque changement d'URL.
> **`paramMap.subscribe`** est nécessaire quand on navigue de `/exos-io/1` vers `/exos-io/2` (même composant réutilisé).

### 6.2 Paramètre optionnel via deux routes

Dans ce projet, deux routes pointent vers le même composant — avec ou sans paramètre :

```typescript
{ path: 'exos-io/:numExo', component: ExosIO },
{ path: 'exos-io', component: ExosIO },
```

### 6.3 Query params (`?cle=valeur`)

Pour des paramètres optionnels de type filtre ou tri :

```html
<a [routerLink]="['/pipes']" [queryParams]="{ tri: 'asc', page: 2 }">
  Pipes triés
</a>
```

```typescript
// URL générée : /pipes?tri=asc&page=2
this.route.snapshot.queryParamMap.get('tri'); // 'asc'
```

---

## 7. Routes imbriquées (enfants)

Une route peut contenir des **routes enfants**, affichées dans un second `<router-outlet>` placé dans le composant parent.

```typescript
{
  path: 'admin',
  component: Admin,
  children: [
    { path: 'users', component: AdminUsers },     // /admin/users
    { path: 'stats', component: AdminStats },      // /admin/stats
    { path: '', redirectTo: 'users', pathMatch: 'full' },
  ],
},
```

```html
<!-- Template de Admin -->
<nav>
  <a routerLink="users"> Utilisateurs </a>
  <a routerLink="stats"> Statistiques </a>
</nav>
<router-outlet />  <!-- les composants enfants s'affichent ici -->
```

---

## 8. Protéger une route : les guards

Un **guard** autorise ou bloque l'accès à une route (ex. : page réservée aux utilisateurs connectés). API moderne : une simple fonction `CanActivateFn`.

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthDemandeService } from './services/auth-demande-service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthDemandeService);
  const router = inject(Router);

  if (auth.token()) {
    return true; // accès autorisé
  }
  // Sinon, redirige vers la page de connexion
  return router.parseUrl('/welcome');
};
```

```typescript
// Application du guard sur une route
{
  path: 'demandesfromback',
  component: DemandeBackEnd,
  canActivate: [authGuard],
},
```

---

## 9. Chargement différé (lazy loading)

Pour ne charger le code d'une route **que lorsqu'elle est visitée** (et alléger le bundle initial), on utilise `loadComponent` :

```typescript
{
  path: 'primeng',
  loadComponent: () =>
    import('./components/exos-primeng/exos-primeng').then(m => m.ExosPrimeng),
},
```

> Le composant `ExosPrimeng` ne sera téléchargé qu'au moment où l'utilisateur ouvre `/primeng`.

---

## 10. Récapitulatif

| Besoin | Outil |
|---|---|
| Fournir le routeur | `provideRouter(routes)` dans `app.config.ts` |
| Afficher la route active | `<router-outlet />` |
| Définir les routes | tableau `Routes` dans `app.routes.ts` |
| Lien de navigation | `routerLink="/chemin"` (importer `RouterLink`) |
| Style du lien actif | `routerLinkActive="classe"` |
| Naviguer depuis le code | `inject(Router).navigate([...])` |
| Lire un paramètre d'URL | `inject(ActivatedRoute)` + `paramMap` |
| Page 404 | route `{ path: '**', component: NotFound }` (en dernier) |
| Routes enfants | propriété `children` + second `<router-outlet>` |
| Protéger une route | `canActivate: [guard]` |
| Charger à la demande | `loadComponent: () => import(...)` |

---

## 11. Pour s'entraîner

1. Ajouter une route `/a-propos` pointant vers un nouveau composant `APropos`, et un lien dans le header.
2. Créer une route `/produit/:id` qui affiche l'identifiant lu via `ActivatedRoute`.
3. Mettre en place `routerLinkActive` pour souligner le lien de la page courante.
4. Protéger la route `/demandesfromback` avec un `authGuard` qui vérifie la présence d'un token.
5. Transformer la route `/primeng` en **lazy loading** avec `loadComponent`.
