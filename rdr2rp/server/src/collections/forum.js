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
    forumCollection = client.db("rdrrp_db").collection("forum");
  }
}
router.get('/threads/search', async (req, res) => {
  const { q, auteur, startDate, endDate } = req.query;

  const filter = {};

  if (q) {
    filter['messages.contenu'] = { $regex: q, $options: 'i' };
  }

  if (auteur) {
    filter['messages.auteur'] = auteur;
  }

  if (startDate || endDate) {
    filter['messages.timestamp'] = {};
    if (startDate) filter['messages.timestamp'].$gte = new Date(startDate);
    if (endDate) filter['messages.timestamp'].$lte = new Date(endDate);
  }

  try {
    const results = await forumCollection.find(filter).toArray();
    res.json(results);
  } catch (err) {
    console.error("Erreur recherche avancée", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get('/messages/user/:username', async (req, res) => {
  const { username } = req.params;

  try {
    await connectDB(); // 🔧 assure l'initiation de la connexion

    const threads = await forumCollection.find({ 'messages.auteur': username }).toArray();

    const messages = threads.flatMap(thread =>
      thread.messages
        .filter(msg => msg.auteur === username)
        .map(msg => ({
          _id: msg._id,
          contenu: msg.contenu,
          timestamp: msg.timestamp,
          threadId: thread._id,
          threadTitle: thread.titre
        }))
    );

    res.json(messages);
  } catch (err) {
    console.error("Erreur API messages user:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


router.get("/thread/:id", async (req, res) => {
  const thread = await forumCollection.findOne({ _id: new ObjectId(req.params.id) });
  if (!thread) return res.status(404).json({ message: "Thread non trouvé" });

  const token = req.headers.authorization?.split(" ")[1];
  const isPrivate = thread.prive;

  if (isPrivate) {
    if (!token) return res.status(403).json({ message: "Accès refusé" });
    try {
      const user = jwt.verify(token, JWT_SECRET);
      const dbUser = await client.db(dbName).collection("users").findOne({ _id: new ObjectId(user.id) });
      if (dbUser.role !== 'admin') {
        return res.status(403).json({ message: "Accès réservé aux administrateurs" });
      }
    } catch (e) {
      return res.status(403).json({ message: "Token invalide" });
    }
  }

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


  // 🔽 Récupérer les threads d'un utilisateur spécifique
router.get("/threads/user/:username", async (req, res) => {
    const { username } = req.params;
  
    try {
      const threads = await forumCollection.find({ auteur: username }).toArray();
      res.json(threads);
    } catch (err) {
      console.error("Erreur lors de la récupération des threads utilisateur:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  
  // ✅ Supprimer un thread (admin uniquement)
// Supprimer un message d'un thread (admin ou auteur uniquement)
router.delete("/thread/:threadId/message/:messageId", auth, async (req, res) => {
  const { threadId, messageId } = req.params;

  if (!ObjectId.isValid(threadId) || !ObjectId.isValid(messageId)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const thread = await forumCollection.findOne({ _id: new ObjectId(threadId) });
    if (!thread) return res.status(404).json({ message: "Thread introuvable" });

    const message = thread.messages.find(msg => msg._id.toString() === messageId);
    if (!message) return res.status(404).json({ message: "Message introuvable" });

    const user = await client.db(dbName).collection("users").findOne({ _id: new ObjectId(req.user.id) });
    const isAdmin = user.role === "admin";
    const isAuthor = message.auteur === user.username;

    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ message: "Accès refusé" });
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
  } catch (err) {
    console.error("Erreur suppression message:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
  
router.get("/threads/admin", async (req, res) => {
  const threads = await forumCollection.find({ prive: true }).sort({ createdAt: -1 }).toArray();
  res.json(threads);
});

// Créer un nouveau thread
// Créer un nouveau thread
router.post("/thread", async (req, res) => {
  const { titre, auteur, message, description, prive = false } = req.body; // 👈 inclure `description`

  const thread = {
    titre,
    auteur,
    description,
    createdAt: new Date(),
    prive, // ✅ bien inclure ce champ
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
  const token = req.headers.authorization?.split(" ")[1];
  let isAdmin = false;

  if (token) {
    try {
      const user = jwt.verify(token, JWT_SECRET);
      const dbUser = await client.db(dbName).collection("users").findOne({ _id: new ObjectId(user.id) });
      isAdmin = dbUser?.role === "admin";
    } catch {
      // ignore
    }
  }

  const threads = await forumCollection.find().sort({ createdAt: -1 }).toArray();
  const filtered = isAdmin ? threads : threads.filter(t => !t.prive);

  res.json(filtered);
});
router.delete("/thread/:id", auth, async (req, res) => {
  const threadId = req.params.id;

  if (!ObjectId.isValid(threadId)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const user = await client.db(dbName).collection("users").findOne({ _id: new ObjectId(req.user.id) });

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Seuls les admins peuvent supprimer un thread." });
    }

    // ✅ supprime tout le document = thread + messages
    const result = await forumCollection.deleteOne({ _id: new ObjectId(threadId), prive: { $ne: true } });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Thread supprimé" });
    } else {
      res.status(404).json({ message: "Thread non trouvé ou privé" });
    }
  } catch (err) {
    console.error("Erreur suppression thread:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
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