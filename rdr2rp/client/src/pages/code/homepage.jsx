import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../visual/homepage.css'; // Mise à jour du chemin vers le CSS
import backgroundImage from '../../assets/rdr2.png';
import BackgroundSlideshow from './BackgroundSlideshow';
import profileIcon from '../../assets/profile.png';
import parameterIcon from '../../assets/parameter.png';
import logoutIcon from '../../assets/logout.png';
import adminIcon from '../../assets/admin.png'; 
import Search from './Search';
import rdr2Logo from '../../assets/rdr2.png';


function Homepage() {
  const navigate = useNavigate();
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [query, setQuery] = useState('');
  const [searchLaunched, setSearchLaunched] = useState(false);
  const [searchResults, setSearchResults] = useState({ users: [], threads: [] });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme === 'dark' ? 'dark-mode' : 'light-mode';

    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setSubmittedQuery(query); // ✅ ici on stocke le texte au moment d'entrée
    try {
      const usersRes = await fetch(`http://localhost:3000/api/users/search?q=${query}`);
      const threadsRes = await fetch(`http://localhost:3000/api/forum/threads/search?q=${query}`);
  
      if (!usersRes.ok || !threadsRes.ok) throw new Error("Échec de récupération des résultats");
  
      const usersData = await usersRes.json();
      const threadsData = await threadsRes.json();
      setSearchResults({ users: usersData, threads: threadsData });
      setSearchLaunched(true);
      setSearchTriggered(true);
    } catch (err) {
      console.error("Erreur recherche :", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear(); 
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

  const handleLogoClick = () => {
    setQuery('');
    setSearchLaunched(false);
    setSearchTriggered(false);
  };


  return (
    <div className="page-container">
      <header className="header-container">
        <BackgroundSlideshow />
        <div className="header-content">
        <div className="logo1" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={rdr2Logo} alt="Red Dead Redemption 2" />
        </div>
  
          <div className="search1">
            <form onSubmit={handleSearchSubmit}>
              <input
                id="search"
                type="text"
                placeholder="Recherche..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
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
        {!searchLaunched ? (
          <>
            <h1>Bienvenue sur RDR2RP !</h1>
            <section className="forum-section">
              <h2>Forums récents</h2>
              <button
                onClick={() => navigate('/create-thread')}
                className="create-thread-btn"
              >
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
          </>
        ) : (
          <section className="forum-section">
            <h2>Résultats de recherche</h2>
            {searchTriggered && (submittedQuery.trim() === '' || (searchResults.users.length === 0 && searchResults.threads.length === 0)) ? (
              <p>Aucun résultat trouvé pour « {submittedQuery} ».</p>
            ) : (
              <>
                {searchResults.users.length > 0 && (
                  <>
                    <h3>Utilisateurs</h3>
                    <div className="forum-list">
                      {searchResults.users.map((u) => (
                        <div
                          className="forum-post user-result"
                          key={u._id}
                          onClick={() => navigate(`/user/${u.username}`)}
                        >
                          <img src={u.profilePic} alt={u.username} className="profile-pic-circle" />
                          <p>{u.username}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {searchResults.threads.length > 0 && (
                  <>
                    <h3>Threads</h3>
                    <div className="forum-list">
                      {searchResults.threads.map((t) => (
                        <div
                          className="forum-post"
                          key={t._id}
                          onClick={() => navigate(`/forum/${t._id}`)}
                        >
                          <h3>{t.titre}</h3>
                          <p><strong>Auteur :</strong> {t.auteur}</p>
                          <p><strong>Date :</strong> {new Date(t.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default Homepage;