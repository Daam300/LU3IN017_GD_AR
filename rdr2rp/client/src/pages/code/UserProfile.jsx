import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../visual/Profile.css';
import SketchfabModel from './SketchfabModel';
import profileIcon from '../../assets/profile.png';
import BackgroundSlideshow from './BackgroundSlideshow';
import parameterIcon from '../../assets/parameter.png';
import logoutIcon from '../../assets/logout.png';
import rdr2Logo from '../../assets/rdr2.png';
import { useUser } from './UserContext';
import adminIcon from '../../assets/admin.png';
function UserProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userThreads, setUserThreads] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [isMessagesVisible, setIsMessagesVisible] = useState(false);  
  const [notFound, setNotFound] = useState(false);
  const { profilePic } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const handleBackToHome = () => {
    navigate('/homepage');
  };
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };
  useEffect(() => {
    fetch(`http://localhost:3000/api/user/${username}`)
      .then(res => {
        if (!res.ok) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) setUserData(data);
      })
      .catch(err => {
        console.error("Erreur de chargement utilisateur:", err);
        setNotFound(true);
      });
  
    fetch(`http://localhost:3000/api/forum/threads/user/${username}`)
      .then(res => res.json())
      .then(data => setUserThreads(data.filter(thread => !thread.prive))) // exclut les threads privés
      .catch(err => console.error("Erreur récupération threads utilisateur:", err));
  
    fetch(`http://localhost:3000/api/forum/messages/user/${username}`)
      .then(res => res.json())
      .then(data => setUserMessages(data))
      .catch(err => console.error("Erreur récupération messages utilisateur:", err));
  }, [username]);


  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
  }, []);

  if (notFound) {
    return (
      <div className="page-container">
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
              {isAdmin && (
                <img
                  src={adminIcon}
                  alt="Admin"
                  className="icon-button"
                  onClick={() => navigate('/admin')}
                />
              )}
              <img
                src={logoutIcon}
                alt="Se déconnecter"
                className="icon-button"
                onClick={handleLogout}
              />
            </div>
          </div>
        </header>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem' }}>Utilisateur introuvable</h2>
          <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
            Ce profil n'existe plus ou a été supprimé.
          </p>
        </div>
      </div>
    );
  }
  
  if (!userData) return <p>Chargement...</p>;
  return (
    <div className="page-container">
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
            {isAdmin && (
              <img
                src={adminIcon}
                alt="Admin"
                className="icon-button"
                onClick={() => navigate('/admin')}
              />
            )}
            <img
              src={logoutIcon}
              alt="Se déconnecter"
              className="icon-button"
              onClick={handleLogout}
            />
          </div>
        </div>
      </header>
      <div className="profile-layout">
        <aside className="profile-sidebar">
          <img src={userData.profilePic || profileIcon} alt="Profil" className="profile-logo" />
          <h1>{userData.username.toUpperCase()}</h1>
          <p><strong>Bio :</strong></p>
          <p>{userData.bio || 'Non renseignée'}</p>
          <p><strong>Forums :</strong></p>
          <ul>
            {userThreads.map(thread => (
              <li key={thread._id}>
              <a href={`/forum/${thread._id}`} style={{ color: '#e0c097', textDecoration: 'underline' }}>
                {thread.titre}
              </a>
            </li>
            ))}
          </ul>
          <div className="messages-toggle">
            <button onClick={() => setIsMessagesVisible(!isMessagesVisible)}>Messages envoyés</button>                                                                  
          </div>
        </aside>
        <main className="profile-main-content">
          <div className="model-bio-container">
            <div className="sketchfab-model-container">
              <SketchfabModel />
            </div>
            <div className="character-bio-section">
              <p><strong>Bio personnage :</strong></p>
              <p>{userData.characterBio || 'Non renseignée'}</p>
            </div>
          </div>
        </main>
        <aside className={`messages-sidebar ${isMessagesVisible ? 'visible' : ''}`}>
            <h2>Messages envoyés</h2>
            <ul>
                {userMessages.map((msg, index) => (
                <li key={index}>
                    <p><strong>Thread:</strong> {msg.threadTitle}</p>
                    <p>{msg.contenu}</p>
                    <button
                    onClick={() => navigate(`/thread/${msg.threadId}`)}
                    style={{ marginTop: "5px", padding: "3px 8px", fontSize: "0.9rem" }}
                    >
                    Voir le message
                    </button>
                </li>
                ))}
            </ul>
        </aside>
      </div>
    </div>
  );
}

export default UserProfile;