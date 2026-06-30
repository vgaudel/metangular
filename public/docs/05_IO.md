# Exercices — Input properties et Output events en Angular

> **Prerequis** : Angular 17+, composants de base, signals.
> **Objectif** : Maitriser la communication entre composants parent et enfant via `input()` et `output()`.

---

## Rappel des concepts

### input() — Passer des donnees du parent vers l'enfant

```typescript
// Dans l'enfant
import { input } from '@angular/core';

// Avec valeur par defaut
titre = input('Sans titre');

// Requis (erreur si non fourni)
nom = input.required<string>();

// Type explicite avec defaut
prix = input<number>(0);
```

```html
<!-- Dans le template du parent -->
<app-enfant [titre]="monTitre" [nom]="monNom" />
```

### output() — Envoyer des evenements de l'enfant vers le parent

```typescript
// Dans l'enfant
import { output } from '@angular/core';

clicEffectue = output<string>();

onClick() {
  this.clicEffectue.emit('valeur envoyee');
}
```

```html
<!-- Dans le template du parent -->
<app-enfant (clicEffectue)="maMethode($event)" />
```

> **Syntaxe** : `input()` et `output()` sont les API modernes Angular 17+.
> Les lire dans le template : `{{ titre() }}` (ce sont des signal-functions).

---

## Exercice 1 — input() avec valeur par defaut (***)

**Contexte** : Un composant carte-de-visite affiche un nom et un poste.
Si le parent ne passe rien, des valeurs par defaut s'affichent.

**Composant enfant** `ei01-enfant` :
- `nom = input('Inconnu')` — string avec defaut
- `poste = input('Collaborateur')` — string avec defaut

**Composant parent** `ei01-carte` :
- Affiche trois fois le composant enfant avec des donnees differentes :
  1. Aucune propriete (valeurs par defaut)
  2. Uniquement `[nom]="'Marie Dupont'"`
  3. `[nom]` et `[poste]` tous les deux renseignes

**Affichage attendu** :
```
[Inconnu — Collaborateur]
[Marie Dupont — Collaborateur]
[Paul Martin — Developpeur Angular]
```

---

## Exercice 2 — input.required() avec logique conditionnelle (***)

**Contexte** : Un composant badge-note affiche la note d'un etudiant avec une couleur selon le resultat.

**Composant enfant** `ei02-enfant` :
- `note = input.required<number>()` — la note sur 20
- `prenom = input.required<string>()` — le prenom de l'etudiant
- Affiche la note avec la couleur correspondante :
  - Rouge si < 10
  - Orange si entre 10 et 13.9
  - Vert si >= 14

**Composant parent** `ei02-notes` :
- Declare un tableau de `{ prenom, note }` et affiche un badge par etudiant via `@for`

---

## Exercice 3 — input() avec une interface (***)

**Contexte** : Un composant affiche une fiche de contact a partir d'un objet.

**Etapes** :
1. Creer une interface `IContact { prenom: string, nom: string, email: string, ville: string }`.
2. **Composant enfant** `ei03-enfant` : recoit `contact = input.required<IContact>()` et affiche toutes ses proprietes.
3. **Composant parent** `ei03-contacts` : declare un tableau de contacts et les affiche via `@for`.

---

## Exercice 4 — input() dans une liste avec @for (****)

**Contexte** : Un composant affiche une grille de films. Chaque carte film est un composant enfant autonome.

**Interface** : `IFilm { titre: string, realisateur: string, annee: number, genre: string }`

**Composant enfant** `ei04-carte` :
- `film = input.required<IFilm>()`
- Affiche titre, realisateur, annee, genre

**Composant parent** `ei04-cinema` :
- Liste de 4 films hardcodes
- Iteration avec `@for` pour afficher les cartes

---

## Exercice 5 — output() sans donnee (void) (***)

**Contexte** : Un bouton d'alerte dans un composant enfant notifie le parent a chaque clic.

**Composant enfant** `ei05-enfant` :
- Un bouton "Declencher alerte"
- `alerte = output<void>()`
- Au clic, emet l'evenement sans donnee

**Composant parent** `ei05-alertes` :
- Ecoute l'evenement et incremente un compteur `nbAlertes`
- Affiche : `Alertes recues : 3`

---

## Exercice 6 — output() avec une donnee string (****)

**Contexte** : Un selecteur de couleur enfant emet la couleur choisie. Le parent l'applique a un bloc d'apercu.

**Composant enfant** `ei06-enfant` :
- Trois boutons : Rouge, Vert, Bleu
- `couleurChoisie = output<string>()`
- Au clic, emet la valeur CSS correspondante (`'red'`, `'green'`, `'blue'`)

**Composant parent** `ei06-couleur` :
- Signal `couleur = signal('gray')`
- Ecoute l'output et met a jour le signal
- Affiche un `<div>` dont le fond est la couleur selectionnee

---

## Exercice 7 — input() + output() : composant like/dislike (****)

**Contexte** : Un composant affiche le nom d'un article et permet de voter pour ou contre. Le parent cumule les votes.

**Composant enfant** `ei07-enfant` :
- `article = input.required<string>()` — nom de l'article
- `reaction = output<'like' | 'dislike'>()`
- Deux boutons : "Like" et "Dislike"

**Composant parent** `ei07-reactions` :
- Affiche trois articles via `@for`
- Pour chaque article, incremente les compteurs `likes` et `dislikes` (signals)
- Affiche les totaux

---

## Exercice 8 — input() + output() : champ de formulaire reutilisable (*****)

**Contexte** : On veut creer un composant champ-formulaire generique, reutilisable avec des libelles differents.

**Composant enfant** `ei08-enfant` :
- `libelle = input('Saisir une valeur')` — label du champ
- `placeholder = input('')`
- `valide = output<string>()` — emis quand on clique "Valider"
- Contient un `<input>` local (signal interne) et un bouton "Valider"

**Composant parent** `ei08-formulaire` :
- Utilise trois fois le composant enfant avec des libelles differents (Prenom, Ville, Metier)
- Affiche chaque valeur validee au fur et a mesure

---

## Exercice 9 — input() + output() : liste avec suppression (*****)

**Contexte** : Un gestionnaire de taches. Chaque tache est un composant enfant avec un bouton supprimer.

**Composant enfant** `ei09-tache` :
- `tache = input.required<string>()`
- `supprime = output<string>()` — emis avec le nom de la tache

**Composant parent** `ei09-todos` :
- Signal `taches = signal<string[]>(['Faire les courses', 'Appeler le medecin', 'Lire Angular docs'])`
- `@for` sur les taches
- Ecoute `supprime` et retire la tache du signal

---

## Exercice 10 — Combinaison complete : boutique interactive (*****)

**Contexte** : Une boutique affiche des produits. On peut ajouter chaque produit au panier.

**Interface** : `IProduitSimple { nom: string, prix: number, stock: number }`

**Composant enfant** `ei10-produit` :
- `produit = input.required<IProduitSimple>()`
- `ajouteAuPanier = output<IProduitSimple>()` — emis au clic sur le bouton
- Affiche nom, prix (`currency:'EUR'`), stock
- Desactive le bouton si `stock === 0`

**Composant parent** `ei10-boutique` :
- Liste de 4 produits
- Signal `panier = signal<IProduitSimple[]>([])`
- Ecoute `ajouteAuPanier`, ajoute le produit au panier
- Affiche le nombre d'articles dans le panier et le total

---

## Recapitulatif

| Exercice | Sens | Concepts |
|----------|------|----------|
| 1 | Parent -> Enfant | `input()` avec valeur par defaut |
| 2 | Parent -> Enfant | `input.required()`, `computed()` conditionnel |
| 3 | Parent -> Enfant | `input.required()` avec interface |
| 4 | Parent -> Enfant | `input()` + `@for` |
| 5 | Enfant -> Parent | `output<void>()` |
| 6 | Enfant -> Parent | `output<string>()` + binding style |
| 7 | Bidirectionnel | `input()` + `output()` |
| 8 | Bidirectionnel | `input()` + `output()` + composant reutilisable |
| 9 | Bidirectionnel | `input()` + `output()` + liste dynamique |
| 10 | Bidirectionnel | `input()` + `output()` + `computed()` + pipe |
