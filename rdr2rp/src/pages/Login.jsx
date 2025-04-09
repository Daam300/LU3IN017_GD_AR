import React from 'react';
import { Link } from 'react-router-dom';
import BackgroundSlideshow from '../BackgroundSlideshow';
import './login.css';

function LoginForm() {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Connexion soumise');
  };

  return (
    <div className="login-container">
      <BackgroundSlideshow /> {/* Fond dynamique */}
      <h1>Ouvrir une session</h1>
      <form method="POST" onSubmit={handleSubmit} className="login-form">
        <label htmlFor="login">Login</label>
        <input id="login" name="login" type="text" />

        <label htmlFor="mdp">Mot de passe</label>
        <input id="mdp" name="mdp" type="password" />

        <div className="button-group">
          <button type="submit">Connexion</button>
          <button type="reset">Annuler</button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;