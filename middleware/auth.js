import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
  const token = req.headers['authorization'];

  if (token && token.startsWith('Bearer ')) {
    const jwtToken = token.split(' ')[1];

    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token invalide" });
      }
      
      req.user = decoded;
      next();
    });
  } else {
    return res.status(401).json({ message: "Token manquant ou mal formé" });
  }
};

export default protect;
