# Exercices — Signals & Computed Signals en Angular

> **Prérequis** : Angular 17+, notions de base sur les composants.  
> **Objectif** : Maîtriser `signal()`, `.set()`, `.update()`, `computed()` et `effect()`.

---

## Rappel rapide

```typescript
import { signal, computed, effect } from '@angular/core';

// Créer un signal
const count = signal(0);

// Lire la valeur (toujours avec ())
console.log(count()); // 0

// Modifier
count.set(5);
count.update(v => v + 1);

// Valeur dérivée automatique
const double = computed(() => count() * 2);

// Effet de bord
effect(() => console.log('count vaut', count()));
```

---

## Exercice 1 — Compteur simple ⭐

**Contexte** : Le classique des classiques.

**Objectif** : Créer un composant avec un signal `compteur` initialisé à `0`.  
Afficher la valeur et proposer deux boutons : **+1** et **−1**.

**Contraintes** :
- Utiliser `.update()` pour modifier le signal.
- Le compteur ne doit pas passer en dessous de 0.

**Template attendu** :
```
Compteur : 3
[ − ] [ + ]
```

---

## Exercice 2 — Signal texte et affichage en temps réel ⭐

**Objectif** : Créer un signal `prenom` de type `string`.  
Relier un `<input>` à ce signal avec `(input)` et afficher en temps réel :

```
Bonjour, Marie !
```

**Contraintes** :
- Utiliser `$event.target` pour lire la valeur de l'input.
- Si le champ est vide, afficher : `Bonjour, inconnu !`

---

## Exercice 3 — Computed : surface d'un rectangle ⭐⭐

**Objectif** : Créer deux signals `largeur` et `hauteur` (nombres).  
Ajouter deux inputs de type `number` pour les modifier.  
Afficher la surface calculée automatiquement avec `computed()`.

**Formula** : `surface = largeur × hauteur`

**Affichage attendu** :
```
Largeur : 5   Hauteur : 3
Surface : 15 m²
```

---

## Exercice 4 — Toggle booléen ⭐

**Objectif** : Créer un signal `estVisible` de type `boolean`.  
Un bouton doit alterner entre afficher et masquer un message.  
Le texte du bouton doit changer en conséquence.

**Affichage** :
```
[ Masquer ]
👋 Ce message est visible !
```

---

## Exercice 5 — Computed : Moyenne scolaire ⭐⭐

**Objectif** : Créer trois signals `noteMath`, `noteFrancais`, `noteHistoire` (notes sur 20).  
Calculer la **moyenne** avec `computed()` et afficher la **mention** correspondante.

**Règle des mentions** :

| Moyenne | Mention |
|---------|---------|
| < 8 | Insuffisant ❌ |
| 8 – 9.9 | Passable 😐 |
| 10 – 11.9 | Assez bien 🙂 |
| 12 – 13.9 | Bien 👍 |
| ≥ 14 | Très bien ⭐ |

**Affichage attendu** :
```
Math : [15]   Français : [12]   Histoire : [10]
Moyenne : 12.33 / 20
Mention : Bien 👍
```

---

## Exercice 6 — Liste de tâches (Todo) ⭐⭐

**Objectif** : Gérer une liste de tâches avec des signals.

**Fonctionnalités** :
1. Un signal `taches` contenant un tableau de strings.
2. Un input pour saisir une nouvelle tâche.
3. Un bouton **Ajouter** qui appelle `.update()` pour pousser dans le tableau.
4. Un `computed()` `nbTaches` qui affiche le nombre de tâches.

**Affichage** :
```
[ Faire les courses        ] [Ajouter]
Nombre de tâches : 3
• Faire les courses
• Appeler le médecin
• Lire un livre
```

---

## Exercice 7 — Computed chaîné ⭐⭐⭐

**Objectif** : Partir d'un signal `temperature` en Celsius.  
Créer deux `computed()` chaînés :
- `fahrenheit = computed()` → conversion en °F
- `description = computed()` → basé sur `fahrenheit()`, retourner `'Froid'`, `'Tiède'` ou `'Chaud'`

**Règle** :
- < 50°F → Froid
- 50–77°F → Tiède  
- > 77°F → Chaud

---

## Exercice 8 — Effect : historique des valeurs ⭐⭐⭐

**Objectif** : Créer un signal `mot` (string).  
Utiliser `effect()` dans le constructeur pour pousser chaque nouvelle valeur dans un tableau `historique` (tableau classique, pas un signal).  
Afficher l'historique sous le champ.

**Point pédagogique** : `effect()` s'exécute automatiquement à chaque changement du signal qu'il lit.


---

## Exercice 9 — Panier minimal ⭐⭐⭐

**Objectif** : Créer un mini panier avec un signal `quantite` (nombre entier ≥ 0) et un signal `prixUnitaire`.

Afficher avec `computed()` :
- Le **sous-total** (`quantite × prixUnitaire`)
- La **TVA** (20% du sous-total)
- Le **total TTC** (sous-total + TVA)

Utiliser le pipe `currency:'EUR'` dans le template.


---

## Exercice 10 — Filtre de liste ⭐⭐⭐

**Objectif** : Créer un signal `recherche` (string) et un signal `produits` contenant une liste de noms.  
Ajouter un `computed()` `produitsFiltres` qui retourne uniquement les produits dont le nom contient la valeur du signal `recherche` (insensible à la casse).

**Données de départ** :
```typescript
produits = signal(['Pomme', 'Poire', 'Fraise', 'Mangue', 'Pastèque', 'Papaye']);
```

**Affichage** :
```
[ po            ]
• Pomme
• Poire
```


## Récapitulatif des concepts couverts

| Exercice | Concepts |
|----------|----------|
| 1 | `signal()`, `.update()` |
| 2 | `signal()`, `.set()`, binding input |
| 3 | `computed()` à deux sources |
| 4 | signal booléen, toggle |
| 5 | `computed()` imbriqué, moyenne, logique conditionnelle |
| 6 | signal tableau, `.update()` avec spread |
| 7 | `computed()` chaîné |
| 8 | `effect()`, effets de bord |
| 9 | `computed()` multiples, pipes |
| 10 | `computed()` + filtre sur tableau |
