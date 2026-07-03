# Mise en place et sécurisation d'une API Express minimale

> **Prérequis** : Node.js 20+, TypeScript, notions de base HTTP (verbes, headers, status codes).  
> **Objectif** : Construire de zéro une API Express structurée, sécurisée et prête à être consommée par Angular.

---

## Pourquoi une API Express dans un projet Angular ?

Angular est un **frontend** : il tourne dans le navigateur de l'utilisateur. Il ne peut pas :
- stocker des secrets (clés API, mots de passe)
- accéder directement à une base de données
- faire confiance aux données de l'utilisateur

L'API Express joue le rôle de **BFF** (Backend For Frontend) : elle centralise la logique métier, protège les ressources et expose uniquement ce dont Angular a besoin.

```
Navigateur           API Express (Node.js)        Services tiers
┌─────────┐          ┌──────────────────┐          ┌────────────┐
│ Angular │  HTTP/S  │  Authentifie     │          │  Base de   │
│  SPA    │ ───────► │  Autorise        │ ───────► │  données   │
│         │ ◄─────── │  Valide          │          │  Cache     │
└─────────┘   JSON   │  Répond en JSON  │          │  etc.      │
                     └──────────────────┘          └────────────┘
```

---

## Partie 1 — Initialisation du projet

### 1.1 Structure cible du projet

```
mon-api/
├── .env                    ← variables d'environnement (jamais dans Git)
├── .env.example            ← modèle sans secrets (dans Git)
├── .gitignore
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts            ← point d'entrée (démarrage serveur)
    ├── server.ts           ← configuration Express (app)
    ├── config/
    │   └── env.ts          ← lecture et validation des variables d'environnement
    ├── routes/
    │   ├── authRouter.ts
    │   └── usersRouter.ts
    ├── controllers/
    │   └── authController.ts
    ├── services/
    │   └── authService.ts
    ├── middleware/
    │   ├── authenticate.ts
    │   └── errorHandler.ts
    └── validators/
        └── authValidator.ts
```

> **Pourquoi séparer `index.ts` et `server.ts` ?**  
> `server.ts` configure Express (routes, middlewares). `index.ts` lance le serveur (`app.listen`).  
> Cela permet de tester `server.ts` sans démarrer réellement un port réseau.

---

### 1.2 Installation des dépendances

```bash
# Initialisation
npm init -y
npm install express dotenv helmet cors express-rate-limit zod jsonwebtoken bcrypt
npm install -D typescript @types/express @types/node @types/jsonwebtoken @types/bcrypt ts-node-dev
```

| Package | Rôle |
|---|---|
| `express` | Serveur HTTP |
| `dotenv` | Lecture du fichier `.env` |
| `helmet` | Headers de sécurité HTTP automatiques |
| `cors` | Contrôle des origines autorisées |
| `express-rate-limit` | Limitation du nombre de requêtes |
| `zod` | Validation et typage des données d'entrée |
| `jsonwebtoken` | Génération et vérification des JWT |
| `bcrypt` | Hachage sécurisé des mots de passe |

---

### 1.3 Configuration TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

Scripts dans `package.json` :

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

---

### 1.4 Variables d'environnement avec `dotenv`

**Fichier `.env`** (jamais commité dans Git) :
```
PORT=3001
JWT_SECRET=un-secret-long-et-aleatoire-a-changer
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=un-autre-secret-different-du-premier
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
```

**Fichier `.env.example`** (commité dans Git, sans valeurs sensibles) :
```
PORT=3001
JWT_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
```

**Lecture et validation dans `config/env.ts`** :

```typescript
// src/config/env.ts
import 'dotenv/config';

// On lit les variables et on échoue tôt si elles sont manquantes en production.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === 'production') {
    throw new Error(`Variable d'environnement manquante : ${name}`);
  }
  return value ?? '';
}

export const config = {
  port: parseInt(process.env.PORT ?? '3001', 10),
  jwtSecret: requireEnv('JWT_SECRET') || 'dev-secret-insecure',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
  jwtRefreshSecret: requireEnv('JWT_REFRESH_SECRET') || 'dev-refresh-secret-insecure',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  isProduction: process.env.NODE_ENV === 'production',
};
```

> **Principe** : "fail fast" — si une variable critique est absente en production, le serveur refuse de démarrer plutôt que de tourner avec une configuration dangereuse.

---

### 1.5 `server.ts` — Configuration Express

```typescript
// src/server.ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './routes/authRouter';
import { usersRouter } from './routes/usersRouter';

const app = express();

// --- Sécurité ---
app.use(helmet());                            // Headers de sécurité
app.use(cors({ origin: 'http://localhost:4200' })); // CORS restreint
app.use(rateLimiter);                         // Rate limiting global

// --- Parsing ---
app.use(express.json({ limit: '10kb' }));     // Corps JSON, taille limitée

// --- Routes ---
app.use('/auth', authRouter);
app.use('/users', usersRouter);

// --- Gestion des erreurs (doit être en dernier) ---
app.use(errorHandler);

export default app;
```

---

### 1.6 `index.ts` — Démarrage du serveur

```typescript
// src/index.ts
import app from './server';
import { config } from './config/env';

app.listen(config.port, () => {
  console.log(`Serveur démarré sur http://localhost:${config.port}`);
  if (!config.isProduction) {
    console.warn('⚠️  Mode développement — Ne pas utiliser en production.');
  }
});
```

---

## Partie 2 — Structure routes / controllers / services

### Pourquoi séparer ces trois couches ?

| Couche | Rôle | Ce qu'elle fait |
|---|---|---|
| **Route** | Déclaration | Associe une URL + verbe HTTP à un controller |
| **Controller** | Orchestration | Lit la requête, appelle le service, retourne la réponse |
| **Service** | Logique métier | La vraie logique (accès BDD, hachage, tokens…) |

Cette séparation rend le code **testable** (on peut tester le service sans HTTP) et **lisible** (chaque fichier a une seule responsabilité).

---

### 2.1 La route — `routes/authRouter.ts`

```typescript
// src/routes/authRouter.ts
import { Router } from 'express';
import { login, refresh, me, logout } from '../controllers/authController';
import { authenticate } from '../middleware/authenticate';
import { loginLimiter } from '../middleware/rateLimiter';
import { validateLogin } from '../validators/authValidator';

export const authRouter = Router();

// Routes publiques
authRouter.post('/login', loginLimiter, validateLogin, login);
authRouter.post('/refresh', refresh);

// Routes protégées (JWT requis)
authRouter.get('/me', authenticate, me);
authRouter.post('/logout', authenticate, logout);
```

La route est **déclarative** : elle ne contient aucune logique, seulement des associations.

---

### 2.2 Le controller — `controllers/authController.ts`

```typescript
// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

// login : POST /auth/login
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    // req.body est déjà validé par le middleware validateLogin
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.json(result);
  } catch (err) {
    next(err); // délègue au gestionnaire d'erreurs centralisé
  }
}

// me : GET /auth/me
export function me(req: Request, res: Response) {
  // req.user est injecté par le middleware authenticate
  res.json(req.user);
}
```

> Le controller ne contient **aucune logique métier** : il fait le pont entre HTTP et le service.  
> La gestion des erreurs est déléguée via `next(err)` — pas de `try/catch` en doublon partout.

---

### 2.3 Le service — `services/authService.ts`

```typescript
// src/services/authService.ts
import bcrypt from 'bcrypt';
import { tokenService } from './tokenService';
import { userRepository } from '../repositories/userRepository';

export const authService = {

  async login(username: string, password: string) {
    // 1. Trouver l'utilisateur
    const user = await userRepository.findByUsername(username);

    // 2. Message volontairement générique pour ne pas révéler quels comptes existent
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedError('Identifiants invalides');
    }

    // 3. Générer les tokens
    const accessToken = tokenService.signAccess({ sub: user.id, role: user.role });
    const refreshToken = await tokenService.signRefresh(user.id);

    return { accessToken, refreshToken, user: toPublicUser(user) };
  },

};
```

Le service peut être testé unitairement **sans démarrer Express**.

---

## Partie 3 — Validation d'entrée avec Zod

### Pourquoi valider ?

Sans validation, un attaquant peut envoyer :
- Un corps de requête vide → crash de l'application
- Des données malformées → comportement imprévisible
- Des chaînes trop longues → attaque par saturation

**Zod** permet de décrire le schéma attendu et de valider + typer les données en une seule étape.

### 3.1 Définir un schéma

```typescript
// src/validators/authValidator.ts
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Schéma de validation du corps de /auth/login
const loginSchema = z.object({
  username: z
    .string({ required_error: 'Le nom d\'utilisateur est obligatoire' })
    .min(3, 'Minimum 3 caractères')
    .max(50, 'Maximum 50 caractères')
    .regex(/^[a-zA-Z0-9_]+$/, 'Caractères alphanumériques et _ uniquement'),

  password: z
    .string({ required_error: 'Le mot de passe est obligatoire' })
    .min(6, 'Minimum 6 caractères')
    .max(100, 'Maximum 100 caractères'),
});

// Type TypeScript inféré automatiquement depuis le schéma Zod
export type LoginDto = z.infer<typeof loginSchema>;
```

> **L'avantage clé** : le type TypeScript est **inféré automatiquement** depuis le schéma de validation. On ne risque pas d'avoir un type qui diverge de la validation réelle.

### 3.2 Middleware de validation

```typescript
// Middleware Express réutilisable pour valider req.body avec n'importe quel schéma Zod
export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Zod retourne des erreurs structurées par champ
      return res.status(400).json({
        message: 'Données invalides',
        errors: result.error.flatten().fieldErrors,
      });
    }

    // On remplace req.body par les données validées et typées
    req.body = result.data;
    next();
  };
}

// Utilisation
export const validateLogin = validateBody(loginSchema);
```

**Exemple de réponse en cas d'erreur :**
```json
{
  "message": "Données invalides",
  "errors": {
    "username": ["Minimum 3 caractères"],
    "password": ["Le mot de passe est obligatoire"]
  }
}
```

---

## Partie 4 — Sécurisation de base

### 4.1 Helmet — Headers de sécurité HTTP

Un simple appel `app.use(helmet())` ajoute automatiquement ~15 headers de sécurité :

| Header ajouté | Rôle |
|---|---|
| `X-Content-Type-Options: nosniff` | Empêche le navigateur de deviner le type MIME |
| `X-Frame-Options: DENY` | Protège contre le clickjacking (iframes malveillantes) |
| `Strict-Transport-Security` | Force HTTPS en production |
| `X-XSS-Protection: 0` | Désactive le filtre XSS ancien (remplacé par CSP) |
| `Content-Security-Policy` | Contrôle les sources autorisées (scripts, styles, images) |

```typescript
import helmet from 'helmet';

// ✅ Configuration minimale (recommandée pour démarrer)
app.use(helmet());

// ✅ Configuration avancée : personnaliser la CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));
```

> Vérifier les headers avec les DevTools du navigateur (onglet Network → réponse → Headers).

---

### 4.2 CORS — Contrôler les origines autorisées

**CORS** (Cross-Origin Resource Sharing) est un mécanisme du navigateur qui bloque les requêtes vers une API d'un domaine différent, **sauf si l'API l'autorise explicitement**.

```typescript
import cors from 'cors';

// ❌ Tout autoriser (dangereux en production)
app.use(cors());

// ✅ Restreindre à l'origine Angular uniquement
app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // si on utilise des cookies
}));

// ✅ Plusieurs origines (dev + prod)
const allowedOrigins = [
  'http://localhost:4200',
  'https://monapp.example.com',
];

app.use(cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origine (ex: curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origine non autorisée : ${origin}`));
    }
  },
}));
```

> **Important** : CORS est un contrôle **côté navigateur**. Il ne protège pas contre les appels depuis un serveur ou un outil comme `curl`. La vraie protection reste l'authentification JWT.

---

### 4.3 Rate Limiting — Limiter le nombre de requêtes

```typescript
// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

// Limite générale : 100 requêtes / 15 min par IP
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,  // ajoute les headers RateLimit-* standard
  legacyHeaders: false,
  message: { message: 'Trop de requêtes. Réessayez dans 15 minutes.' },
});

// Limite renforcée sur /auth/login : 10 tentatives / 15 min
// Empêche le brute force de mots de passe
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
  skipSuccessfulRequests: true, // ne compte que les échecs
});
```

**Headers renvoyés au client :**
```
RateLimit-Limit: 10
RateLimit-Remaining: 7
RateLimit-Reset: 1750003600
```

Ces headers permettent à Angular d'afficher un message adapté avant même d'atteindre la limite.

---

### 4.4 Gestion centralisée des erreurs

Sans gestionnaire d'erreurs centralisé, chaque route doit gérer ses propres erreurs, ce qui entraîne des réponses incohérentes et du code dupliqué.

#### Classes d'erreur personnalisées

```typescript
// src/errors/HttpError.ts
export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Requête invalide') { super(400, message); }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Non authentifié') { super(401, message); }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Accès interdit') { super(403, message); }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Ressource non trouvée') { super(404, message); }
}
```

#### Middleware d'erreur Express

```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/HttpError';
import { ZodError } from 'zod';
import { config } from '../config/env';

// ⚠️ Le middleware d'erreur Express a OBLIGATOIREMENT 4 paramètres (err, req, res, next)
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // 1. Erreur HTTP personnalisée
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // 2. Erreur de validation Zod (si elle remonte jusqu'ici)
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Données invalides',
      errors: err.flatten().fieldErrors,
    });
  }

  // 3. Toute autre erreur : on logue en interne, on répond de façon générique
  console.error('[Erreur interne]', err);

  // ❌ Ne jamais exposer la stack trace en production
  res.status(500).json({
    message: 'Erreur interne du serveur',
    // En développement uniquement, on peut ajouter des détails pour déboguer
    ...(config.isProduction ? {} : { detail: String(err) }),
  });
}
```

**Utilisation dans les controllers :**

```typescript
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body.username, req.body.password);
    res.json(result);
  } catch (err) {
    next(err); // ← une seule ligne, le reste est géré centralement
  }
}
```

**Format de réponse uniforme pour Angular :**
```json
{ "message": "Identifiants invalides" }
{ "message": "Données invalides", "errors": { "password": ["Minimum 6 caractères"] } }
{ "message": "Erreur interne du serveur" }
```

Angular peut ainsi écrire un intercepteur générique qui lit toujours `error.error.message`.

---

## Récapitulatif — Checklist de mise en place

```
✅ package.json avec les bonnes dépendances
✅ tsconfig.json en mode strict
✅ .env créé et .env.example commité (sans secrets)
✅ .env ajouté au .gitignore
✅ config/env.ts valide les variables d'environnement au démarrage
✅ Séparation routes / controllers / services
✅ Validation Zod sur tous les endpoints qui reçoivent un corps
✅ Helmet activé (headers de sécurité)
✅ CORS restreint au domaine Angular
✅ Rate limiting global + renforcé sur /auth/login
✅ Gestionnaire d'erreurs centralisé (dernier middleware)
✅ Taille des payloads JSON limitée (10kb)
```

---

---

# Plan de présentation — Slides

> **Format** : 14 slides, ~50 min + atelier 30 min.  
> **Fil conducteur** : construire une API de A à Z en live-coding progressif, en justifiant chaque choix.

---

## Slide 1 — Accroche : "Une API naïve, c'est quoi ?"

**Type** : démonstration choc  
**Contenu** :
- Afficher une API Express en 15 lignes (sans aucune sécurité)
- Montrer en live ce qu'on peut faire : accéder aux données de n'importe quel utilisateur, planter le serveur avec un payload malformé, brute forcer le login
- **Question** : *"Qui a déjà déployé une API qui ressemble à ça ?"*

---

## Slide 2 — Rôle du BFF dans une architecture Angular

**Type** : schéma architectural  
**Contenu** :
- Schéma : navigateur → Angular → API Express → base de données
- Ce qu'Angular **ne peut pas** faire (stocker des secrets, accéder directement à la BDD)
- Ce que l'API **doit** faire (authentifier, autoriser, valider, filtrer)
- **Message clé** : *"L'API est la seule frontière de confiance"*

---

## Slide 3 — Structure du projet : pourquoi découper ?

**Type** : arborescence commentée  
**Contenu** :
- Afficher l'arborescence `routes / controllers / services / middleware / validators / config`
- Expliquer la responsabilité de chaque dossier en une phrase
- Analogie : *"Route = réceptionniste, Controller = chef de projet, Service = expert métier"*
- **Message clé** : *"Une couche = une responsabilité = un fichier testable indépendamment"*

---

## Slide 4 — Variables d'environnement : `.env` et `dotenv`

**Type** : live-coding + démonstration  
**Contenu** :
- Montrer ce qui arrive si on met un secret JWT dans le code (`git log` = fuite permanente)
- Créer `.env` + `.env.example` + ajouter `.env` au `.gitignore`
- Montrer `config/env.ts` avec `requireEnv` (fail fast en production)
- **Message clé** : *"Un secret dans le code, c'est un secret public"*

---

## Slide 5 — `server.ts` vs `index.ts` : séparer config et démarrage

**Type** : architecture + code  
**Contenu** :
- Montrer les deux fichiers côte à côte
- Expliquer pourquoi : testabilité (on peut importer `app` sans démarrer un port)
- Montrer l'ordre des middlewares dans `server.ts` (sécurité → parsing → routes → erreurs)
- **Message clé** : *"L'ordre des middlewares Express est critique"*

---

## Slide 6 — Validation avec Zod : typer ET valider en même temps

**Type** : live-coding  
**Contenu** :
- Montrer une route sans validation : `req.body.username` peut être `undefined`, un objet, etc.
- Écrire le schéma Zod `loginSchema` avec `.string().min(3).max(50)`
- Montrer `z.infer<typeof loginSchema>` : le type TypeScript est gratuit
- Montrer la réponse d'erreur structurée par champ
- **Message clé** : *"Valider à l'entrée = protéger tout le reste de l'application"*

---

## Slide 7 — Middleware de validation réutilisable

**Type** : pattern code  
**Contenu** :
- Montrer la fonction `validateBody(schema)` qui retourne un middleware Express
- Montrer son utilisation sur plusieurs routes (`validateLogin`, `validateRegister`…)
- Principe DRY (Don't Repeat Yourself) : un seul endroit pour la logique de validation
- **Message clé** : *"Un middleware = une préoccupation transverse réutilisable"*

---

## Slide 8 — Helmet : 15 headers de sécurité en 1 ligne

**Type** : démonstration DevTools  
**Contenu** :
- Ouvrir DevTools → Network → réponse sans Helmet : headers minimaux
- Ajouter `app.use(helmet())` → relancer → montrer les nouveaux headers
- Expliquer 3 headers clés : `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`
- **Message clé** : *"La sécurité par défaut est une décision d'équipe, pas de l'individu"*

---

## Slide 9 — CORS : une protection du navigateur, pas de l'API

**Type** : clarification conceptuelle  
**Contenu** :
- Schéma : CORS bloque le navigateur, pas `curl` ni un autre serveur
- Montrer `cors()` trop permissif vs `cors({ origin: '...' })`
- Expliquer `credentials: true` pour les cookies
- **Message clé** : *"CORS protège les utilisateurs, l'auth protège les données"*

---

## Slide 10 — Rate Limiting : dire non aux robots

**Type** : démo + chiffres  
**Contenu** :
- Chiffre : sans rate limiting, un attaquant peut tester ~1000 mots de passe/seconde
- Montrer `express-rate-limit` global (100 req/15min) vs renforcé sur `/login` (10 req/15min)
- Montrer les headers `RateLimit-*` renvoyés au client
- **Message clé** : *"Le rate limiting ralentit l'attaquant sans bloquer l'utilisateur légitime"*

---

## Slide 11 — Gestion centralisée des erreurs : un format unique

**Type** : comparaison avant/après  
**Contenu** :
- Montrer le chaos sans gestionnaire centralisé : chaque route invente son format d'erreur
- Créer les classes `HttpError`, `UnauthorizedError`, `NotFoundError`
- Montrer le middleware `errorHandler` à 4 paramètres
- Montrer côté Angular l'intercepteur qui lit `error.error.message` de façon homogène
- **Message clé** : *"Un format d'erreur prévisible = un frontend plus simple"*

---

## Slide 12 — Les routes essentielles et leur sécurité associée

**Type** : tableau récapitulatif  
**Contenu** :

| Route | Middleware(s) | Risque mitigé |
|---|---|---|
| `POST /auth/login` | `loginLimiter` + `validateLogin` | Brute force, données invalides |
| `POST /auth/refresh` | `validateRefresh` | Token forgé |
| `GET /auth/me` | `authenticate` | Accès non authentifié |
| `GET /admin` | `authenticate` + `authorize('admin')` | Escalade de privilèges |

---

## Slide 13 — Checklist et revue de code

**Type** : checklist interactive  
**Contenu** :
- Afficher la checklist de la section "Récapitulatif" du document
- Demander à l'audience de lever la main pour chaque item déjà appliqué dans leur projet
- Identifier les points les plus souvent manqués

---

## Slide 14 — Atelier : sécuriser une API volontairement vulnérable

**Type** : mise en pratique (30 min)  
**Contenu** :
- Distribuer une API Express "naïve" (5 routes, sans aucune sécurité)
- Tâches à réaliser :
  1. Identifier les problèmes (5 min)
  2. Ajouter Helmet + CORS + rate limiting (10 min)
  3. Ajouter la validation Zod sur `/auth/login` (10 min)
  4. Implémenter le gestionnaire d'erreurs centralisé (5 min)
- Revue collective avec explication des choix faits

---

> **Conseil de facilitation** : lors du live-coding, commencer volontairement par la version "naïve" et la casser en direct (montrer le crash avec un payload vide, l'erreur non gérée). Puis construire la version sécurisée étape par étape. L'effet "avant/après" ancre les bonnes pratiques bien mieux qu'un cours magistral.
