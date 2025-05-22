import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundSlideshow from './BackgroundSlideshow';
import '../visual/Register.css'; // Mise à jour du chemin vers le CSS

function Register() {
  const navigate = useNavigate();

  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [mail, setMail] = useState('');
  const [confirmMail, setConfirmMail] = useState('');
  const [mdp, setMdp] = useState('');
  const [confirmMdp, setConfirmMdp] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);

  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    if (!prenom.trim() || !nom.trim() || !pseudo.trim() ||
        !mail.trim() || !confirmMail.trim() ||
        !mdp.trim() || !confirmMdp.trim()) {
      alert('Tous les champs sont requis');
      return;
    }
    if (mail !== confirmMail) {
      alert('Les adresses mail ne correspondent pas');
      return;
    }
    if (mdp !== confirmMdp) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    if (!bio.trim()) {
      alert("La bio est requise");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('prenom', prenom);
      formData.append('nom', nom);
      formData.append('pseudo', pseudo);
      formData.append('mail', mail);
      formData.append('mdp', mdp);
      formData.append('bio', bio);
      if (profilePicFile) {
        formData.append('profilePic', profilePicFile);
      }
    
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        body: formData
      });
    
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }
    
      if (response.ok) {
        navigate('/signup_waiting');
      } else {
        alert(data?.message || 'Erreur lors de l’inscription');
      }
    } catch (err) {
      console.error('Erreur réseau :', err);
      alert('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="register-container">
      <BackgroundSlideshow />
      <h1>Page d'Inscription</h1>
      <form className="register-form" onSubmit={handleSubmit}>
      <label htmlFor="profilePic" className="custom-upload-button">Choisir une photo de profil</label>
      <input
        id="profilePic"
        name="profilePic"
        type="file"
        accept="image/*"
        onChange={e => setProfilePicFile(e.target.files[0])}
        style={{ display: 'none' }}
      />
        {profilePicFile && (
          <img
            src={URL.createObjectURL(profilePicFile)}
            alt="Preview"
            className="profile-preview"
          />
        )}
        <label htmlFor="prenom">Prénom</label>
        <input
          id="prenom"
          name="prenom"
          type="text"
          value={prenom}
          onChange={e => setPrenom(e.target.value)}
        />

        <label htmlFor="nom">Nom</label>
        <input
          id="nom"
          name="nom"
          type="text"
          value={nom}
          onChange={e => setNom(e.target.value)}
        />

        <label htmlFor="log">Pseudo</label>
        <input
          id="log"
          name="pseudo"
          type="text"
          value={pseudo}
          onChange={e => setPseudo(e.target.value)}
        />

        <label htmlFor="log">Mail</label>
        <input
          id="log"
          name="mail"
          type="email"
          value={mail}
          onChange={e => setMail(e.target.value)}
        />

        <label htmlFor="log">Confirmez votre adresse mail</label>
        <input
          id="log"
          name="confirmMail"
          type="email"
          value={confirmMail}
          onChange={e => setConfirmMail(e.target.value)}
        />

        <label htmlFor="mp1">Mot de passe</label>
        <input
          id="mp1"
          name="mdp"
          type="password"
          value={mdp}
          onChange={e => setMdp(e.target.value)} 
        />

        <label htmlFor="mp2">Retapez le mot de passe</label>
        <input
          id="mp2"
          name="confirmMdp"
          type="password"
          value={confirmMdp}
          onChange={e => setConfirmMdp(e.target.value)}
        />
        <label htmlFor="bio">Biographie</label>
        <textarea
          id="bio"
          name="bio"
          value={bio}
          onChange={e => setBio(e.target.value)}
          rows="4"
        />



        <div className="buttons">
          <button type="submit">Inscription</button>
          <button type="button" onClick={handleCancel}>Annuler</button>
        </div>
      </form>
    </div>
  );
}

export default Register;