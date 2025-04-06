import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, nom, password } = req.body;
  
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }
  
      const newUser = new User({
        email,
        nom,
        password
      });
  
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
  });


// POST - Connexion d'un utilisateur
router.post('/login', async (req, res) => {
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
});

export default router;
