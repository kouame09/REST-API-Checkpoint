const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const dbConnection = process.env.DB_CONNECTION;

mongoose.connect(dbConnection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connexion à la base de données établie'))
  .catch((err) => console.error('Erreur de connexion à la base de données :', err));

// Schéma utilisateur (dans models/User.js)

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  motDePasse: {
    type: String,
    required: true
  },
});

const User = mongoose.model('User', userSchema);

// Routes

app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/users', async (req, res) => {
  const user = new User({
    nom: req.body.nom,
    email: req.body.email,
    motDePasse: req.body.motDePasse
    // D'autres champs si nécessaire...
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Routes PUT, DELETE, etc.

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
