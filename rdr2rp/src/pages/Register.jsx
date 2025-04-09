import React from 'react';
import './Register.css'; // N'oublie pas d'importer ton CSS ici

function Register() {
  return (
    <div className="register-container">
      <h2>Page d'Inscription</h2>
      <form className="register-form">
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
          <button type="reset">Annuler</button>
        </div>
      </form>
    </div>
  );
}

export default Register;