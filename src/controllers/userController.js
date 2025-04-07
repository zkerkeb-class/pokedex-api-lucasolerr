import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Enregistrement d'un nouvel utilisateur
 */
export const registerUser = async (req, res) => {
  const { email, nom, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const newUser = new User({ email, nom, password });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      token
    });

  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur",
      error: error.message
    });
  }
};

/**
 * Connexion d'un utilisateur
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Connexion réussie",
      user: {
        nom: user.nom,
        email: user.email
      },
      token
    });

  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la connexion",
      error: error.message
    });
  }
};

/**
 * Ajoute un pokémon aux favoris de l'utilisateur
 */
export const addFavorite = async (req, res) => {
  try {
    const user = req.user;
    const { pokemonId } = req.params;

    if (!user.favorites.includes(pokemonId)) {
      user.favorites.push(pokemonId);
      await user.save();
    }

    res.status(200).json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Erreur ajout favori', error: err.message });
  }
};

/**
 * Supprime un pokémon des favoris
 */
export const removeFavorite = async (req, res) => {
  try {
    const user = req.user;
    const { pokemonId } = req.params;

    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== pokemonId
    );

    await user.save();
    res.status(200).json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression favori', error: err.message });
  }
};

/**
 * Récupère tous les favoris de l'utilisateur
 */
export const getFavorites = async (req, res) => {
  try {
    const userWithFavs = await User.findById(req.user._id).populate('favorites');
    res.status(200).json({ favorites: userWithFavs.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération favoris', error: err.message });
  }
};
