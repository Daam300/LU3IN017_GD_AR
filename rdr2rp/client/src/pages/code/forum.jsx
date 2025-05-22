import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../visual/forum.css';
import BackgroundSlideshow from './BackgroundSlideshow';
import backgroundImage from '../../assets/rdr2.png';
import profileIcon from '../../assets/profile.png';
import parameterIcon from '../../assets/parameter.png';
import logoutIcon from '../../assets/logout.png';
import adminIcon from '../../assets/admin.png'; // Import de l'icône admin
function Forum() {
  const { forumId } = useParams();
  const [thread, setThread] = useState(null);
  const [replyBoxVisible, setReplyBoxVisible] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/forum/thread/${forumId}`)
      .then(res => res.json())
      .then(data => setThread(data))
      .catch(err => console.error('Erreur de chargement du thread:', err));
  }, [forumId]);

  const sendReply = async () => {
    const auteur = localStorage.getItem('username');
    const contenu = replyTo
  ? `> [${replyTo.auteur} - ${new Date(replyTo.timestamp).toLocaleString()}] ${replyTo.contenu}\n\n${replyContent}`
  : replyContent;

    const res = await fetch(`http://localhost:3000/api/forum/thread/${forumId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auteur, contenu })
    });

    if (res.ok) {
      const updated = await fetch(`http://localhost:3000/api/forum/thread/${forumId}`);
      const data = await updated.json();
      setThread(data);
      setReplyBoxVisible(false);
      setReplyContent('');
      setReplyTo(null);
    }
  };
  const deleteMessage = async (messageId) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
  
    await fetch(`http://localhost:3000/api/forum/thread/${forumId}/message/${messageId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  
    const res = await fetch(`http://localhost:3000/api/forum/thread/${forumId}`);
    const data = await res.json();
    setThread(data);
  };

  return (
    <div className="page-container">
      <header className="header-container">
        <BackgroundSlideshow />
        <div className="header-content">
          <div className="logo1">
            <img src={backgroundImage} alt="Red Dead Redemption 2" />
          </div>
          <div className="search1">
            <form>
              <input id="search" type="text" placeholder="Recherche..." />
            </form>
          </div>
          <div className="login_register">
            <img
              src={profileIcon}
              alt="Profil"
              className="icon-button"
              onClick={() => window.location.href = '/profile'}
            />
            <img
              src={parameterIcon}
              alt="Paramètres"
              className="icon-button"
              onClick={() => window.location.href = '/parameter'}
            />
            {localStorage.getItem("role") === "admin" && (
              <img
                src={adminIcon}
                alt="Admin"
                className="icon-button"
                onClick={() => window.location.href = '/admin'}
                title="Admin Panel"
              />
            )}
            <img
              src={logoutIcon}
              alt="Déconnexion"
              className="icon-button"
              onClick={() => window.location.href = '/'}
            />
          </div>
        </div>
      </header>
  
      <main className="main-content">
        {thread ? (
          <>
            <h1>{thread.titre}</h1>
            <p><strong>Auteur :</strong> {thread.auteur}</p>
            <div className="messages">
              {thread.messages.map((msg, i) => (
                <div key={i} className={`message-box ${msg.contenu.trim().startsWith('>') ? 'reply' : ''}`}>
                  <div className="message-header">
                    <strong
                      className="author"
                      style={{ cursor: 'pointer', color: '#c2955b' }}
                      onClick={() => window.location.href = `/user/${msg.auteur}`}
                    >
                      {msg.auteur}
                    </strong>
                    <span className="timestamp">{new Date(msg.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="message-content">{msg.contenu}</div>
                  <div className="message-actions">
                    <button onClick={() => {
                      setReplyBoxVisible(true);
                      setReplyTo(msg);
                    }}>💬 Répondre</button>

                    {localStorage.getItem('role') === 'admin' && (
                      <button className="delete-button" onClick={() => deleteMessage(msg._id)}>
                        🗑 Supprimer
                      </button>
                    )}
                  </div>
                </div>
                
              ))}
            </div>
  
            <button onClick={() => {
              setReplyBoxVisible(true);
              setReplyTo(null);
            }}>📝 Répondre au thread</button>
  
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
        ) : (
          <p>Chargement...</p>
        )}
      </main>
    </div>
  );
}

export default Forum;