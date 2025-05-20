// back/src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
const userRoutes = require('./collections/users');
app.use('/api', userRoutes);
require('./services/api.js').then((apiRoutes) => {
  app.use('/api/extra', apiRoutes); // ou tout autre préfixe non conflictuel

  app.listen(port, () => {
    console.log(`[SERVEUR] En écoute sur le port ${port}`);
  });
});