# Créer un Pipe personnalisé en Angular

## 1. Qu'est-ce qu'un pipe ?

Un **pipe** transforme une valeur affichée dans un template, sans modifier la donnée d'origine. Il s'utilise avec le caractère `|` :

```html
{{ valeur | nomDuPipe }}
{{ valeur | nomDuPipe:argument1:argument2 }}
```

Angular fournit des pipes natifs (`date`, `uppercase`, `lowercase`, `currency`, `decimal`, `json`, `async`, `slice`, etc.). Quand aucun ne correspond au besoin, on crée un **pipe personnalisé**.

---

## 2. Générer un pipe avec Angular CLI

```bash
ng generate pipe pipes/monPipe
# ou raccourci
ng g p pipes/monPipe
```

Cela crée deux fichiers :

- `mon-pipe.pipe.ts`
- `mon-pipe.pipe.spec.ts`

Et, dans un projet **NgModule**, ajoute automatiquement le pipe aux `declarations` du module.

---

## 3. Anatomie d'un pipe

Un pipe est une classe :

- décorée avec `@Pipe({ name: '...' })`
- qui implémente l'interface `PipeTransform`
- avec une méthode `transform(value, ...args)`

### 3.1 Pipe standalone (Angular 16+, recommandé)

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exclamation',
  standalone: true,
})
export class ExclamationPipe implements PipeTransform {
  transform(value: string, nb: number = 1): string {
    if (!value) return '';
    return value + '!'.repeat(nb);
  }
}
```

Utilisation dans un composant standalone :

```ts
import { Component } from '@angular/core';
import { ExclamationPipe } from './pipes/exclamation.pipe';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ExclamationPipe],
  template: `<p>{{ 'Bonjour' | exclamation:3 }}</p>`, // Bonjour!!!
})
export class DemoComponent {}
```

### 3.2 Pipe dans un NgModule (style classique)

```ts
@NgModule({
  declarations: [ExclamationPipe, MonComposant],
  exports: [ExclamationPipe],
})
export class SharedModule {}
```

---

## 4. Exemples concrets

### 4.1 Pipe `truncate` — tronquer un texte

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 20, suffix: string = '...'): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + suffix : value;
  }
}
```

```html
<p>{{ article.description | truncate:50 }}</p>
<p>{{ article.description | truncate:50:' [lire +]' }}</p>
```

### 4.2 Pipe `filter` — filtrer une liste

```ts
@Pipe({ name: 'filterBy', standalone: true })
export class FilterByPipe implements PipeTransform {
  transform<T>(items: T[], field: keyof T, search: string): T[] {
    if (!items) return [];
    if (!search) return items;
    const s = search.toLowerCase();
    return items.filter(i => String(i[field]).toLowerCase().includes(s));
  }
}
```

```html
<input [(ngModel)]="recherche" placeholder="Rechercher" />
<ul>
  <li *ngFor="let u of users | filterBy:'nom':recherche">{{ u.nom }}</li>
</ul>
```

### 4.3 Pipe `timeAgo` — date relative

```ts
@Pipe({ name: 'timeAgo', standalone: true })
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    const date = new Date(value);
    const sec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (sec < 60) return `il y a ${sec} s`;
    if (sec < 3600) return `il y a ${Math.floor(sec / 60)} min`;
    if (sec < 86400) return `il y a ${Math.floor(sec / 3600)} h`;
    return `il y a ${Math.floor(sec / 86400)} j`;
  }
}
```

```html
<span>{{ commentaire.date | timeAgo }}</span>
```

### 4.4 Pipe `safeHtml` — injecter du HTML sécurisé

```ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'safeHtml', standalone: true })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
```

```html
<div [innerHTML]="contenuHtml | safeHtml"></div>
```

> Attention : à n'utiliser que sur du contenu **de confiance** (risque XSS).

---

## 5. Pipes purs vs impurs

Par défaut, un pipe est **pur** : il n'est ré-évalué que si la **référence** de l'entrée change. C'est performant, mais cela ne détecte pas les modifications internes d'un tableau ou d'un objet (`push`, mutation de propriété…).

Pour forcer une évaluation à chaque cycle de détection de changement :

```ts
@Pipe({
  name: 'filterBy',
  standalone: true,
  pure: false, // pipe impur
})
export class FilterByPipe implements PipeTransform { /* ... */ }
```

| Type   | Quand recalculé ?                          | Performance |
| ------ | ------------------------------------------ | ----------- |
| Pur    | Changement de référence ou de valeur prim. | Excellente  |
| Impur  | À chaque détection de changement           | À surveiller |

**Bonne pratique** : préférer un pipe pur et créer un nouveau tableau (`[...arr]`) plutôt que muter l'existant.

---

## 6. Chaîner plusieurs pipes

```html
{{ user.nom | uppercase | truncate:10 }}
{{ today | date:'fullDate' | uppercase }}
```

Les pipes s'appliquent **de gauche à droite**.

---

## 7. Utiliser un pipe dans le code TypeScript

Un pipe est une classe injectable : on peut l'appeler depuis un composant ou un service.

```ts
@Component({
  standalone: true,
  imports: [TruncatePipe],
  providers: [TruncatePipe], // pour l'injecter
  template: `...`,
})
export class ArticleComponent {
  constructor(private truncate: TruncatePipe) {}

  resume(text: string): string {
    return this.truncate.transform(text, 80);
  }
}
```

---

## 8. Tester un pipe

```ts
import { ExclamationPipe } from './exclamation.pipe';

describe('ExclamationPipe', () => {
  const pipe = new ExclamationPipe();

  it('ajoute un point d\'exclamation par défaut', () => {
    expect(pipe.transform('Salut')).toBe('Salut!');
  });

  it('ajoute n points d\'exclamation', () => {
    expect(pipe.transform('Salut', 3)).toBe('Salut!!!');
  });

  it('retourne une chaîne vide si la valeur est falsy', () => {
    expect(pipe.transform('')).toBe('');
  });
});
```

---

## 9. Bonnes pratiques

- **Nom du pipe** : camelCase (`monPipe`), jamais le même nom qu'un pipe natif.
- **Pur par défaut** : n'utiliser `pure: false` qu'en dernier recours.
- **Logique légère** : un pipe est appelé à chaque rendu, éviter les calculs lourds.
- **Pas d'effets de bord** : un pipe doit être déterministe (même entrée → même sortie).
- **Réutilisabilité** : regrouper les pipes partagés dans un `SharedModule` ou les exporter en standalone.
- **Typage** : typer `value` et le retour pour profiter de l'auto-complétion.

---

## 10. Récapitulatif

1. `ng g p pipes/monPipe`
2. Implémenter `PipeTransform.transform()`
3. Importer le pipe (standalone) ou le déclarer (NgModule)
4. L'utiliser via `|` dans le template
5. Tester avec une instanciation directe de la classe
