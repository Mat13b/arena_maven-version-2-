import React, { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    isAuthenticated && (
      <button
        onClick={handleLogout}
        className="text-red-500" // Assurez-vous que cette classe est bien appliquée
      >
        Déconnexion
      </button>
    )
  );
}

export default Logout;
