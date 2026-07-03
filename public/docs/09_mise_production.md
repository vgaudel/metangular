# Mise en production de l’application

## Objectif

À la fin de ce document, vous saurez comment préparer et publier l’application Angular  pour qu’elle puisse être utilisée en dehors du poste de développement.

L’idée générale est simple :

1. vérifier que le projet fonctionne en local,
2. fabriquer une version optimisée,
3. déposer les fichiers générés sur un hébergement,
4. vérifier que l’application communique bien avec son API.

---

## 1. Comprendre la différence entre développement et production

Pendant la semaine, vous avez surtout travaillé en mode développement.

Dans ce mode :
- Angular recharge souvent l’application automatiquement,
- les messages d’erreur sont plus détaillés,
- les fichiers ne sont pas encore optimisés.

La mise en production consiste à générer une version :
- plus légère,
- plus rapide,
- prête à être publiée.

---

## 2. Pré-requis

Avant de lancer la mise en production, il faut vérifier :

- que Node.js et npm sont installés,
- que les dépendances du projet sont présentes,
- que l’application compile sans erreur,
- que le backend utilisé par l’application est également disponible.

Dans ce projet, la commande utile pour construire l’application est :

```bash
npm run build
```

---

## 3. Se placer dans le bon dossier

Ouvrez un terminal dans le dossier du projet Angular, puis placez-vous dans le répertoire tpAMU.

```bash
cd tpAMU
```

Si nécessaire, installez les dépendances :

```bash
npm install
```

---

## 4. Tester le projet avant publication

Avant de publier, il faut vérifier que le projet fonctionne en local.

Pour cela, on peut utiliser :

```bash
npm start
```

ou

```bash
ng serve
```

Ensuite, on ouvre l’application dans le navigateur et on vérifie :
- l’affichage,
- la navigation,
- les formulaires,
- les appels HTTP.

> En formation, c’est une bonne habitude : on vérifie d’abord localement avant de publier.

---

## 5. Générer la version de production

Une fois les vérifications terminées, on lance la construction de production :

```bash
npm run build
```

Dans ce projet, Angular génère les fichiers dans le dossier suivant :

```text
dist/tpAMU/browser
```

Ce dossier contient les fichiers prêts à être mis en ligne :
- le HTML,
- le JavaScript compilé,
- le CSS,
- les ressources statiques.

---

## 6. Ce que fait Angular pendant le build

Quand Angular construit l’application pour la production, il :

- compacte les fichiers,
- optimise le chargement,
- ajoute des noms de fichiers sécurisés avec hachage,
- prépare une version plus performante.

Autrement dit, on ne publie pas le dossier src, on publie le résultat du dossier dist.

---

## 7. Publier l’application

### Cas le plus simple : hébergement statique

Une application Angular compilée peut être déposée sur un hébergement statique, par exemple :

- Netlify,
- Vercel,
- GitHub Pages,
- un serveur Apache,
- un serveur Nginx,
- un serveur IIS sous Windows.

Dans tous les cas, le principe reste le même :

1. prendre le contenu de dist/tpAMU/browser,
2. l’envoyer sur le serveur web,
3. configurer le serveur pour renvoyer vers index.html si on utilise le routage Angular.

---

## 8. Attention au backend et aux appels HTTP

C’est le point le plus important pour ce projet.

Pendant le développement, certains appels HTTP utilisent une adresse du type :

```text
http://localhost:3000
```

Cela fonctionne sur votre machine, mais en production, localhost désigne la machine du visiteur, pas votre serveur.

Il faut donc prévoir une vraie URL de backend, par exemple :

```text
https://mon-api.exemple.com
```

### Conséquence pratique

Avant la vraie mise en ligne, il faut :

- déployer aussi le backend,
- remplacer les URL locales par une URL de production,
- vérifier les règles CORS côté serveur si nécessaire.

---

## 9. Bonne pratique recommandée : utiliser les environnements Angular

Dans un vrai projet, on évite d’écrire les URL directement dans les composants ou services.

On préfère stocker l’adresse de l’API dans un fichier d’environnement.

Exemple d’idée :

- un environnement développement avec une URL locale,
- un environnement production avec l’URL du serveur réel.

C’est plus propre, plus professionnel et plus facile à maintenir.

---

## 10. Vérifications après mise en ligne

Une fois l’application publiée, il faut contrôler :

- que la page s’ouvre correctement,
- que les styles sont bien chargés,
- que les routes Angular fonctionnent,
- que les appels API répondent,
- qu’aucune erreur importante n’apparaît dans la console du navigateur.

---

## 11. Résumé très simple

Pour mettre tpAMU en production, on retient surtout ceci :

1. je teste mon application en local,
2. je lance le build de production,
3. je récupère le contenu de dist/tpAMU/browser,
4. je le publie sur un serveur web,
5. je fais attention à l’adresse réelle du backend.

---

## 12. Mini check-list de fin

Avant de dire que l’application est en production, je vérifie :

- [ ] le projet compile,
- [ ] le dossier dist est bien généré,
- [ ] le frontend est publié sur un serveur,
- [ ] le backend est accessible,
- [ ] les appels HTTP ne pointent plus vers localhost,
- [ ] le site fonctionne dans le navigateur.

---

## Conclusion pédagogique

La mise en production n’est pas une magie supplémentaire : c’est surtout une méthode.

On prépare, on construit, on publie, puis on vérifie.

Si vous retenez une seule idée, c’est celle-ci :

> en Angular, on développe dans src, mais on met en ligne ce qui est généré dans dist.
