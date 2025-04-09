import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';  // Assurez-vous que le fichier CSS est bien importé
import backgroundImage from './assets/rdr2.jpg';  // Si tu utilises une image locale

function Home() {
  return (
    <div className="home" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <h1>Bienvenue sur RDR2 RP</h1>
      <div className="button-container">
        <Link to="/login">
          <button className="btn">Connexion</button>
        </Link>
        <Link to="/register">
          <button className="btn">Inscription</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;