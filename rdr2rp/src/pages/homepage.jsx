import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import de useNavigate
import './homepage.css';

function Homepage() {
  const navigate = useNavigate(); // Initialisation de navigate

  const handleLogout = () => {
    navigate('/'); // Redirection vers la page d'accueil
  };

  return (
    <div>
      {/* Header */}
      <header>
        <div className="logo1">
          <img src="logo.jpg" alt="un logo bien cool" />
        </div>

        <div className="search1">
          <form>
            <input id="search" type="text" placeholder="Recherche..." />
          </form>
        </div>

        <div className="login_register">
          <button onClick={handleLogout}>Se déconnecter</button>
        </div>
      </header>

      {/* Main content */}
      <main>
        <aside>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod lacus sed velit fringilla ullamcorper.
          </p>
        </aside>

        <div className="msg_area">
          <div className="Zone nouveau message">
            <form>
              <textarea
                name="Envoyer"
                rows="5"
                cols="30"
                placeholder="Écrire un nouveau message..."
              ></textarea>
              <button type="submit">Envoyer</button>
            </form>
          </div>

          <div className="Liste messages">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod lacus sed velit fringilla ullamcorper.
            </p>
            <p>29-01-2025</p>
            <p>xXx_Dark_Maxou69_xXx</p>
            <a href="reply.html">
              <button>Répondre</button>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Homepage;