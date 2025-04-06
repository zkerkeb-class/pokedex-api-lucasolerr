import jwt from 'jsonwebtoken';
import User from '../src/models/User.js'; // Assure-toi que le chemin est bon

const protect = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (token && token.startsWith('Bearer ')) {
    const jwtToken = token.split(' ')[1];

    try {
      const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
      
      // 🔥 On récupère l'utilisateur complet depuis la DB
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
      }

      req.user = user; // On attache l'objet user complet
      next();
    } catch (err) {
      return res.status(401).json({ message: "Token invalide", error: err.message });
    }
  } else {
    return res.status(401).json({ message: "Token manquant ou mal formé" });
  }
};

export default protect;
