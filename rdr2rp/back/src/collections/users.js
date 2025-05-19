// /back/src/api/users.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");

const router = express.Router();
const JWT_SECRET = "votre_secret_jwt"; // À stocker de manière sécurisée
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
let usersCollection;
console.log("[API] /api/users/register prêt !");
client.connect().then(() => {
  const db = client.db("rdr2rp");
  usersCollection = db.collection("users");
});

// Middleware auth JWT
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Token manquant");
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).send("Token invalide");
  }
}

// REGISTER
router.post('/register', async (req, res) => {
    const { mail, pseudo, mdp, prenom, nom } = req.body;
  
    const hash = await bcrypt.hash(mdp, 10);
  
    try {
      const existing = await usersCollection.findOne({ $or: [{ email: mail }, { username: pseudo }] });
      if (existing) return res.status(400).json({ message: "Email ou pseudo déjà utilisé" });
  
      const result = await usersCollection.insertOne({
        email: mail,
        username: pseudo,
        passwordHash: hash,
        prenom,
        nom,
        status: "pending",
        createdAt: new Date()
      });
  
      res.status(201).json({ userId: result.insertedId });
    } catch (e) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await usersCollection.findOne({ email });
  if (!user) return res.status(401).json({ error: "Email ou mot de passe incorrect" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: "Email ou mot de passe incorrect" });

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// LOGOUT — handled client-side or via token blacklist
router.post("/logout", (req, res) => {
  res.status(200).send("Déconnexion effectuée côté client");
});

// DELETE ACCOUNT
router.delete("/me", auth, async (req, res) => {
  const result = await usersCollection.deleteOne({ _id: new ObjectId(req.user.id) });
  if (result.deletedCount === 0) return res.status(404).send("Utilisateur introuvable");
  res.sendStatus(204);
});


module.exports = router;