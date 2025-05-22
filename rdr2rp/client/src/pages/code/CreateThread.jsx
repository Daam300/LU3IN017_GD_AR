import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../visual/create-thread.css';

function CreateThread() {
  const [titre, setTitre] = useState('');
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const [isAdminPrivate, setIsAdminPrivate] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/create-thread-admin') {
      setIsAdminPrivate(true);
    }
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auteur = localStorage.getItem('username');

    const res = await fetch('http://localhost:3000/api/forum/thread', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titre,
        auteur,
        description,
        message,
        ...(isAdminPrivate && { prive: true })
      }),
    });

    if (res.ok) {
      navigate(-1);
    } else {
      alert("Erreur création du sujet.");
    }
  };

  return (
    <div className="create-thread-container">
      <h2>{isAdminPrivate ? 'Créer un forum privé' : 'Créer un nouveau sujet'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titre du sujet"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
        />
        <textarea
          className="message-box"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
        />
        <textarea
          placeholder="Message principal"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={8}
          className="message-box"
          required
        />
        <button type="submit">Publier</button>
      </form>
    </div>
  );
}

export default CreateThread;