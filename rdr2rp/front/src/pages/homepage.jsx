import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import de useNavigate et Link
import './homepage.css';
import backgroundImage from '../assets/rdr2.png';
import BackgroundSlideshow from '../BackgroundSlideshow';

function Homepage() {
  const navigate = useNavigate(); // Initialisation de navigate

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
            <button onClick={handleLogout}>Se déconnecter</button>
          </div>
        </div>
      </header>

      {/* Barre latérale */}
      <aside className="sidebar">
        <h2>Navigation</h2>
        <p>Bienvenue dans l'application !</p>
        <p>Utilisez les liens ci-dessous pour naviguer :</p>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profil</Link>
        <Link to="/settings">Paramètres</Link>
      </aside>

      {/* Contenu principal */}
      <main className="main-content">
        <h1>Bienvenue sur la page principale</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          euismod lacus sed velit fringilla ullamcorper.
        </p>
      </main>
    </div>
  );
}

export default Homepage;