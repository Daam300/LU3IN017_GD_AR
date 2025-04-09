import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundSlideshow from '../BackgroundSlideshow'; // Assure-toi que le chemin est correct
import './Register.css';

function Register() {
  const navigate = useNavigate();

  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/'); // Redirection vers la page d'accueil
  };

  return (
    <div className="register-container">
      <BackgroundSlideshow /> {/* Ajoute le fond dynamique */}
      <h2>Merci pour votre inscription, en attente de validation ...</h2>
      <form className="register-form">

        <div className="button-group">
          <button onClick={handleCancel}>Retour</button>
        </div>
      </form>
    </div>
  );
}

export default Register;