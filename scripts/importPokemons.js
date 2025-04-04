import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Pokemon from '../src/models/Pokemon.js'; // adapte le chemin si besoin

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB ✅');

    const dataPath = path.resolve('./src/data/pokemons.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const pokemons = JSON.parse(rawData);

    const transformedPokemons = pokemons.map((p) => ({
      id: p.id,
      name: p.name,
      types: p.type.map((t) => t.toLowerCase()),
      typeImages: p.typeImages || [],
      image: p.image,
      stats: {
        hp: p.base['HP'],
        attack: p.base['Attack'],
        defense: p.base['Defense'],
        specialAttack: p.base['Sp. Attack'],
        specialDefense: p.base['Sp. Defense'],
        speed: p.base['Speed'],
      },
      evolutions: [] // si tu as des évolutions à ajouter plus tard
    }));

    await Pokemon.deleteMany(); // Optionnel si tu veux repartir de zéro
    await Pokemon.insertMany(transformedPokemons);
    console.log('Migration terminée avec succès 🚀');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la migration :', error);
    process.exit(1);
  }
};

importData();
