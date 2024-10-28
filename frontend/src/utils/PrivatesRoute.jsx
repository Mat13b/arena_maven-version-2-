import { Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../components/Account/Login/AuthProvider';

const PrivateRoutes = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const token = localStorage.getItem('token');
    
    return (isAuthenticated && token) ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoutes;
