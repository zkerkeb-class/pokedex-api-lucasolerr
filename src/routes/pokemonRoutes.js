import express from 'express';
import Pokemon from '../models/Pokemon.js';
import protect from '../../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const { page, limit, type, name } = req.query;
    const filters = {};
    const currentPage = parseInt(page) || 1;
    const currentLimit = parseInt(limit) || 20;
    const skip = (currentPage - 1) * currentLimit;

    // Si un type est filtré
    if (type) {
      const selectedTypes = type.toLowerCase().split(',');
      filters.types = { $all: selectedTypes }; // Vérifie que tous les types sont présents
    }

    // Si un nom est filtré
    if (name) {
      filters['name.french'] = { $regex: name, $options: 'i' }; // Recherche insensible à la casse
    }

    // Récupérer les pokémons filtrés
    const pokemons = await Pokemon.find(filters).skip(skip).limit(currentLimit);

    // Récupérer le nombre total de pokémons filtrés
    const total = await Pokemon.countDocuments(filters);

    // Récupérer tous les types uniques disponibles
    const allTypes = await Pokemon.distinct('types');

    res.status(200).json({
      page: currentPage,
      limit: currentLimit,
      total,
      totalPages: Math.ceil(total / currentLimit),
      filters: req.query,
      types: allTypes,
      pokemons: pokemons
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des pokémons",
      error: error.message
    });
  }
});

// GET - Récupérer un pokémon par son ID
router.get('/:id', protect, async (req, res) => {
  try {
    const pokemon = await Pokemon.findById(req.params.id);
    if (!pokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }
    res.status(200).json(pokemon);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du pokémon",
      error: error.message
    });
  }
});

// POST - Créer un nouveau pokémon
router.post('/', protect, async (req, res) => {
  try {
    const newPokemon = new Pokemon(req.body);
    await newPokemon.save();
    res.status(201).json(newPokemon);
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la création du pokémon",
      error: error.message
    });
  }
});

// PUT - Mettre à jour un pokémon
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedPokemon = await Pokemon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }
    res.status(200).json(updatedPokemon);
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la mise à jour du pokémon",
      error: error.message
    });
  }
});

// DELETE
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedPokemon = await Pokemon.findByIdAndDelete(req.params.id);
    if (!deletedPokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }
    res.status(200).json({
      message: "Pokémon supprimé avec succès",
      pokemon: deletedPokemon
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du pokémon",
      error: error.message
    });
  }
});

export default router;
