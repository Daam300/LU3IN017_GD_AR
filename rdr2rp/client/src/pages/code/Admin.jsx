import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import returnIcon from '../../assets/return.png';
function Admin() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // optionnel pour bloquer sa propre édition
  const navigate = useNavigate();
  useEffect(() => {
    fetchPendingUsers();
    fetchApprovedUsers();
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username"); // stocké au login
    setCurrentUser(username);
  }, []);

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
      body: JSON.stringify({ action }) // 'approve' ou 'refuse'
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
    <div>
      <img
        src={returnIcon}
        alt="Retour"
        onClick={() => navigate('/homepage')}
        style={{
          width: '30px',
          height: '30px',
          cursor: 'pointer',
          marginBottom: '1rem'
        }}
      />
      <div style={{ display: 'flex', padding: '2rem', gap: '2rem' }}>
        {/* Utilisateurs en attente */}
        <div style={{ flex: 1 }}>
          <h2>Inscriptions en attente</h2>
          {pendingUsers.map(user => (
            <div key={user._id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
              <strong>{user.username}</strong> ({user.email})<br />
              <button onClick={() => updateStatus(user._id, 'approve')}>✅ Accepter</button>
              <button onClick={() => updateStatus(user._id, 'refuse')}>❌ Refuser</button>
            </div>
          ))}
        </div>
  
        {/* Utilisateurs approuvés */}
        <div style={{ flex: 1 }}>
          <h2>Utilisateurs actifs</h2>
          {approvedUsers.map(user => (
            <div key={user._id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
              <strong>{user.username}</strong> ({user.role})<br />
              {user.username !== currentUser && (
                <button onClick={() => toggleAdmin(user._id, user.role)}>
                  {user.role === 'admin' ? 'Retirer admin' : 'Rendre admin'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Admin;