import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../visual/homepage.css'; // Mise à jour du chemin vers le CSS
import backgroundImage from '../../assets/rdr2.png';
import BackgroundSlideshow from './BackgroundSlideshow';
import profileIcon from '../../assets/profile.png';
import parameterIcon from '../../assets/parameter.png';
import logoutIcon from '../../assets/logout.png';

function Homepage() {
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme === 'dark' ? 'dark-mode' : 'light-mode';
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="page-container">
      <header className="header-container">
        <BackgroundSlideshow />
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

      <aside className="sidebar">
        <h2>Navigation</h2>
        <p>Bienvenue dans l'application !</p>
        <p>Utilisez les liens ci-dessous pour naviguer :</p>
        <Link to="/dashboard">Dashboard</Link>
      </aside>

      <main className="main-content">
        <h1>Bienvenue sur RDR2RP !</h1>
      </main>
    </div>
  );
}

export default Homepage;