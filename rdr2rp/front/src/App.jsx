import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/code/Home';
import Login from './pages/code/Login';
import Register from './pages/code/Register';
import Homepage from './pages/code/homepage';
import SignupWaiting from './pages/code/signup_waiting';
import Parameter from './pages/code/parameter';
import Profile from './pages/code/Profile';

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
        <Route path="/profile" element={<Profile />} /> {/* Ajout de la route pour le profil */}
      </Routes>
    </Router>
  );
}

export default App;