import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../visual/Profile.css';
import BackgroundSlideshow from './BackgroundSlideshow';
import profileIcon from '../../assets/profile.png';
import parameterIcon from '../../assets/parameter.png';
import logoutIcon from '../../assets/logout.png';
import rdr2Logo from '../../assets/rdr2.png';
import SketchfabModel from './SketchfabModel'; // 👈 import du modèle Sketchfab

function Profile() {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(profileIcon);
  const [userData, setUserData] = useState({
    prenom: '',
    nom: '',
    username: '',
    email: '',
    bio: 'Passionné par les jeux vidéo et le développement web.',
  });

  const [messages, setMessages] = useState([
    'Message 1 : Bonjour !',
    'Message 2 : Comment ça va ?',
    'Message 3 : Merci pour votre aide.',
    'Message 4 : À bientôt !',
  ]);

  const [isMessagesVisible, setIsMessagesVisible] = useState(false);
  const [characterBio, setCharacterBio] = useState('Biographie du personnage non renseignée.');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/api/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUserData({
          prenom: data.prenom,
          nom: data.nom,
          username: data.username,
          email: data.email,
          bio: data.bio || 'Bio non renseignée'
        });
        setProfilePic(data.profilePic || profileIcon);
      })
      .catch(err => console.error('Erreur récupération profil', err));
  }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const maxSize = 300;
        let width = img.width;
        let height = img.height;
  
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
  
        canvas.width = width;
        canvas.height = height;
  
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', 0.8); // compression jpeg
  
        setProfilePic(base64);
  
        const token = localStorage.getItem('token');
        try {
          const res = await fetch('http://localhost:3000/api/me/photo', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ profilePic: base64 })
          });
  
          if (!res.ok) throw new Error("Échec mise à jour photo");
          console.log("✅ Photo de profil mise à jour !");
        } catch (err) {
          console.error("❌ Erreur MAJ photo:", err);
          alert("Erreur lors de la sauvegarde de la photo.");
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleBackToHome = () => {
    navigate('/homepage');
  };

  const handleLogout = () => {
    navigate('/');
  };

  const toggleMessages = () => {
    setIsMessagesVisible(!isMessagesVisible);
  };

  const handleSaveBio = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/api/me/bio', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ bio: userData.bio })
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      alert("Bio mise à jour !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleSaveCharacterBio = async () => {
    const token = localStorage.getItem('token');
    try {
      // Envoie la bio du personnage au serveur
      const res = await fetch('http://localhost:3000/api/me/character-bio', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ characterBio: characterBio })
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour de la bio du personnage");
      alert("Bio du personnage mise à jour !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour de la bio du personnage");
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="header-container">
        <BackgroundSlideshow />
        <div className="header-content">
          <div className="logo1">
            <img src={rdr2Logo} alt="Red Dead Redemption 2" onClick={handleBackToHome} style={{cursor: 'pointer'}}/>
          </div>

          <div className="search1">
            <form>
              <input id="search" type="text" placeholder="Recherche..." />
            </form>
          </div>

          <div className="login_register">
            <img
              src={profilePic}
              alt="Profil"
              className="icon-button"
              onClick={() => navigate('/profile')}
            />
            <img
              src={parameterIcon}
              alt="Paramètres"
              className="icon-button"
              onClick={() => navigate('/parameter')}
            />
            <img
              src={logoutIcon}
              alt="Se déconnecter"
              className="icon-button"
              onClick={handleLogout}
            />
          </div>
        </div>
      </header>

      {/* Profil */}
      <div className="profile-layout">
        <aside className="profile-sidebar">
          <img src={profilePic} alt="Photo de profil" className="profile-logo" />
          <input type="file" accept="image/*" onChange={handleProfilePicChange} />
          <h1>Profil de l'utilisateur</h1>
          <div className="profile-info">
            <p><strong>Pseudo :</strong> {userData.username}</p>
            <label><strong>Bio :</strong></label>
            <textarea
              value={userData.bio}
              onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
              rows={4}
            />
            <button onClick={handleSaveBio}>Enregistrer la bio</button>
          </div>
          <div className="messages-toggle">
            <button onClick={toggleMessages}>Messages envoyés</button>
          </div>
          <button className="back-button" onClick={handleBackToHome}>
            Retour à l'accueil
          </button>
        </aside>
        <main className="profile-main-content">
          <div className="profile-content">
            {/* Ajout du conteneur pour le modèle 3D et la biographie */}
            <div className="model-bio-container">
              {/* Modèle 3D */}
              <div className="sketchfab-model-container">
                <SketchfabModel />
              </div>

              {/* Biographie du personnage */}
              <div className="character-bio-section">
                <textarea
                  id="characterBio"
                  value={characterBio}
                  onChange={(e) => setCharacterBio(e.target.value)}
                />
                {/* Ajout du bouton pour enregistrer la bio du personnage */}
                <button onClick={handleSaveCharacterBio}>Enregistrer la bio du personnage</button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Barre latérale des messages */}
      <aside className={`messages-sidebar ${isMessagesVisible ? 'visible' : ''}`}>
        <h2>Messages envoyés</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export default Profile;
