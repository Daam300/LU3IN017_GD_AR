import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import de useNavigate et Link
import './homepage.css';
import backgroundImage from '../assets/rdr2.png';
import BackgroundSlideshow from '../BackgroundSlideshow';
import profileIcon from '../assets/profile.png';
import parameterIcon from '../assets/parameter.png';
import logoutIcon from '../assets/logout.png';

function Homepage() {
  const navigate = useNavigate(); // Initialisation de navigate

  useEffect(() => {
    // Récupère le thème depuis le Local Storage
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme === 'dark' ? 'dark-mode' : 'light-mode';
  }, []);

  const handleLogout = () => {
    navigate('/'); // Redirection vers la page d'accueil
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Message envoyé');
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="header-container">
        <BackgroundSlideshow /> {/* Images défilantes en arrière-plan */}
        <div className="header-content">
          <div className="logo1">
            <img src={backgroundImage} alt="Red Dead Redemption 2" />
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

      {/* Barre latérale */}
      <aside className="sidebar">
        <h2>Navigation</h2>
        <p>Bienvenue dans l'application !</p>
        <p>Utilisez les liens ci-dessous pour naviguer :</p>
        <Link to="/dashboard">Dashboard</Link>
      </aside>

      {/* Contenu principal */}
      <main className="main-content">
        <h1>Bienvenue sur RDR2RP !</h1>
      </main>
    </div>
  );
}

export default Homepage;