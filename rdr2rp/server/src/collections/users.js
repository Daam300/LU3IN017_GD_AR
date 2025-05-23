// /back/src/api/users.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");
const router = express.Router();
const JWT_SECRET = "votre_secret_jwt"; // À stocker de manière sécurisée
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'adamrguig82@gmail.com', // ⚠️ à remplacer
    pass: ''        // ⚠️ mot de passe d'application Gmail
  }
});

async function sendApprovalEmail(email, username) {
  const mailOptions = {
    from: 'RDR2RP <tonemail@gmail.com>',
    to: email,
    subject: '✅ Inscription approuvée',
    text: `Bonjour ${username},

Votre inscription à RDR2RP a été validée avec succès !

Vous pouvez maintenant vous connecter à la plateforme.

À très vite,
L’équipe RDR2RP`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[MAIL] Email envoyé à ${email}`);
  } catch (err) {
    console.error("[MAIL] ❌ Erreur d'envoi :", err);
  }
}

let usersCollection;
console.log("[API] /api/users/register prêt !");
client.connect().then(() => {
  const db = client.db("rdrrp_db");
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
router.get('/user/:username', async (req, res) => {
  const user = await usersCollection.findOne(
    { username: req.params.username },
    { projection: { prenom: 0, nom: 0, email: 0, status: 0, password: 0 } }
  );

  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

  res.json(user);
});

router.get('/users/search', async (req, res) => {
  const q = req.query.q;
  const users = await usersCollection.find({
    username: { $regex: q, $options: 'i' }
  }, {
    projection: { username: 1, profilePic: 1 }
  }).toArray();
  res.json(users);
});

// REGISTER
const multer = require('multer');
const upload = multer();

router.post('/register', upload.single('profilePic'), async (req, res) => {
  const { prenom, nom, pseudo, mail, mdp, bio } = req.body;
  let profilePic = '';

  if (req.file) {
    profilePic = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  }

  try {
    const existing = await usersCollection.findOne({ $or: [{ email: mail }, { username: pseudo }] });
    if (existing) return res.status(400).json({ message: "Email ou pseudo déjà utilisé" });

    const hash = await bcrypt.hash(mdp, 10);

    const result = await usersCollection.insertOne({
      email: mail,
      username: pseudo,
      passwordHash: hash,
      prenom,
      nom,
      bio,
      profilePic,
      status: "pending",
      role: "user",
      createdAt: new Date()
    });

    res.status(201).json({ userId: result.insertedId });
  } catch (e) {
    console.error("[REGISTER] ❌", e);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { login, mdp } = req.body;
    console.log("[LOGIN] Reçu :", { login, mdp });
  
    try {
      const user = await usersCollection.findOne({ username: login });
      console.log("[LOGIN] Utilisateur trouvé :", user);
  
      if (!user) {
        console.log("[LOGIN] ❌ Aucun utilisateur trouvé");
        return res.status(401).json({ message: 'Utilisateur introuvable' });
      }
  
      const match = await bcrypt.compare(mdp, user.passwordHash);
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
      console.log("[LOGIN] Mot de passe valide ?", match);
  
      if (!match) {
        console.log("[LOGIN] ❌ Mot de passe incorrect");
        return res.status(401).json({ message: 'Mot de passe incorrect' });
      }
  
      if (user.status === 'pending') {
        console.log("[LOGIN] ❌ Compte en attente");
        return res.status(403).json({ message: 'Compte en attente', status: 'pending' });
      }
  
      console.log("[LOGIN] ✅ Connexion réussie");
      return res.status(200).json({
        message: 'Connexion réussie',
        token, 
        status: user.status,
        role: user.role,
        username: user.username,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email
      });
    } catch (err) {
      console.error("[LOGIN] 💥 Erreur serveur :", err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  });

// LOGOUT — handled client-side or via token blacklist
router.post("/logout", (req, res) => {
  res.status(200).send("Déconnexion effectuée côté client");
});

//POFILE
router.get("/me", auth, async (req, res) => {
  const user = await usersCollection.findOne(
    { _id: new ObjectId(req.user.id) },
    {
      projection: {
        passwordHash: 0, // ne jamais renvoyer le hash
      },
    }
  );

  if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

  res.json(user);
});

router.patch("/me/photo", auth, async (req, res) => {
  const { profilePic } = req.body;

  console.log("[PHOTO] Reçu : ", profilePic?.substring(0, 30));
  console.log("[PHOTO] User ID : ", req.user?.id);

  if (!profilePic) return res.status(400).json({ message: "Aucune photo envoyée" });

  try {
    await usersCollection.updateOne(
      { _id: new ObjectId(req.user.id) },
      { $set: { profilePic } }
    );
    res.status(200).json({ message: "Photo mise à jour" });
  } catch (err) {
    console.error("[PHOTO] ❌ Erreur DB :", err);
    res.status(500).json({ message: "Erreur base de données" });
  }
});

router.patch("/me/bio", auth, async (req, res) => {
  const { bio } = req.body;
  if (!bio) return res.status(400).json({ message: "Bio manquante" });

  await usersCollection.updateOne(
    { _id: new ObjectId(req.user.id) },
    { $set: { bio } }
  );

  res.status(200).json({ message: "Bio mise à jour" });
});
router.patch("/me/character-bio", auth, async (req, res) => {
  const { characterBio } = req.body;
  if (!characterBio) return res.status(400).json({ message: "Biographie manquante" });

  try {
    await usersCollection.updateOne(
      { _id: new ObjectId(req.user.id) },
      { $set: { characterBio } }
    );
    res.status(200).json({ message: "Biographie du personnage mise à jour" });
  } catch (err) {
    console.error("❌ Erreur mise à jour characterBio :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
router.patch("/me", auth, async (req, res) => {
  const updates = {};
  const { username, email, password } = req.body;

  if (username) {
    if (!/[A-Z]/.test(username)) {
      return res.status(400).json({ message: "Le pseudo doit contenir une majuscule" });
    }
    updates.username = username;
  }

  if (email) {
    updates.email = email;
  }

  if (password) {
    const hash = await bcrypt.hash(password, 10);
    updates.passwordHash = hash;
  }

  try {
    await usersCollection.updateOne(
      { _id: new ObjectId(req.user.id) },
      { $set: updates }
    );
    res.status(200).json({ message: "Profil mis à jour" });
  } catch (err) {
    console.error("❌ Erreur update profil :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ADMIN 
router.get('/users/pending', async (req, res) => {
  const users = await usersCollection.find({ status: 'pending' }).toArray();
  res.json(users);
});

router.get('/users/approved', async (req, res) => {
  const users = await usersCollection.find({ status: 'approved' }).toArray();
  res.json(users);
});

router.post('/users/validate/:id', async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  const status = action === 'approve' ? 'approved' : 'refused';

  await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status } }
  );

  if (action === 'approve') {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (user?.email && user?.username) {
      await sendApprovalEmail(user.email, user.username);
    }
  }

  res.sendStatus(200);
});

router.post('/users/toggleAdmin/:id', async (req, res) => {
  const { id } = req.params;

  const user = await usersCollection.findOne({ _id: new ObjectId(id) });
  if (!user) return res.status(404).send("Utilisateur introuvable");

  const newRole = user.role === 'admin' ? 'user' : 'admin';

  await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { role: newRole } }
  );

  res.sendStatus(200);
});

// DELETE ACCOUNT
router.delete("/me", auth, async (req, res) => {
  const result = await usersCollection.deleteOne({ _id: new ObjectId(req.user.id) });
  if (result.deletedCount === 0) return res.status(404).send("Utilisateur introuvable");
  res.sendStatus(204);
});

module.exports = router;