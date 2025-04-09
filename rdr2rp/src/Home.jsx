import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import backgroundImage from './assets/rdr2.jpg';

function Home() {
  return (
    <div className="home">
      <img src={backgroundImage} alt="Red Dead Redemption 2" />
      <h1>Bienvenue sur RED DEAD ROLEPLAY</h1>
      <div className="button-container">
        <Link to="/login" className="btn-link">Connexion</Link>
        <Link to="/register" className="btn-link">Inscription</Link>
      </div>
    </div>
  );
}

export default Home;