import Pokemon from '../models/Pokemon.js';

// GET - Tous les pokémons (avec filtres, pagination)
export const getAllPokemons = async (req, res) => {
  try {
    const { page, limit, type, name } = req.query;
    const filters = {};
    const currentPage = parseInt(page) || 1;
    const currentLimit = parseInt(limit) || 20;
    const skip = (currentPage - 1) * currentLimit;

    if (type) {
      const selectedTypes = type.toLowerCase().split(',');
      filters.types = { $all: selectedTypes };
    }

    if (name) {
      filters['name.french'] = { $regex: name, $options: 'i' };
    }

    const pokemons = await Pokemon.find(filters).skip(skip).limit(currentLimit);
    const total = await Pokemon.countDocuments(filters);
    const allTypes = await Pokemon.distinct('types');

    res.status(200).json({
      page: currentPage,
      limit: currentLimit,
      total,
      totalPages: Math.ceil(total / currentLimit),
      filters: req.query,
      types: allTypes,
      pokemons
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des pokémons",
      error: error.message
    });
  }
};

// GET - Un seul pokémon par ID
export const getPokemonById = async (req, res) => {
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
};

// POST - Créer un nouveau pokémon
export const createPokemon = async (req, res) => {
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
};

// PUT - Modifier un pokémon
export const updatePokemon = async (req, res) => {
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
};

// DELETE - Supprimer un pokémon
export const deletePokemon = async (req, res) => {
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
};
