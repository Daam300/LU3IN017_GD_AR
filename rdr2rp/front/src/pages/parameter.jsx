import React, { useState, useEffect } from 'react';
import './parameter.css';

function Parameter() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Récupère le thème depuis le Local Storage ou utilise false par défaut
    return localStorage.getItem('theme') === 'dark';
  });

  const handleSave = (e) => {
    e.preventDefault();
    console.log('Paramètres sauvegardés :', { username, email, password });
    alert('Vos paramètres ont été sauvegardés.');
  };

  const handleSaveTheme = () => {
    // Sauvegarde le choix du thème dans le Local Storage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    alert('Le thème a été sauvegardé.');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode); // Bascule entre clair et sombre
  };

  // Appliquer la classe au <body> en fonction de isDarkMode
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  return (
    <div className="parameter-container">
      <h1>Paramètres</h1>
      <div className="theme-toggle-container" onClick={toggleTheme}>
        <div className={`theme-toggle-circle ${isDarkMode ? 'filled' : 'empty'}`}></div>
        <span>{isDarkMode ? 'Mode Sombre' : 'Mode Clair'}</span>
      </div>
      <button className="save-button" onClick={handleSaveTheme}>
        Sauvegarder le thème
      </button>
      <form className="parameter-form" onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Adresse e-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="save-button">Sauvegarder</button>
      </form>
    </div>
  );
}

export default Parameter;