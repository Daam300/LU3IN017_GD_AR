import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/code/Home';
import Login from './pages/code/Login';
import Register from './pages/code/Register';
import Homepage from './pages/code/homepage';
import SignupWaiting from './pages/code/signup_waiting';
import Parameter from './pages/code/parameter';
import Profile from './pages/code/Profile';
import Admin from './pages/code/Admin';
import Forum from './pages/code/forum';
import CreateThread from './pages/code/CreateThread';
import UserProfile from './pages/code/UserProfile';

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
        <Route path="/admin" element={<Admin />} /> {/* Ajout de la route pour l'administration */}
        <Route path="/forum/:forumId" element={<Forum />} /> {/* Route pour le forum avec un paramètre d'ID */}
        <Route path="/create-thread" element={<CreateThread />} />
        <Route path="/create-thread-admin" element={<CreateThread />} />
        <Route path="/thread/:forumId" element={<Forum />} />
        <Route path="/user/:username" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;