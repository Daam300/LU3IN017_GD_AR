// back/src/services/api.js
const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/rdrrp_db';
const client = new MongoClient(uri);

module.exports = client.connect().then(() => {
  console.log('Connecté à MongoDB');
  const db = client.db();
  const users = db.collection('users');
  const router = express.Router();

  router.post('/register', async (req, res) => {
    console.log('[API] POST /register reçu'); // 👈 Ajout
  
    const { prenom, nom, pseudo, mail, mdp } = req.body;
    console.log('[API] Données reçues :', { prenom, nom, pseudo, mail }); // 👈 Ajout
  
    if (![prenom, nom, pseudo, mail, mdp].every(f => typeof f === 'string' && f.trim() !== '')) {
      console.log('[API] Champs manquants'); // 👈 Ajout
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
  
    try {
      const existing = await users.findOne({ pseudo: pseudo.trim() });
      console.log('[API] Utilisateur existant ?', existing); // 👈 Ajout
  
      if (existing) {
        return res.status(409).json({ message: 'Pseudo déjà utilisé' });
      }
  
      const hashed = await bcrypt.hash(mdp, 10);
      const result = await users.insertOne({
        prenom: prenom.trim(),
        nom: nom.trim(),
        login: pseudo.trim(),
        mail: mail.trim(),
        mdp: hashed,
        status: 'pending'
      });
  
      console.log('[API] Utilisateur inséré !', result.insertedId); // 👈 Ajout
  
      res.status(201).json({ message: 'Inscription enregistrée' });
    } catch (err) {
      console.error('[API] Erreur insertion :', err); // 👈 Ajout
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  router.post('/login', async (req, res) => {
    const { login, mdp } = req.body;
    if (typeof login !== 'string' || typeof mdp !== 'string') {
      return res.status(400).json({ message: 'Login et mot de passe requis' });
    }

    try {
      const user = await users.findOne({ login: login.trim(), status: 'approved' });
      const pendingUser = await users.findOne({ login: login.trim(), status: 'pending' });
      if (pendingUser) return res.status(403).json({ message: 'Compte en attente de validation' });
      if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });

      const passwordMatches = await bcrypt.compare(mdp, user.mdp);
      if (!passwordMatches) return res.status(401).json({ message: 'Mot de passe incorrect' });

      res.status(200).json({ message: 'Connexion réussie' });
    } catch (err) {
      console.error('Erreur login :', err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  return router;
});

