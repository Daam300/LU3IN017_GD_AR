import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BackgroundSlideshow from './BackgroundSlideshow';
import '../visual/Login.css'; // Mise à jour du chemin vers le CSS

function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Connexion soumise');
    navigate('/homepage');
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="login-container">
      <BackgroundSlideshow />
      <h1>Ouvrir une session</h1>
      <form method="POST" onSubmit={handleSubmit} className="login-form">
        <label htmlFor="login">Login</label>
        <input id="login" name="login" type="text" />

        <label htmlFor="mdp">Mot de passe</label>
        <input id="mdp" name="mdp" type="password" />

        <div className="button-group">
          <button type="submit">Connexion</button>
          <button onClick={handleCancel}>Annuler</button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;