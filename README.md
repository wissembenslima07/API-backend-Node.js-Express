# Recouvra+ API

API backend Node.js/Express pour la gestion du recouvrement: clients, factures impayees, paiements manuels, actions de recouvrement et statistiques.

## Auteur

Ce projet a ete realise  par:

- Wissem Ben Slima

## Objectif du projet

Fournir une API REST claire et securisee pour:

- gerer les clients
- suivre les factures impayees
- enregistrer les paiements
- tracer les actions de recouvrement
- consulter des statistiques globales

## Stack technique

- Node.js 22
- Express.js
- MongoDB + Mongoose
- JWT + bcrypt
- Joi (validation)
- Jest + Supertest
- Swagger (documentation API)

## Structure du projet

```text
src/
  config/        # Configuration (env, DB, Swagger)
  controllers/   # Gestion des requetes HTTP
  middlewares/   # Auth, gestion des erreurs
  models/        # Modeles Mongoose
  routes/        # Definition des routes API
  services/      # Logique metier
  validators/    # Validation Joi
tests/           # Tests unitaires / integration
```

## Fonctionnalites implementees

### 1. Authentification et autorisation

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- Roles utilisateurs: `agent`, `manager`, `admin`
- Protection JWT + middleware d'autorisation par role

### 2. Gestion des clients

- `POST /api/clients`
- `GET /api/clients`
- `GET /api/clients/:id`
- `PUT /api/clients/:id`
- `DELETE /api/clients/:id`

### 3. Gestion des factures

- CRUD des factures
- Filtres disponibles (statut, date, client)
- Statuts supportes: `unpaid`, `partial`, `paid`, `in_collection`

### 4. Paiements manuels

- `POST /api/payments`
- Mise a jour automatique du montant paye de la facture
- Mise a jour automatique du statut (`partial` ou `paid`)

### 5. Actions de recouvrement

- `POST /api/collection-actions`
- `GET /api/collection-actions/client/:clientId`
- `GET /api/collection-actions/invoice/:invoiceId`
- Types d'action: `call`, `email`, `visit`, `notice`

### 6. Statistiques

- `GET /api/stats/overview`
- `GET /api/stats/invoices`
- `GET /api/stats/agents`

### 7. Documentation API

- Interface Swagger: `GET /docs`
- Specification JSON: `GET /docs-json`

## Installation et execution

### 1. Installer les dependances

```bash
npm install
```

### 2. Configurer l'environnement

Creer un fichier `.env` a partir de `.env.example`, puis definir au minimum:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/recouvra_plus
JWT_SECRET=change_this_secret
```

### 3. Demarrer MongoDB

S'assurer que MongoDB est lance localement.

### 4. Lancer le serveur

```bash
npm run dev
```

### 5. Verifier l'etat de l'API

Endpoint de sante:

```http
GET http://localhost:3000/api/health
```

## Scripts npm utiles

- `npm run dev` : demarrage en mode developpement
- `npm start` : demarrage en mode production
- `npm test` : execution des tests

## Tests

Lancer tous les tests:

```bash
npm test
```

## Qualite et bonnes pratiques

- Architecture par couches (routes -> controllers -> services -> models)
- Validation des entrees avec Joi
- Gestion centralisee des erreurs
- Authentification JWT et controle des roles
- Documentation Swagger pour faciliter l'integration
