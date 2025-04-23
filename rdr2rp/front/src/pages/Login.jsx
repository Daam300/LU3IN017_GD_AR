import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import de useNavigate
import BackgroundSlideshow from '../BackgroundSlideshow';
import './login.css';

function LoginForm() {
  const navigate = useNavigate(); // Initialisation de navigate

  const handleSubmit = (event) => {
    event.preventDefault();
    /*const result = axios.post('http://localhost:8000/api/auth/login', {
      login: event.target.login.value,
      mdp: event.target.mdp.value,
    });*/
    console.log('Connexion soumise');
    navigate('/homepage'); // Redirection vers la page Homepage
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/'); // Redirection vers la page d'accueil
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
          <button onClick={handleCancel}>Annuler</button>
        </div>
      </form> 
    </div>
  );
}

export default LoginForm;