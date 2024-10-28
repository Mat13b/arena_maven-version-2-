import React, { createContext, useState } from 'react';
import axios from 'axios';
export const AuthContext = createContext();
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';




const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (userData) => {
    if (userData && userData.id) {
      try {
        setUser(userData);
        setIsAuthenticated(true);
        console.log('Utilisateur connecté:', userData);
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
      }
    }
  };

  const isLog = (token) => {
    if (!token) {
      return false;
    }
  
    try {
      const decoded = jwtDecode(token);
  
      // Check if the token is expired
      if (decoded.exp * 1000 < Date.now()) {
        return false;
      }

      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  }


  const logout = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        console.log('Déconnexion réussie');
      } catch (error) {
        console.error('La déconnexion a échoué côté serveur');
      }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated,
        isLog 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
