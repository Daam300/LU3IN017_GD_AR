import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundSlideshow from './BackgroundSlideshow';
import '../visual/Register.css';

function SignupWaiting() {
  const navigate = useNavigate();

  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="register-container">
      <BackgroundSlideshow />
      <h2>Merci pour votre inscription, en attente de validation ...</h2>
      <form className="register-form">
        <div className="button-group">
          <button onClick={handleCancel}>Retour</button>
        </div>
      </form>
    </div>
  );
}

export default SignupWaiting;