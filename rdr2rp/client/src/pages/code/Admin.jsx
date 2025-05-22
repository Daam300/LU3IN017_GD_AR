import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import returnIcon from '../../assets/return.png';
import '../visual/Admin.css'; // Import du fichier CSS

function Admin() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [threads, setThreads] = useState([]);
  const navigate = useNavigate();

  const fetchThreads = async () => {
    const res = await fetch('http://localhost:3000/api/forum/threads');
    const data = await res.json();
    setThreads(data);
  };

  useEffect(() => {
    fetchPendingUsers();
    fetchApprovedUsers();
    fetchThreads();
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    setCurrentUser(username);
  }, []);

  const fetchPendingUsers = async () => {
    const res = await fetch('http://localhost:3000/api/users/pending');
    const data = await res.json();
    setPendingUsers(data);
  };
  const deleteThread = async (threadId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/api/forum/thread/${threadId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  
    if (res.ok) {
      fetchThreads(); // rafraîchir la liste
    } else {
      alert("Erreur lors de la suppression du thread.");
    }
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

  const toggleAdmin = async (id, currentRole) => {
    await fetch(`http://localhost:3000/api/users/toggleAdmin/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    fetchApprovedUsers();
  };

  return (
    <div className="admin-container">
      <img
        src={returnIcon}
        alt="Retour"
        onClick={() => navigate('/homepage')}
        className="return-icon"
      />
      <div className="admin-content">
        {/* Utilisateurs en attente */}
        <div className="pending-users">
          <h2>Inscriptions en attente</h2>
          {pendingUsers.map(user => (
            <div key={user._id} className="user-card">
              <strong>{user.username}</strong> ({user.email})<br />
              <em>{user.bio}</em><br />
              <button onClick={() => updateStatus(user._id, 'approve')} className="approve-button">✅ Accepter</button>
              <button onClick={() => updateStatus(user._id, 'refuse')} className="refuse-button">❌ Refuser</button>
            </div>
          ))}
        </div>

        {/* Utilisateurs approuvés */}
        <div className="approved-users">
          <h2>Utilisateurs actifs</h2>
          {approvedUsers.map(user => (
            <div key={user._id} className="user-card">
              <strong>{user.username}</strong> ({user.role})<br />
              {user.username !== currentUser && (
                <button onClick={() => toggleAdmin(user._id, user.role)} className="toggle-admin-button">
                  {user.role === 'admin' ? 'Retirer admin' : 'Rendre admin'}
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="forum-admin">
          <h2>Gestion des forums</h2>
          {threads.map(thread => (
            <div key={thread._id} className="user-card">
              <strong>{thread.titre}</strong> — {thread.auteur}<br />
              <button onClick={() => deleteThread(thread._id)} className="refuse-button">
                🗑 Supprimer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;