// back/src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

require('./services/api.js').then((apiRoutes) => {
  app.use('/api', apiRoutes);

  app.listen(port, () => {
    console.log(`[SERVEUR] En écoute sur le port ${port}`);
  });
});