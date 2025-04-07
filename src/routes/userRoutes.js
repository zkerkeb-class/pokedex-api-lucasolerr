import express from 'express';
import protect from '../middleware/auth.js';
import {
  registerUser,
  loginUser,
  addFavorite,
  removeFavorite,
  getFavorites
} from '../controllers/userController.js';

const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Enregistrement d'un utilisateur
 * @access  Public
 */
router.post('/register', registerUser);

/**
 * @route   POST /api/users/login
 * @desc    Connexion utilisateur
 * @access  Public
 */
router.post('/login', loginUser);

/**
 * @route   POST /api/users/favorites/:pokemonId
 * @desc    Ajouter un pokémon aux favoris
 * @access  Privé
 */
router.post('/favorites/:pokemonId', protect, addFavorite);

/**
 * @route   DELETE /api/users/favorites/:pokemonId
 * @desc    Supprimer un pokémon des favoris
 * @access  Privé
 */
router.delete('/favorites/:pokemonId', protect, removeFavorite);

/**
 * @route   GET /api/users/favorites
 * @desc    Obtenir la liste des favoris
 * @access  Privé
 */
router.get('/favorites', protect, getFavorites);

export default router;
