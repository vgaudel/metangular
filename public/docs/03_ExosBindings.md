# Exercices — Bindings et Control Flow en Angular

> **Prerequis** : Angular 17+, composants standalone.
> **Objectif** : Maitriser les differents types de bindings et la nouvelle syntaxe de control flow (`@if`, `@for`, `@switch`).

---

## Rappel des concepts

### Les types de bindings

| Type | Syntaxe | Sens | Exemple |
|------|---------|------|---------|
| Interpolation     | `{{ expr }}`           | TS -> HTML | `<p>{{ nom }}</p>` |
| Property binding  | `[prop]="expr"`        | TS -> DOM  | `<img [src]="url">` |
| Class binding     | `[class.x]="bool"`     | TS -> DOM  | `[class.actif]="ok"` |
| Style binding     | `[style.x]="expr"`     | TS -> DOM  | `[style.color]="c"` |
| Event binding     | `(event)="fn($event)"` | DOM -> TS  | `(click)="ajouter()"` |
| Two-way binding   | `[(ngModel)]="..."`    | TS <-> DOM | `[(ngModel)]="nom"` |

> Les donnees du composant sont de simples proprietes de classe TypeScript.
> Le two-way binding `[(ngModel)]` necessite l'import de `FormsModule` dans le composant.

### Le control flow (Angular 17+)

```html
@if (cond) { ... } @else if (cond2) { ... } @else { ... }

@for (item of liste ; track item.id) { ... } @empty { ... }

@switch (valeur) {
  @case ('a') { ... }
  @case ('b') { ... }
  @default   { ... }
}
```

> **Important** : `@for` exige obligatoirement `track`.

---

## Exercice 1 — Interpolation simple (***)

**Composant** `eb01-interpolation`.

**Donnees** :
- `prenom = 'Alice'`
- `age = 28`
- `prixHT = 120`
- `tva = 0.20` (constante)

**Affichage attendu** :
```
Bonjour Alice, vous avez 28 ans.
ALICE en majuscules.
Prix HT : 120 €
Prix TTC : 144 €
```

**Notions** : interpolation `{{ }}`, expression `age + 5`, methode `prenom.toUpperCase()`, getter ou propriete calculee `prixTTC`.

---

## Exercice 2 — Property binding (***)

**Composant** `eb02-property`.

**Donnees** :
- `imageUrl = 'https://picsum.photos/200'`
- `lien = 'https://angular.dev'`
- `desactive = true`

**Template attendu** :
- Une `<img>` avec `[src]` et `[alt]` lies aux proprietes
- Un `<a>` avec `[href]` qui ouvre Angular.dev
- Un `<button [disabled]="desactive">` qui se desactive
- Un bouton "Activer / Desactiver" qui inverse `desactive`

**Notions** : `[src]`, `[href]`, `[disabled]`, attention a `[src]` (binding) vs `src=` (litteral).

---

## Exercice 3 — Class binding (****)

**Composant** `eb03-classes`.

**Donnees** :
- `actif = false`
- `theme: 'clair' | 'sombre' = 'clair'`

**Template attendu** :
- Un `<div>` avec `[class.actif]="actif"` (bordure verte si actif)
- Le meme `<div>` avec `[class]="theme"` (classes `clair` ou `sombre` qui changent fond et couleur)
- Deux boutons : "Toggle actif", "Inverser theme"

**Styles a prevoir (SCSS)** : `.actif { border: 3px solid green; }`, `.clair { background:#fff; color:#000; }`, `.sombre { background:#222; color:#fff; }`.

---

## Exercice 4 — Style binding (****)

**Composant** `eb04-styles`.

**Donnees** :
- `taille = 16` (px)
- `couleur = '#3366ff'`

**Template attendu** :
- Un paragraphe `[style.font-size.px]="taille"` et `[style.color]="couleur"`
- Un `<input type="range" min="10" max="60">` lie a `taille` (event binding sur `input`)
- Un `<input type="color">` lie a `couleur`

**Notions** : `[style.prop.unite]`, lecture de `$event.target.value` avec un cast TypeScript.

---

## Exercice 5 — Event binding (***)

**Composant** `eb05-events`.

**Donnees** :
- `compteur = 0`
- `dernierePosition = { x: 0, y: 0 }`

**Template attendu** :
- Un bouton "Incrementer" `(click)="incrementer()"`
- Un bouton "Reset" `(click)="reset()"`
- Un `<div>` qui affiche la position de la souris au survol via `(mousemove)="onMove($event)"`
- Affichage : `Compteur : 5` / `Position : x=120 y=45`

**Notions** : `(click)`, `(mousemove)`, `$event` type comme `MouseEvent`.

---

## Exercice 6 — Two-way binding avec `[(ngModel)]` (****)

**Composant** `eb06-twoway`.

**Donnees** :
- `nom = ''`
- `age = 20`
- `accepte = false`

**Template attendu** :
- `<input [(ngModel)]="nom" name="nom">`
- `<input type="number" [(ngModel)]="age" name="age">`
- `<input type="checkbox" [(ngModel)]="accepte" name="accepte">`
- En dessous : recap en temps reel `Nom: ... Age: ... Accepte: oui/non`
- Bouton "Reset" qui remet tout a zero

> **Important** : il faut importer `FormsModule` dans le composant pour utiliser `ngModel`,
> et chaque champ doit avoir un attribut `name` unique.

---

## Exercice 7 — `@if` / `@else if` / `@else` (****)

**Composant** `eb07-if`.

**Donnees** :
- `temperature = 20`
- Un `<input type="number" [(ngModel)]>` pour la modifier

**Affichage attendu selon la temperature** :
- `< 0` -> "Il gele !" (couleur bleue)
- `0 a 14` -> "Il fait frais."
- `15 a 25` -> "Temperature agreable."
- `26 a 34` -> "Il fait chaud."
- `>= 35` -> "Canicule !" (couleur rouge)

**Notions** : `@if / @else if / @else`, plusieurs branches.

---

## Exercice 8 — `@for` avec `track` et `@empty` (*****)

**Composant** `eb08-for`.

**Donnees** :
- Une interface `ITache { id: number, libelle: string }`
- `taches: ITache[]` initialise avec 3 taches
- `nouvelle = ''` (pour le champ d'ajout)

**Template attendu** :
- `<input [(ngModel)]>` + bouton "Ajouter" pour ajouter une tache (id auto-incremente)
- Liste `@for(t of taches ; track t.id ; let i = $index, e = $even)` :
  - Affiche `1. Apprendre @if` (utilise `i + 1`)
  - Ajoute la classe `pair` quand `e` est `true`
  - Bouton "Supprimer" pour retirer la tache (filtrage par id)
- `@empty { <li>Aucune tache.</li> }`

**Notions** : `@for` avec `track`, variables contextuelles `$index`, `$even`, bloc `@empty`.

---

## Exercice 9 — `@switch` (****)

**Composant** `eb09-switch`.

**Donnees** :
- `role: 'admin' | 'user' | 'guest' | 'autre' = 'user'`
- Un `<select [(ngModel)]>` permet de choisir parmi `admin`, `user`, `guest`, `autre`

**Affichage attendu** :
- `admin`  -> bandeau rouge "Acces total"
- `user`   -> bandeau bleu "Acces limite"
- `guest`  -> bandeau gris "Lecture seule"
- defaut   -> bandeau noir "Role inconnu"

**Notions** : `@switch / @case / @default`, classes conditionnelles selon role.

---

## Exercice 10 — Combinaison complete : panier filtrable (*****)

**Composant** `eb10-combine`.

**Interface** :
```typescript
interface IArticle {
  id: number;
  nom: string;
  prix: number;
  categorie: 'fruit' | 'legume' | 'boisson';
  stock: number;
}
```

**Donnees** :
- `articles: IArticle[]` avec 6 articles varies (pomme, carotte, jus d'orange, etc.)
- `filtre: 'tous' | 'fruit' | 'legume' | 'boisson' = 'tous'`
- `cacherRupture = false`
- Un getter `articlesFiltres` qui applique les deux filtres

**Template attendu** :
- 4 boutons de filtre (Tous / Fruits / Legumes / Boissons) avec `[class.actif]` sur le filtre courant (class binding)
- Une checkbox "Cacher les ruptures" en two-way
- `@for (a of articlesFiltres ; track a.id)` :
  - Carte article avec `[style.opacity]` = `0.4` si stock = 0
  - Badge categorie via `@switch` (couleur differente par categorie : vert/orange/bleu)
  - Bouton "Acheter" `[disabled]="a.stock === 0"`
  - Au clic, decremente le stock (passe en rupture quand il atteint 0)
- `@empty { Aucun article. }`
- Recap : `Articles affiches : N / Total : M`

**Notions** : tous les bindings + tout le control flow + getter pour la liste filtree.

---

## Recapitulatif

| Exercice | Concept principal |
|----------|------------------|
| 1  | Interpolation `{{ }}` |
| 2  | Property binding `[prop]` |
| 3  | Class binding `[class.x]` / `[class]` |
| 4  | Style binding `[style.x]` |
| 5  | Event binding `(event)` |
| 6  | Two-way binding `[(ngModel)]` |
| 7  | `@if / @else if / @else` |
| 8  | `@for` + `track` + `@empty` |
| 9  | `@switch / @case / @default` |
| 10 | Combinaison complete |

> Les corrections sont fournies dans chaque sous-dossier `ebXX-*`.
