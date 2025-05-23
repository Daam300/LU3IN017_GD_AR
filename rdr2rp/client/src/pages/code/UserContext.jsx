import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch("http://localhost:3000/api/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProfilePic(data.profilePic || null);
      });
  }, []);

  return (
    <UserContext.Provider value={{ profilePic, setProfilePic }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);