import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../visual/homepage.css';
import backgroundImage from '../../assets/rdr2.png';
import BackgroundSlideshow from './BackgroundSlideshow';
import profileIcon from '../../assets/profile.png';
import parameterIcon from '../../assets/parameter.png';
import logoutIcon from '../../assets/logout.png';
import adminIcon from '../../assets/admin.png';
import rdr2Logo from '../../assets/rdr2.png';
import favIcon from '../../assets/fav.png';
import noFavIcon from '../../assets/no_fav.png';

function Homepage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], threads: [] });
  const [isAdmin, setIsAdmin] = useState(false);
  const [forums, setForums] = useState([]);

  const [favoris, setFavoris] = useState(() => {
    const saved = localStorage.getItem('favoris');
    return saved ? JSON.parse(saved) : [];
  });
  const toggleFavori = (threadId) => {
    const updated = favoris.includes(threadId)
      ? favoris.filter(id => id !== threadId)
      : [...favoris, threadId];
  
    setFavoris(updated);
    localStorage.setItem('favoris', JSON.stringify(updated));
  };

// ✅ Homepage.jsx
  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme === 'dark' ? 'dark-mode' : 'light-mode';

    fetch("http://localhost:3000/api/forum/threads")
      .then(res => res.json())
      .then(data => {
        const publicOnly = data.filter(thread => !thread.prive); // ✅ filtrer ici seulement public
        setForums(publicOnly);
      })
      .catch(err => console.error("Erreur chargement forums:", err));
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setSearchTriggered(true);
    setSubmittedQuery(query);

    try {
      const usersRes = await fetch(`http://localhost:3000/api/users/search?q=${query}`);
      const threadsRes = await fetch(`http://localhost:3000/api/forum/threads/search?q=${query}`);

      if (!usersRes.ok || !threadsRes.ok) throw new Error("Échec fetch");

      const users = await usersRes.json();
      const threads = await threadsRes.json();
      setSearchResults({ users, threads });
    } catch (err) {
      console.error("Erreur recherche:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleLogoClick = () => {
    setQuery('');
    setSubmittedQuery('');
    setSearchTriggered(false);
  };

  const goToForum = (id) => navigate(`/forum/${id}`);

  return (
    <div className="page-container">
      <header className="header-container">
        <BackgroundSlideshow />
        <div className="header-content">
          <div className="logo1" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <img src={rdr2Logo} alt="RDR2 Logo" />
          </div>
          <div className="search1 align-with-main">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Recherche..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>
          </div>
          <div className="login_register">
            <img src={profileIcon} alt="Profil" className="icon-button" onClick={() => navigate('/profile')} />
            <img src={parameterIcon} alt="Paramètres" className="icon-button" onClick={() => navigate('/parameter')} />
            {isAdmin && <img src={adminIcon} alt="Admin" className="icon-button" onClick={() => navigate('/admin')} />}
            <img src={logoutIcon} alt="Logout" className="icon-button" onClick={handleLogout} />
          </div>
        </div>
      </header>
  
      <div className="content-layout">
        <aside className="sidebar">
          <h2>Navigation</h2>
          <p>Bienvenue dans l'application !</p>
          <Link to="/dashboard">Dashboard</Link>
          {favoris.length > 0 && (
            <>
              <h3>⭐ Favoris</h3>
              <ul>
                {forums
                  .filter(f => favoris.includes(f._id))
                  .map(f => (
                    <li key={f._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/forum/${f._id}`)}>
                      {f.titre}
                    </li>
                  ))}
              </ul>
            </>
          )}
        </aside>
  
        <main className="main-content">
          {!searchTriggered ? (
            <>
              <h1>Bienvenue sur RDR2RP !</h1>
              <section className="forum-section">
                <h2>Forums récents</h2>
                <button onClick={() => navigate('/create-thread')} className="create-thread-btn">
                  Créer un nouveau sujet
                </button>
                <div className="forum-list">
                  {forums
                    .filter(forum => !forum.prive) // ✅ n'affiche que les forums publics
                    .map((forum) => (
                      <div
                        key={forum._id}
                        className="forum-post"
                        onClick={() => goToForum(forum._id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <h3>{forum.titre}</h3>
                        <p><strong>Auteur :</strong> {forum.auteur}</p>
                        <p><strong>Date :</strong> {new Date(forum.createdAt).toLocaleDateString()}</p>

                        <button onClick={(e) => {
                          e.stopPropagation();
                          toggleFavori(forum._id);
                        }}>
                          <img
                            src={favoris.includes(forum._id) ? favIcon : noFavIcon}
                            alt={favoris.includes(forum._id) ? 'Favori' : 'Non favori'}
                            style={{ width: '32px', height: '32px' }}
                          />
                        </button>
                      </div>
                    ))}
                </div>
              </section>
            </>
          ) : (
            <section className="forum-section">
              <h2>Résultats de recherche</h2>
              {submittedQuery.trim() === '' || (searchResults.users.length === 0 && searchResults.threads.length === 0) ? (
                <p>Aucun résultat trouvé pour « {submittedQuery} ».</p>
              ) : (
                <>
                  {searchResults.users.length > 0 && (
                    <>
                      <h3>Utilisateurs</h3>
                      <div className="forum-list">
                        {searchResults.users.map((u) => (
                          <div
                            key={u._id}
                            className="forum-post user-result"
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
                            key={t._id}
                            className="forum-post"
                            onClick={() => goToForum(t._id)}
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
    </div>
  );
}

export default Homepage;