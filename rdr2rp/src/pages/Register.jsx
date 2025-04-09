import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundSlideshow from '../BackgroundSlideshow'; // Assure-toi que le chemin est correct
import './Register.css';

function Register() {
  const navigate = useNavigate();

  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/'); // Redirection vers la page d'accueil
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/signup_waiting'); // Redirection vers la page signup_waiting
  };

  return (
    <div className="register-container">
      <BackgroundSlideshow /> {/* Ajoute le fond dynamique */}
      <h2>Page d'Inscription</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label htmlFor="prenom">Prénom</label>
        <input type="text" id="prenom" />

        <label htmlFor="nom">Nom</label>
        <input type="text" id="nom" />

        <label htmlFor="log">Login</label>
        <input type="text" id="log" />

        <label htmlFor="mp1">Mot de passe</label>
        <input type="password" id="mp1" />

        <label htmlFor="mp2">Retapez le mot de passe</label>
        <input type="password" id="mp2" />

        <div className="button-group">
          <button type="submit">Inscription</button>
          <button onClick={handleCancel}>Annuler</button>
        </div>
      </form>
    </div>
  );
}

export default Register;