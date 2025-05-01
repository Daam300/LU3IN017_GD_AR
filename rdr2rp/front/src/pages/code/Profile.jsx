import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../visual/Profile.css';
import BackgroundSlideshow from './BackgroundSlideshow';
import profileIcon from '../../assets/profile.png';
import parameterIcon from '../../assets/parameter.png';
import logoutIcon from '../../assets/logout.png';
import rdr2Logo from '../../assets/rdr2.png';

function Profile() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    username: 'JohnDoe',
    email: 'johndoe@example.com',
    registrationDate: '2025-01-15',
    bio: 'Passionné par les jeux vidéo et le développement web.',
  });

  const [messages, setMessages] = useState([
    'Message 1 : Bonjour !',
    'Message 2 : Comment ça va ?',
    'Message 3 : Merci pour votre aide.',
    'Message 4 : À bientôt !',
  ]);

  const [isMessagesVisible, setIsMessagesVisible] = useState(false); // État pour afficher ou masquer la barre latérale

  useEffect(() => {
    const fetchUserData = async () => {
      const data = {
        username: 'JohnDoe',
        email: 'johndoe@example.com',
        registrationDate: '2025-01-15',
        bio: 'Passionné par les jeux vidéo et le développement web. Je suis un développeur passionné par la création d\'applications web et mobiles. J\'adore explorer de nouveaux défis et apprendre de nouvelles technologies.',
      };
      setUserData(data);
    };

    fetchUserData();
  }, []);

  const handleBackToHome = () => {
    navigate('/homepage');
  };

  const handleLogout = () => {
    navigate('/');
  };

  const toggleMessages = () => {
    setIsMessagesVisible(!isMessagesVisible); // Bascule l'état d'affichage de la barre latérale
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="header-container">
        <BackgroundSlideshow />
        <div className="header-content">
          <div className="logo1">
            <img src={rdr2Logo} alt="Red Dead Redemption 2" />
          </div>

          <div className="search1">
            <form>
              <input id="search" type="text" placeholder="Recherche..." />
            </form>
          </div>

          <div className="login_register">
            <img
              src={profileIcon}
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
      <div className="profile-container">
        {/* Photo de profil */}
        <img src={profileIcon} alt="Photo de profil" className="profile-logo" />
        <h1>Profil de l'utilisateur</h1>
        <div className="profile-info">
          <p><strong>Pseudo :</strong> {userData.username}</p>
          <p><strong>Email :</strong> {userData.email}</p>
          <p><strong>Date d'inscription :</strong> {userData.registrationDate}</p>
          <p><strong>Bio :</strong> {userData.bio}</p>
        </div>

        {/* Bouton pour afficher/masquer les messages */}
        <div className="messages-toggle">
          <button onClick={toggleMessages}>Messages envoyés</button>
        </div>

        {/* Bouton pour retourner à l'accueil */}
        <button className="back-button" onClick={handleBackToHome}>
          Retour à l'accueil
        </button>
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