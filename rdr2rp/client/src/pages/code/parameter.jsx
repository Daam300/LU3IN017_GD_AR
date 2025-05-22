import React, { useState, useEffect } from 'react';
import '../visual/parameter.css';

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

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // Appliquer la classe au <body> en fonction de isDarkMode
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  const handleDeleteAccount = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/me', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression du compte');
      localStorage.clear();
      alert('Votre compte a bien été supprimé.');
      window.location.href = '/';
    } catch (err) {
      alert('Erreur lors de la suppression du compte.');
    }
  };

  return (
    <div className="parameter-container">
      <h1>Paramètres</h1>
      <div className="theme-toggle-container" onClick={toggleTheme}>
        <div className={`theme-toggle-circle ${isDarkMode ? 'filled' : 'empty'}`}></div>
        <span>{isDarkMode ? 'Mode Sombre' : 'Mode Clair'}</span>
      </div>
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
        <button className="delete-account-btn" type="button" onClick={handleDeleteAccount}>
          Supprimer mon compte
        </button>
        <button type="submit" className="save-button">Sauvegarder</button>
      </form>
    </div>
  );
}

export default Parameter;