const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Charge le fichier .env (si présent)

const api = require('./api.js');

const app = express();
const port = 8000;

// Autorise toutes les origines (CORS)
app.use(cors({ origin: '*' }));
// Permet de parser du JSON dans les requêtes
app.use(express.json());

// Routes pour "messages"
app.use('/api', api);

// Lancement du serveur
app.listen(port, () => {
  console.log('[SERVEUR] En écoute sur le port ' + port);
});