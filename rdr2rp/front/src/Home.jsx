import React from 'react';
import { Link } from 'react-router-dom';
import BackgroundSlideshow from './BackgroundSlideshow';
import './Home.css';
import backgroundImage from './assets/rdr2.png';

function Home() {
  return (
    <div className="home">
      <BackgroundSlideshow />
      <img src={backgroundImage} alt="Red Dead Redemption 2" />
      <h1>Bienvenue sur RDR2 RP</h1>
      <div className="button-container">
        <Link to="/login" className="btn-link">Connexion</Link>
        <Link to="/register" className="btn-link">Inscription</Link>
      </div>
    </div>
  );
}
export default Home;