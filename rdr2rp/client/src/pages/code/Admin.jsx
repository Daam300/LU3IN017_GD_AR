// ✅ /client/src/pages/code/Admin.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import returnIcon from '../../assets/return.png';
import '../visual/Admin.css';

function Admin() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [threads, setThreads] = useState([]);
  const [privateForums, setPrivateForums] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingUsers();
    fetchApprovedUsers();
    fetchThreads();
    const username = localStorage.getItem("username");
    setCurrentUser(username);
  }, []);

  const fetchThreads = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/forum/threads');
      const all = await res.json();
      setThreads(all.filter(t => !t.prive));

      const resPv = await fetch('http://localhost:3000/api/forum/threads/admin');
      const priv = await resPv.json();
      setPrivateForums(priv);
    } catch (err) {
      console.error("Erreur chargement threads:", err);
    }
  };

  const fetchPendingUsers = async () => {
    const res = await fetch('http://localhost:3000/api/users/pending');
    const data = await res.json();
    setPendingUsers(data);
  };

  const fetchApprovedUsers = async () => {
    const res = await fetch('http://localhost:3000/api/users/approved');
    const data = await res.json();
    setApprovedUsers(data);
  };

  const updateStatus = async (id, action) => {
    await fetch(`http://localhost:3000/api/users/validate/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    fetchPendingUsers();
  };

  const toggleAdmin = async (id) => {
    await fetch(`http://localhost:3000/api/users/toggleAdmin/${id}`, { method: 'POST' });
    fetchApprovedUsers();
  };

  const deleteThread = async (threadId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/api/forum/thread/${threadId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) fetchThreads();
    else alert("Erreur suppression thread");
  };

  return (
    <div className="admin-container">
      <img src={returnIcon} onClick={() => navigate('/homepage')} className="return-icon" />
      <div className="admin-content">
        <div className="pending-users">
          <h2>Inscriptions en attente</h2>
          {pendingUsers.map(u => (
            <div key={u._id} className="user-card">
              <strong>{u.username}</strong> ({u.email})<br />
              <em>{u.bio}</em><br />
              <button onClick={() => updateStatus(u._id, 'approve')} className="approve-button">✅</button>
              <button onClick={() => updateStatus(u._id, 'refuse')} className="refuse-button">❌</button>
            </div>
          ))}
        </div>

        <div className="approved-users">
          <h2>Utilisateurs actifs</h2>
          {approvedUsers.map(u => (
            <div key={u._id} className="user-card">
              <strong>{u.username}</strong> ({u.role})<br />
              {u.username !== currentUser && (
                <button onClick={() => toggleAdmin(u._id)} className="toggle-admin-button">
                  {u.role === 'admin' ? 'Retirer admin' : 'Rendre admin'}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="forum-admin">
          <h2>Forums publics</h2>
          {threads.map(t => (
            <div key={t._id} className="user-card">
              <strong>{t.titre}</strong> — {t.auteur}<br />
              <button onClick={() => deleteThread(t._id)} className="refuse-button">🗑 Supprimer</button>
            </div>
          ))}

          <hr />

          <h2>Forums privés (admin seulement)</h2>
          <button onClick={() => navigate('/create-thread-admin')} className="approve-button">➕ Créer</button>
          {privateForums.map(f => (
            <div key={f._id} className="user-card">
              <strong>{f.titre}</strong> — {f.auteur}<br />
              <button onClick={() => navigate(`/forum/${f._id}`)}>Accéder</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;