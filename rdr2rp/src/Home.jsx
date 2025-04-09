import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';  // Assurez-vous que le fichier CSS est bien importé
import backgroundImage from './assets/rdr2.jpg';  // L'image à afficher

function Home() {
  return (
    <div className="home">
      <img src={backgroundImage} alt="Red Dead Redemption 2" />
      <h1>Bienvenue sur RED DEAD ROLEPLAY</h1>
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