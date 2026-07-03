# Publier l’application monProjet sur GitHub Pages

## Objectif

Ce document explique, pas à pas, comment mettre en ligne l’application Angular monProjet sur **GitHub Pages**.

Le but est d’obtenir une URL publique du type :

```text
https://votre-compte.github.io/nom-du-repo/
```

---

## 1. Comprendre l’idée générale

GitHub Pages permet d’héberger un site statique gratuitement.

Une application Angular compilée peut être publiée sur ce type d’hébergement, à condition de :

1. construire l’application,
2. envoyer les fichiers générés dans un dépôt GitHub,
3. activer GitHub Pages.

---

## 2. Pré-requis

Avant de commencer, il faut avoir :

- un compte GitHub,
- un dépôt GitHub pour le projet,
- Git installé sur le poste,
- l’application Angular qui compile correctement.

Dans ce projet, la compilation fonctionne avec :

```bash
npm run build
```

---

## 3. Créer ou utiliser un dépôt GitHub

Si le dépôt n’existe pas encore :

1. aller sur GitHub,
2. cliquer sur **New repository**, 
3. donner un nom au dépôt,
4. créer le dépôt.

Exemple :

```text
mon-projet
```

---

## 4. Envoyer le projet sur GitHub

Depuis le terminal, dans le dossier du projet :

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_COMPTE/mon-projet.git
git push -u origin main
```

Si le dépôt existe déjà, il suffit de faire les commandes classiques de commit et push.

---

## 5. Faire un build adapté à GitHub Pages

Avec GitHub Pages, l’application est souvent servie dans un sous-dossier correspondant au nom du dépôt.

Il faut donc préciser le base href lors du build.

Exemple si le dépôt s’appelle mon-projet :

```bash
ng build --base-href "/mon-projet/"
```

ou selon votre configuration :

```bash
npm run build -- --base-href "/mon-projet/"
```

> Le nom utilisé dans le base href doit correspondre exactement au nom du dépôt GitHub.

---

## 6. Où se trouvent les fichiers à publier ?

Après le build, Angular génère les fichiers dans :

```text
dist/monProjet/browser
```

C’est ce contenu qu’il faudra publier.

---

## 7. Méthode simple avec la branche gh-pages

Une méthode courante consiste à publier le contenu du dossier généré dans une branche spéciale :

```text
gh-pages
```

### Principe

- la branche main contient le code source,
- la branche gh-pages contient les fichiers compilés.

---

## 8. Publication avec le package angular-cli-ghpages

Une méthode pratique consiste à utiliser l’outil dédié.

### Installation

Dans le projet Angular :

```bash
npm install -D angular-cli-ghpages
```

### Publication

Après le build, lancer :

```bash
npx angular-cli-ghpages --dir=dist/monProjet/browser
```

Cette commande envoie les fichiers compilés vers la branche gh-pages.

---

## 9. Activer GitHub Pages sur le dépôt

Sur GitHub :

1. ouvrir le dépôt,
2. aller dans **Settings**, 
3. ouvrir la section **Pages**, 
4. choisir la source : **Deploy from a branch**, 
5. sélectionner la branche **gh-pages**, 
6. enregistrer.

GitHub fournit ensuite une URL publique.

---

## 10. Adresse finale du site

L’adresse ressemblera à ceci :

```text
https://VOTRE_COMPTE.github.io/mon-projet/
```

Il faut parfois attendre une ou deux minutes avant que le site soit disponible.

---

## 11. Point d’attention très important : le backend

GitHub Pages héberge uniquement le frontend statique.

Cela signifie que :
- Angular peut être publié sur GitHub Pages,
- mais votre API Node/Express ne sera pas hébergée automatiquement dessus.

Si votre application appelle une API avec une URL comme :

```text
http://localhost:3000
```

cela ne fonctionnera pas pour les utilisateurs en ligne.

Il faudra donc :

- héberger le backend ailleurs,
- remplacer l’URL locale par une vraie URL publique,
- vérifier que le serveur autorise bien les requêtes CORS.

---

## 12. Vérifications après publication

Une fois le site publié, il faut vérifier :

- que l’URL s’ouvre bien,
- que la page d’accueil s’affiche,
- que le routage Angular fonctionne,
- que les styles sont chargés,
- que les appels HTTP répondent correctement.

---

## 13. Résumé ultra simple

Pour publier sur GitHub Pages :

1. je pousse mon projet sur GitHub,
2. je fais un build avec le bon base href,
3. je publie le dossier dist/monProjet/browser,
4. j’active GitHub Pages dans les réglages du dépôt,
5. je teste l’URL publique.

---

## 14. Exemple de séquence complète

```bash
cd monProjet
npm install
ng build --base-href "/mon-projet/"
npm install -D angular-cli-ghpages
npx angular-cli-ghpages --dir=dist/monProjet/browser
```

---

## Conclusion pédagogique

GitHub Pages est une bonne solution pour montrer une application Angular en ligne rapidement.

C’est très pratique pour :
- un exercice,
- un portfolio,
- une démonstration,
- un rendu de formation.

> En revanche, si l’application dépend d’une API, il faudra aussi penser à publier le backend séparément.
