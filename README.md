# 🔧 API Pokédex – Back-end

Vidéo du projet : `https://youtu.be/eRHQAzyFBn0`

## 📋 Description du projet

Cette API REST a été développée avec **Node.js** et **Express.js** pour fournir les données d’un Pokédex à un front-end React.  
Elle permet la gestion des Pokémon (CRUD), l’authentification des utilisateurs, et la gestion des favoris.

---

## 🚀 Installation

### Prérequis

- Node.js (v16+ recommandé)
- npm
- MongoDB local ou distant

### Étapes

1. Cloner le dépôt :

```bash
git clone https://github.com/zkerkeb-class/pokedex-api-lucasolerr.git
cd pokedex-api-lucasolerr
```

2. Installer les dépendances
```sh
npm install
```

3. Fichier `.env`

```txt
PORT=3000
MONGO_URI=mongodb://localhost:27017/pokedex
JWT_SECRET=supersecretkey
```

4. Démarrer le serveur

```sh
npm run dev
```

L'API sera disponible sur `http://localhost:3000`

## 🔐 Concepts Clés

### API REST

- GET, POST, PUT, DELETE

- Codes de statut HTTP

- Requêtes avec filtres et pagination

### Express.js

- Routing

- Middleware

- Contrôleurs

### Sécurité

- Authentification avec JWT

- Validation des entrées

- CORS

- Gestion des erreurs

## 📑 Documentation de l’API

### 📁 Pokémons – `/api/pokemons`

| Méthode | URL                      | Description                          | Accès  |
|--------:|--------------------------|--------------------------------------|--------|
| GET     | `/api/pokemons`          | Liste de tous les Pokémon avec filtres, pagination et types | Privé  |
| GET     | `/api/pokemons/:id`      | Détails d’un Pokémon spécifique      | Privé  |
| POST    | `/api/pokemons`          | Créer un nouveau Pokémon             | Privé  |
| PUT     | `/api/pokemons/:id`      | Mettre à jour un Pokémon             | Privé  |
| DELETE  | `/api/pokemons/:id`      | Supprimer un Pokémon                 | Privé  |

#### 🔍 Query Parameters (GET `/api/pokemons`)

- `name` → Filtrer par nom (`name.french`)
- `type` → Filtrer par types séparés par virgule (`fire,water`)
- `page` → Numéro de la page (pagination)
- `limit` → Nombre de Pokémon par page

---

### 👤 Utilisateurs – `/api/users`

| Méthode | URL                                      | Description                          | Accès  |
|--------:|------------------------------------------|--------------------------------------|--------|
| POST    | `/api/users/register`                    | Enregistrement d’un nouvel utilisateur | Public |
| POST    | `/api/users/login`                       | Connexion utilisateur                | Public |
| GET     | `/api/users/favorites`                   | Obtenir la liste des Pokémon favoris | Privé  |
| POST    | `/api/users/favorites/:pokemonId`        | Ajouter un Pokémon aux favoris       | Privé  |
| DELETE  | `/api/users/favorites/:pokemonId`        | Supprimer un Pokémon des favoris     | Privé  |
