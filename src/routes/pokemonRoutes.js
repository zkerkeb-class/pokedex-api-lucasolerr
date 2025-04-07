import express from 'express';
import protect from '../middleware/auth.js';
import {
  getAllPokemons,
  getPokemonById,
  createPokemon,
  updatePokemon,
  deletePokemon
} from '../controllers/pokemonController.js';

const router = express.Router();

/**
 * @route   GET /api/pokemons
 * @desc    Récupérer tous les pokémons avec filtres, pagination et types disponibles
 * @access  Privé (authentification requise)
 * @query   {string} name - Filtrer par nom (champ `name.french`)
 * @query   {string} type - Filtrer par type (ex: "fire,water")
 * @query   {number} page - Numéro de la page (pagination)
 * @query   {number} limit - Nombre d'éléments par page
 */
router.get('/', protect, getAllPokemons);

/**
 * @route   GET /api/pokemons/:id
 * @desc    Récupérer un pokémon par son ID
 * @access  Privé (authentification requise)
 * @param   {string} id - ID du pokémon (MongoDB ObjectId)
 */
router.get('/:id', protect, getPokemonById);

/**
 * @route   POST /api/pokemons
 * @desc    Créer un nouveau pokémon
 * @access  Privé (authentification requise)
 * @body    {Object} - Données du pokémon (name, types, stats, etc.)
 */
router.post('/', protect, createPokemon);

/**
 * @route   PUT /api/pokemons/:id
 * @desc    Mettre à jour un pokémon existant
 * @access  Privé (authentification requise)
 * @param   {string} id - ID du pokémon à modifier
 * @body    {Object} - Nouvelles données du pokémon
 */
router.put('/:id', protect, updatePokemon);

/**
 * @route   DELETE /api/pokemons/:id
 * @desc    Supprimer un pokémon
 * @access  Privé (authentification requise)
 * @param   {string} id - ID du pokémon à supprimer
 */
router.delete('/:id', protect, deletePokemon);

export default router;
