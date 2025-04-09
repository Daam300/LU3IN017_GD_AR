import React from 'react';
import './login.css';

function LoginForm() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Ajoutez ici la logique pour gérer la connexion
    console.log('Connexion soumise');
  };

  return (
    <div>
      <h1>Ouvrir une session</h1>
      <form method="POST" onSubmit={handleSubmit}>
        <label htmlFor="login">Login</label>
        <input id="login" name="login" type="text" /><br />
        <label htmlFor="mdp">Mot de passe</label>
        <input id="mdp" name="mdp" type="password" /><br />
        <button type="submit">Connexion</button>
        <button type="reset">Annuler</button>
      </form>
    </div>
  );
}

export default LoginForm;