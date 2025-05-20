import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BackgroundSlideshow from './BackgroundSlideshow';
import '../visual/Login.css'; // Mise à jour du chemin vers le CSS

function LoginForm() {
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [mdp, setMdp] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, mdp }),
      });
  
      const contentType = response.headers.get('content-type');
      const data = contentType?.includes('application/json') ? await response.json() : null;
  
      if (response.ok) {
        if (data?.status === 'pending') {
          navigate('/signup_waiting');
        } else {
          localStorage.setItem("role", data.role);
          navigate('/homepage');
        }
      } else if (response.status === 403 && data?.status === 'pending') {
        navigate('/signup_waiting');
      } else {
        alert(data?.message || 'Erreur de connexion');
      }
    } catch (err) {
      console.error('Erreur réseau:', err);
      alert('Erreur de connexion');
    }
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
        <label htmlFor="login">Nom d'utilisateur</label>
        <input
          id="login"
          name="login"
          type="text"
          value={login}
          onChange={e => setLogin(e.target.value)}
        />

        <label htmlFor="mdp">Mot de passe</label>
        <input
          id="mdp"
          name="mdp"
          type="password"
          value={mdp}
          onChange={e => setMdp(e.target.value)}
        />

        <div className="button-group">
          <button type="submit">Connexion</button>
          <button onClick={handleCancel}>Annuler</button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;