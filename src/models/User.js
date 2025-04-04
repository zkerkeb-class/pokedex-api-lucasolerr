import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Schéma utilisateur
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,  // Assurer que l'email soit en minuscule
    match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Veuillez entrer un email valide'] // Validation email
  },
  nom: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Pré-hook pour hasher le mot de passe avant la sauvegarde
userSchema.pre('save', async function(next) {
  // Si le mot de passe n'est pas modifié, on passe à la suite
  if (!this.isModified('password')) return next();

  // Génération du sel et hachage du mot de passe
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Méthode pour vérifier si le mot de passe entré correspond à celui haché
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Création du modèle User
const User = mongoose.model('User', userSchema);

export default User;
