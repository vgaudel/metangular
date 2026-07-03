# Internationaliser une application Angular (i18n)

## 1. Qu'est-ce que l'internationalisation ?

L'**internationalisation** (souvent abrégée **i18n** — *i*, puis 18 lettres, puis *n*) consiste à concevoir une application capable de s'adapter à plusieurs **langues** et **conventions régionales** (dates, nombres, devises) **sans réécrire le code**.

On distingue deux notions complémentaires :

| Terme | Sigle | Rôle |
| ----- | ----- | ---- |
| Internationalisation | i18n | Préparer l'application pour qu'elle **puisse** être traduite |
| Localisation | l10n | Fournir les **traductions et formats** d'une langue/région donnée (ex. `fr-FR`, `en-US`) |

> En clair : on **internationalise une fois**, on **localise autant de fois** qu'il y a de langues cibles.

---

## 2. Les deux grandes approches en Angular

Angular propose deux stratégies. Il est essentiel de choisir dès le départ, car elles n'ont pas le même fonctionnement.

| Approche | Principe | Quand l'utiliser |
| -------- | -------- | ---------------- |
| **i18n natif Angular** (`@angular/localize`) | Les traductions sont **compilées** : un *build* par langue | Sites vitrines, contenu stable, performances maximales, SEO |
| **Librairie runtime** (ex. `@ngx-translate/core`, `transloco`) | Les traductions sont **chargées dynamiquement** (fichiers JSON) | Changement de langue **à chaud**, applications métier multilingues |

Ce document présente **les deux**, en commençant par l'approche officielle.

---

## 3. Approche officielle : `@angular/localize`

### 3.1 Installation

```bash
ng add @angular/localize
```

Cette commande installe le paquet et ajoute la configuration nécessaire dans le projet.

### 3.2 Marquer un texte à traduire dans le template

On ajoute l'attribut `i18n` sur l'élément contenant le texte :

```html
<h1 i18n>Bienvenue sur notre plateforme</h1>

<!-- Avec une description et un sens (meaning) pour aider les traducteurs -->
<p i18n="@@accueil.intro">Gérez vos demandes en quelques clics</p>

<!-- Attribut traduisible (title, placeholder, etc.) -->
<input i18n-placeholder placeholder="Rechercher une demande" />
```

La syntaxe complète d'un identifiant est : `i18n="meaning|description@@id"`.

- **meaning** : contexte sémantique (ex. `bouton` vs `verbe`),
- **description** : aide pour le traducteur,
- **@@id** : identifiant **stable** et unique (fortement recommandé).

### 3.3 Pluriels et sélections (syntaxe ICU)

Angular gère les formes plurielles et conditionnelles via la syntaxe **ICU** :

```html
<span i18n>
  {nbDemandes, plural,
    =0 {Aucune demande}
    =1 {Une demande}
    other {{{ nbDemandes }} demandes}
  }
</span>

<span i18n>
  {genre, select,
    homme {Bienvenu}
    femme {Bienvenue}
    other {Bienvenue}
  }
</span>
```

### 3.4 Extraire les textes

```bash
ng extract-i18n --output-path src/locale
```

Génère un fichier `messages.xlf` (format **XLIFF**) contenant toutes les chaînes marquées. On le **duplique et traduit** pour chaque langue :

- `src/locale/messages.fr.xlf`
- `src/locale/messages.en.xlf`

Exemple d'unité à traduire :

```xml
<trans-unit id="accueil.intro" datatype="html">
  <source>Gérez vos demandes en quelques clics</source>
  <target>Manage your requests in just a few clicks</target>
</trans-unit>
```

### 3.5 Configurer les langues dans `angular.json`

```json
{
  "projects": {
    "camAngular": {
      "i18n": {
        "sourceLocale": "fr",
        "locales": {
          "en": "src/locale/messages.en.xlf"
        }
      },
      "architect": {
        "build": {
          "options": {
            "localize": true
          }
        }
      }
    }
  }
}
```

### 3.6 Construire et servir

```bash
# Build de toutes les langues (un dossier par locale)
ng build --localize

# Servir une langue précise en développement
ng serve --configuration=en
```

Le résultat produit **un dossier par langue** (ex. `dist/.../fr/`, `dist/.../en/`), généralement servis derrière une URL distincte (`/fr/`, `/en/`).

> ✅ **Avantage** : performances optimales, aucun coût au runtime, excellent pour le SEO.
> ⚠️ **Limite** : pas de changement de langue **sans rechargement** de page.

---

## 4. Approche runtime : `@ngx-translate`

À privilégier quand l'utilisateur doit **changer de langue à chaud** (sans recharger).

### 4.1 Installation

```bash
npm install @ngx-translate/core @ngx-translate/http-loader
```

### 4.2 Fichiers de traduction (JSON)

`public/i18n/fr.json` :

```json
{
  "ACCUEIL": {
    "TITRE": "Bienvenue sur notre plateforme",
    "INTRO": "Gérez vos demandes en quelques clics"
  },
  "DEMANDES": {
    "NB": "{{count}} demande(s)"
  }
}
```

`public/i18n/en.json` :

```json
{
  "ACCUEIL": {
    "TITRE": "Welcome to our platform",
    "INTRO": "Manage your requests in just a few clicks"
  },
  "DEMANDES": {
    "NB": "{{count}} request(s)"
  }
}
```

### 4.3 Configuration (application standalone, Angular 16+)

```ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function httpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, 'i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'fr',
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ),
  ],
};
```

### 4.4 Utilisation dans les templates

```html
<!-- Via le pipe translate -->
<h1>{{ 'ACCUEIL.TITRE' | translate }}</h1>
<p>{{ 'ACCUEIL.INTRO' | translate }}</p>

<!-- Avec un paramètre -->
<span>{{ 'DEMANDES.NB' | translate:{ count: nbDemandes } }}</span>

<!-- Via la directive -->
<h1 translate>ACCUEIL.TITRE</h1>
```

### 4.5 Changer de langue à l'exécution

```ts
import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-selecteur-langue',
  standalone: true,
  template: `
    <button (click)="changer('fr')">Français</button>
    <button (click)="changer('en')">English</button>
  `,
})
export class SelecteurLangueComponent {
  private translate = inject(TranslateService);

  changer(langue: string): void {
    this.translate.use(langue);
    localStorage.setItem('langue', langue); // mémoriser le choix
  }
}
```

> ✅ **Avantage** : bascule instantanée, idéale pour les applications métier.
> ⚠️ **Limite** : léger coût au runtime et moins optimal pour le SEO d'un site public.

---

## 5. Localiser dates, nombres et devises

Angular fournit des **pipes** qui s'adaptent automatiquement à la *locale* active.

### 5.1 Enregistrer les locales nécessaires

```ts
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';

registerLocaleData(localeFr);
registerLocaleData(localeEn);
```

### 5.2 Définir la locale active

```ts
import { LOCALE_ID } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
  ],
};
```

### 5.3 Utiliser les pipes localisés

```html
<!-- Date : 11 juin 2026 (fr) / June 11, 2026 (en) -->
<p>{{ today | date:'longDate' }}</p>

<!-- Nombre : 1 234,56 (fr) / 1,234.56 (en) -->
<p>{{ montant | number:'1.2-2' }}</p>

<!-- Devise : 1 234,56 € (fr) / $1,234.56 (en) -->
<p>{{ prix | currency:'EUR' }}</p>

<!-- Pourcentage -->
<p>{{ taux | percent:'1.0-1' }}</p>
```

On peut aussi forcer une locale ponctuellement : `{{ today | date:'longDate':'':'en-US' }}`.

---

## 6. Détecter la langue du navigateur

```ts
const langueNavigateur = navigator.language.split('-')[0]; // 'fr', 'en'...
const langueSauvegardee = localStorage.getItem('langue');
const langueInitiale = langueSauvegardee ?? langueNavigateur ?? 'fr';
this.translate.use(langueInitiale);
```

---

## 7. Tableau comparatif des deux approches

| Critère | `@angular/localize` | `@ngx-translate` |
| ------- | ------------------- | ---------------- |
| Moment de la traduction | Compilation (*build*) | Exécution (*runtime*) |
| Changement de langue à chaud | ❌ (rechargement) | ✅ |
| Performance | ⭐⭐⭐ | ⭐⭐ |
| SEO (site public) | ⭐⭐⭐ | ⭐ |
| Format des fichiers | XLIFF (`.xlf`) | JSON |
| Outillage officiel Angular | ✅ | ❌ (communauté) |
| Idéal pour | Sites vitrines, contenu stable | Applications métier multilingues |

---

## 8. Bonnes pratiques

- **Choisir l'approche en amont** : migrer de l'une à l'autre est coûteux.
- **Ne jamais coder les textes en dur** : centraliser dès le début dans des clés i18n.
- **Utiliser des identifiants stables** (`@@id` ou clés JSON explicites) : un texte source qui change ne doit pas casser les traductions.
- **Organiser les clés par domaine** (`ACCUEIL.*`, `DEMANDES.*`) pour faciliter la maintenance.
- **Gérer les pluriels** via ICU plutôt que par des `if` côté composant.
- **Mémoriser le choix de langue** (localStorage) et le restaurer au démarrage.
- **Confier la traduction à des professionnels** : fournir le contexte (description, captures) dans les fichiers d'extraction.
- **Tester chaque langue** : vérifier les débordements de texte (l'allemand est ~30 % plus long que le français).

---

## 9. Exercice de mise en pratique

> **Objectif** : rendre bilingue (FR/EN) un petit écran de liste de demandes.

1. Installer `@ngx-translate/core` et `@ngx-translate/http-loader`.
2. Créer `public/i18n/fr.json` et `public/i18n/en.json` avec les clés `LISTE.TITRE` et `LISTE.VIDE`.
3. Configurer `TranslateModule.forRoot()` dans `appConfig` avec `fr` par défaut.
4. Afficher le titre via `{{ 'LISTE.TITRE' | translate }}`.
5. Ajouter deux boutons « Français / English » qui appellent `translate.use(...)`.
6. Afficher le nombre de demandes avec un pluriel correct (clé paramétrée `{{count}}`).
7. **Bonus** : détecter la langue du navigateur au démarrage et mémoriser le choix dans `localStorage`.

---

## 10. Récapitulatif

1. **i18n** = préparer ; **l10n** = traduire et formater.
2. Deux approches : **`@angular/localize`** (compilé, performant, SEO) et **`@ngx-translate`** (runtime, bascule à chaud).
3. Marquer les textes : attribut `i18n` (officiel) ou pipe `| translate` (ngx-translate).
4. Gérer les **pluriels** avec la syntaxe **ICU**.
5. Localiser **dates, nombres, devises** via les pipes et `LOCALE_ID`.
6. Choisir l'approche **selon le besoin métier** dès le début du projet.
