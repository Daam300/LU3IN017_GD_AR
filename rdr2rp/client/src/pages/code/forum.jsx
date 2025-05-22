import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../visual/forum.css';
import BackgroundSlideshow from './BackgroundSlideshow';
import backgroundImage from '../../assets/rdr2.png';
import profileIcon from '../../assets/profile.png';
import parameterIcon from '../../assets/parameter.png';
import logoutIcon from '../../assets/logout.png';
import adminIcon from '../../assets/admin.png';

function Forum() {
  const { forumId } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [replyBoxVisible, setReplyBoxVisible] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`http://localhost:3000/api/forum/thread/${forumId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Accès refusé");
        return res.json();
      })
      .then(setThread)
      .catch(err => {
        alert("Accès interdit ou erreur de chargement.");
        navigate("/homepage");
      });
  }, [forumId]);

  useEffect(() => {
    const hash = window.location.hash.substring(1); // récupère l’ID
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [thread]); 

  const sendReply = async () => {
    const auteur = localStorage.getItem('username');
    const contenu = replyTo
      ? `> [${replyTo.auteur} - ${new Date(replyTo.timestamp).toLocaleString()}] ${replyTo.contenu}\n\n${replyContent}`
      : replyContent;

    await fetch(`http://localhost:3000/api/forum/thread/${forumId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auteur, contenu })
    });

    const updated = await fetch(`http://localhost:3000/api/forum/thread/${forumId}`);
    const data = await updated.json();
    setThread(data);
    setReplyBoxVisible(false);
    setReplyContent('');
    setReplyTo(null);
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm("Supprimer ce message ?")) return;

    await fetch(`http://localhost:3000/api/forum/thread/${forumId}/message/${messageId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    const res = await fetch(`http://localhost:3000/api/forum/thread/${forumId}`);
    const data = await res.json();
    setThread(data);
  };
  const toggleLike = async (messageId) => {
    await fetch(`http://localhost:3000/api/forum/thread/${forumId}/message/${messageId}/like`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });
  
    const res = await fetch(`http://localhost:3000/api/forum/thread/${forumId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const updated = await res.json();
    setThread(updated);
  };

  return (
    <div className="page-container">
      <header className="header-container">
        <BackgroundSlideshow />
        <div className="header-content">
          <div className="logo1" onClick={() => navigate('/homepage')} style={{ cursor: 'pointer' }}>
            <img src={backgroundImage} alt="RDR2" />
          </div>
          <div className="search1"><form><input type="text" placeholder="Recherche..." /></form></div>
          <div className="login_register">
            <img src={profileIcon} alt="Profil" className="icon-button" onClick={() => navigate('/profile')} />
            <img src={parameterIcon} alt="Paramètres" className="icon-button" onClick={() => navigate('/parameter')} />
            {localStorage.getItem("role") === "admin" && (
              <img src={adminIcon} alt="Admin" className="icon-button" onClick={() => navigate('/admin')} />
            )}
            <img src={logoutIcon} alt="Logout" className="icon-button" onClick={() => navigate('/')} />
          </div>
        </div>
      </header>

      <main className="main-content">
        {thread ? (
          <>
            <h1>{thread.titre}</h1>
            <p><strong>Auteur :</strong> {thread.auteur}</p>
            <div className="messages">
            {thread.messages.map((msg) => (
              <div key={msg._id} id={msg._id} className={`message-box ${msg.contenu.trim().startsWith('>') ? 'reply' : ''}`}>
                <div className="message-header">
                  <strong onClick={() => navigate(`/user/${msg.auteur}`)}>{msg.auteur}</strong>
                  <span className="timestamp">{new Date(msg.timestamp).toLocaleString()}</span>
                </div>
                <div className="message-content">{msg.contenu}</div>
                <div className="message-actions">
                  <button onClick={() => { setReplyBoxVisible(true); setReplyTo(msg); }}>💬 Répondre</button>
                  <button onClick={() => toggleLike(msg._id)}>
                    {msg.likes?.includes(localStorage.getItem("userId")) ? '❤️' : '🤍'} {msg.likes?.length || 0}
                  </button>
                  {localStorage.getItem("role") === "admin" && (
                    <button className="delete-button" onClick={() => deleteMessage(msg._id)}>🗑 Supprimer</button>
                  )}
                </div>
              </div>
            ))}
            </div>
            <button onClick={() => { setReplyBoxVisible(true); setReplyTo(null); }}>📝 Répondre au thread</button>
            {replyBoxVisible && (
              <div className="reply-box">
                {replyTo && (
                  <div className="reply-to-quote">
                    <em>En réponse à :</em>
                    <div className="quoted-text">"{replyTo.contenu}"</div>
                  </div>
                )}
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Votre réponse..."
                  rows={5}
                />
                <button onClick={sendReply}>Envoyer</button>
              </div>
            )}
          </>
        ) : <p>Chargement...</p>}
      </main>
    </div>
  );
}

export default Forum;