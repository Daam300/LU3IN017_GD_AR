const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const router = express.Router();

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "rdrrp_db";
let forumCollection;

const JWT_SECRET = "votre_secret_jwt"; // même clé que dans users.js

async function connectDB() {
  if (!forumCollection) {
    await client.connect();
    forumCollection = client.db(dbName).collection("forum");
  }
}
connectDB();

router.get("/thread/:id", async (req, res) => {
    const thread = await forumCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!thread) return res.status(404).json({ message: "Thread non trouvé" });
    res.json(thread);
  });

// Middleware auth
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
  
  // ✅ Supprimer un thread (admin uniquement)
  router.delete("/thread/:id", auth, async (req, res) => {
    const user = await client.db(dbName).collection("users").findOne({ _id: new ObjectId(req.user.id) });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé, admin requis" });
    }
  
    const result = await forumCollection.deleteOne({ _id: new ObjectId(req.params.id) });
  
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Thread non trouvé" });
    }
  
    res.status(200).json({ message: "Thread supprimé" });
  });
  
  module.exports = router;

// Créer un nouveau thread
router.post("/thread", async (req, res) => {
  const { titre, auteur, message } = req.body;

  const thread = {
    titre,
    auteur,
    createdAt: new Date(),
    messages: [
        {
          _id: new ObjectId(),
          auteur,
          contenu: message,
          timestamp: new Date()
        }
      ]
  };

  const result = await forumCollection.insertOne(thread);
  res.status(201).json({ threadId: result.insertedId });
});

// Récupérer tous les threads
router.get("/threads", async (req, res) => {
  const threads = await forumCollection.find().sort({ createdAt: -1 }).toArray();
  res.json(threads);
});

// Supprimer un message d'un thread (admin seulement)
router.delete("/thread/:threadId/message/:messageId", auth, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Accès refusé, admin requis" });
      }
  
    const { threadId, messageId } = req.params;
  
    if (!ObjectId.isValid(threadId) || !ObjectId.isValid(messageId)) {
      return res.status(400).json({ message: "ID invalide" });
    }
  
    const result = await forumCollection.updateOne(
      { _id: new ObjectId(threadId) },
      { $pull: { messages: { _id: new ObjectId(messageId) } } }
    );
  
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Message supprimé" });
    } else {
      res.status(404).json({ message: "Thread ou message non trouvé" });
    }
  });

// Ajouter une réponse à un thread
router.post("/thread/:id/message", async (req, res) => {
  const threadId = req.params.id;
  const { auteur, contenu } = req.body;

  const result = await forumCollection.updateOne(
    { _id: new ObjectId(threadId) },
    {
        $push: {
            messages: {
              _id: new ObjectId(), // 👈 ajoute cet ID unique ici
              auteur,
              contenu,
              timestamp: new Date()
            }
          }
    }
  );

  if (result.modifiedCount === 1) {
    res.status(200).json({ message: "Message ajouté !" });
  } else {
    res.status(404).json({ error: "Thread introuvable" });
  }
});

module.exports = router;