import express from 'express';
import cors from 'cors';
import multer from "multer";
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pokemonsList from './data/pokemons.json' assert { type: 'json' };

dotenv.config();

// Obtenir le chemin absolu du fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POKEMON_FILE = path.join(__dirname, "./data/pokemons.json");

const app = express();
const PORT = 3000;

// Middleware pour CORS et JSON
app.use(cors());
app.use(express.json());

// Fonction pour sauvegarder les Pokémon
const savePokemons = (pokemons) => {
    fs.writeFileSync(POKEMON_FILE, JSON.stringify(pokemons, null, 2));
};

// Configuration Multer pour stocker les images
const storage = multer.diskStorage({
    destination: path.join(__dirname, "../assets/pokemons"),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    }
});

const upload = multer({ storage });

// Middleware pour servir les images statiques
app.use('/assets', express.static(path.join(__dirname, '../assets')));

app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API Pokémon");
});

app.get("/api/pokemons", (req, res) => {
    res.status(200).send({
        types: [
            "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground",
            "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
        ],
        pokemons: pokemonsList,
    });
});

app.get('/api/pokemon/:id', (req, res) => {
    const pokemon = pokemonsList.find(p => p.id === parseInt(req.params.id, 10));

    if (!pokemon) {
        return res.status(404).json({ type: 'error', message: `Pokémon avec l'ID ${id} introuvable` });
    }
    res.status(200).json(pokemon);
});

// Route POST pour ajouter un Pokémon avec deux images
app.post('/api/pokemon', upload.fields([
    { name: "image", maxCount: 1 },
    { name: "shinyImage", maxCount: 1 }
]), (req, res) => {
    try {
        // Récupérer les données JSON envoyées
        const pokemonData = JSON.parse(req.body.pokemon);  // On récupère le JSON depuis le champ 'pokemon'
        const { name, type, base } = pokemonData;
        
        // Validation des champs
        if (!name || !type || !base) {
            return res.status(400).json({ type: 'error', message: "Les champs name, type et base sont requis." });
        }
        
        if (!name.english || !name.japanese || !name.chinese || !name.french) {
            return res.status(400).json({ type: 'error', message: "Le champ 'name' doit contenir les traductions en anglais, japonais, chinois et français." });
        }

        if (!Array.isArray(type)) {
            return res.status(400).json({ type: 'error', message: "Le champ 'type' doit être un tableau." });
        }

        const requiredBaseStats = ["HP", "Attack", "Defense", "Sp. Attack", "Sp. Defense", "Speed"];
        const baseKeys = Object.keys(base);
        if (baseKeys.length !== requiredBaseStats.length || !requiredBaseStats.every(stat => baseKeys.includes(stat))) {
            return res.status(400).json({ type: 'error', message: "Le champ 'base' doit contenir les statistiques : HP, Attack, Defense, Sp. Attack, Sp. Defense et Speed." });
        }

        // Validation des fichiers
        if (!req.files || !req.files.image || !req.files.shinyImage) {
            return res.status(400).json({ type: 'error', message: "Les images 'image' et 'shinyImage' sont requises." });
        }

        const lastId = pokemonsList.length > 0 ? pokemonsList[pokemonsList.length - 1].id : 0;
        const newId = lastId + 1;

        const imagePath = `${process.env.API_URL}/assets/pokemons/${req.files.image[0].filename}`;
        const shinyImagePath = `${process.env.API_URL}/assets/pokemons/${req.files.shinyImage[0].filename}`;

        // Ajout des images de types
        const typeMapping = {
            Normal: 1,
            Fighting: 2,
            Flying: 3,
            Poison: 4,
            Ground: 5,
            Rock: 6,
            Bug: 7,
            Ghost: 8,
            Steel: 9,
            Fire: 10,
            Water: 11,
            Grass: 12,
            Electric: 13,
            Psychic: 14,
            Ice: 15,
            Dragon: 16,
            Dark: 17,
            Fairy: 18
        };

        // Générer les images pour chaque type
        const typeImages = type.map(t => `${process.env.API_URL}/assets/types/${typeMapping[t]}.png`);

        // Créer un nouveau Pokémon
        const newPokemon = {
            id: newId,
            name,
            type,
            base,
            image: imagePath,
            shinyImage: shinyImagePath,
            typeImages: typeImages  // Ajouter les images des types
        };

        // Ajouter le Pokémon à la liste
        pokemonsList.push(newPokemon);
        savePokemons(pokemonsList);

        // Répondre avec le Pokémon créé
        res.status(201).json(newPokemon);
    } catch (error) {
        console.error("Erreur lors de l'ajout du Pokémon :", error);
        res.status(500).json({ type:'error', message: "Erreur interne du serveur" });
    }
});

// PUT : Modifier un Pokémon existant
app.put('/api/pokemon/:id', upload.fields([
    { name: "image", maxCount: 1 },
    { name: "shinyImage", maxCount: 1 }
]), (req, res) => {
    try {
        const pokemonId = parseInt(req.params.id, 10);
        const existingPokemon = pokemonsList.find(p => p.id === pokemonId);

        if (!existingPokemon) {
            return res.status(404).json({ type: 'error', message: `Pokémon avec l'ID ${pokemonId} introuvable.` });
        }

        // Mise à jour des informations du Pokémon
        if (req.body.name) existingPokemon.name = JSON.parse(req.body.name);  // Assurez-vous que ces données sont envoyées en JSON
        if (req.body.type) existingPokemon.type = JSON.parse(req.body.type);
        if (req.body.base) existingPokemon.base = JSON.parse(req.body.base);
        console.log(req.body.name);
        // Validation des types
        const validTypes = [
            'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison',
            'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
        ];
        existingPokemon.type.forEach(type => {
            if (!validTypes.includes(type)) {
                return res.status(400).json({ type: 'error', message: `Le type "${type}" est invalide.` });
            }
        });

        // Mise à jour des images si de nouveaux fichiers sont fournis
        if (req.files.image) {
            existingPokemon.image = `${process.env.API_URL}/assets/pokemons/${req.files.image[0].filename}`;
        }
        if (req.files.shinyImage) {
            existingPokemon.shinyImage = `${process.env.API_URL}/assets/pokemons/${req.files.shinyImage[0].filename}`;
        }

        // Enregistrer les modifications dans la liste
        savePokemons(pokemonsList);

        // Répondre avec le Pokémon mis à jour
        res.status(200).json({
            type: 'success',
            message: "Pokémon mis à jour avec succès",
            pokemon: existingPokemon
        });

    } catch (error) {
        console.error("Erreur lors de la mise à jour du Pokémon :", error);
        res.status(500).json({ type: 'error', message: "Erreur interne du serveur" });
    }
});

// DELETE : Supprimer un Pokémon
app.delete('/api/pokemon/:id', (req, res) => {
    try {
        const pokemonId = parseInt(req.params.id, 10);
        const index = pokemonsList.findIndex(p => p.id === pokemonId);

        if (index === -1) {
            return res.status(404).json({ type: 'error', message: `Pokémon avec l'ID ${pokemonId} introuvable.` });
        }

        pokemonsList.splice(index, 1);

        savePokemons(pokemonsList);

        res.status(200).json({ type: 'success', message: `Pokémon avec l'ID ${pokemonId} supprimé avec succès.` });

    } catch (error) {
        console.error("Erreur lors de la suppression du Pokémon :", error);
        res.status(500).json({ type: 'error', message: "Erreur interne du serveur" });
    }
});


app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
