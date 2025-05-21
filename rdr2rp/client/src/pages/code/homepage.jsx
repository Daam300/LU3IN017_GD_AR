import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../visual/homepage.css'; // Mise à jour du chemin vers le CSS
import backgroundImage from '../../assets/rdr2.png';
import BackgroundSlideshow from './BackgroundSlideshow';
import profileIcon from '../../assets/profile.png';
import parameterIcon from '../../assets/parameter.png';
import logoutIcon from '../../assets/logout.png';
import adminIcon from '../../assets/admin.png'; 



function Homepage() {
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme === 'dark' ? 'dark-mode' : 'light-mode';

    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
  }, []);

  const handleLogout = () => {
    navigate('/');
  };
  const [forums, setForums] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
  
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme === 'dark' ? 'dark-mode' : 'light-mode';
  
    fetch("http://localhost:3000/api/forum/threads")
      .then(res => res.json())
      .then(data => setForums(data))
      .catch(err => console.error("Erreur de chargement des forums", err));
  }, []);

  const goToForum = (forumId) => {
    navigate(`/forum/${forumId}`);
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
              onClick={() => navigate('/profile')}
            />
            <img
              src={parameterIcon}
              alt="Paramètres"
              className="icon-button"
              onClick={() => navigate('/parameter')}
            />
            {isAdmin && (
              <img
                src={adminIcon}
                alt="Admin"
                className="icon-button"
                onClick={() => navigate('/admin')}
                title="Admin Panel"
              />
            )}
            <img
              src={logoutIcon}
              alt="Se déconnecter"
              className="icon-button"
              onClick={handleLogout}
            />
          </div>
        </div>
      </header>

      <aside className="sidebar">
        <h2>Navigation</h2>
        <p>Bienvenue dans l'application !</p>
        <p>Utilisez les liens ci-dessous pour naviguer :</p>
        <Link to="/dashboard">Dashboard</Link>
      </aside>

      <main className="main-content">
        <h1>Bienvenue sur RDR2RP !</h1>

        {/* Section Forum */}
        <section className="forum-section">
          <h2>Forums récents</h2>
          <button onClick={() => navigate('/create-thread')} className="create-thread-btn">
            Créer un nouveau sujet
          </button>
          <div className="forum-list">
          {forums.map((forum) => (
            <div
              className="forum-post"
              key={forum._id}
              onClick={() => goToForum(forum._id)}
              style={{ cursor: 'pointer' }}
            >
              <h3>{forum.titre}</h3>
              <p><strong>Auteur :</strong> {forum.auteur}</p>
              <p><strong>Date :</strong> {new Date(forum.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
        </section>
      </main>
    </div>
  );
}

export default Homepage;