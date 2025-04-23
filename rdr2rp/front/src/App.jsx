import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/homepage';
import SignupWaiting from './pages/signup_waiting';
import Parameter from './pages/parameter'; // Import du composant Parameter

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/signup_waiting" element={<SignupWaiting />} />
        <Route path="/parameter" element={<Parameter />} /> {/* Ajout de la route */}
      </Routes>
    </Router>
  );
}

export default App;