import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../visual/forum.css';
import backgroundImage from '../../assets/rdr2.png';
import BackgroundSlideshow from './BackgroundSlideshow';
import profileIcon from '../../assets/profile.png';
import parameterIcon from '../../assets/parameter.png';
import logoutIcon from '../../assets/logout.png';
import adminIcon from '../../assets/admin.png';

function Forum() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("role") === "admin";

  const handleLogout = () => {
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/homepage');
  };

  return (
    <div className="page-container">
      <header className="header-container">
        <BackgroundSlideshow />
        <div className="header-content">
          <div className="logo1">
            <img src={backgroundImage} alt="Red Dead Redemption 2" onClick={handleLogoClick} style={{cursor: 'pointer'}}/>
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
            {isAdmin && (
              <img
                src={adminIcon}
                alt="Admin"
                className="icon-button"
                onClick={() => navigate('/admin')}
                title="Admin Panel"
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

      <aside className="sidebar">
        <h2>Navigation</h2>
        <p>Bienvenue dans le forum !</p>
        <p>Utilisez les liens ci-dessous pour naviguer :</p>
        <Link to="/homepage">Retour à l'accueil</Link>
      </aside>

      <main className="main-content">
        <h1>Bienvenue dans le Forum !</h1>
        <p>Contenu du forum ici...</p>
      </main>
    </div>
  );
}

export default Forum;