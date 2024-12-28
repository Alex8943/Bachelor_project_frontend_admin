import React, { useContext } from 'react';
import { Navigate, Outlet} from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = () => {
  const { authToken } = React.useContext(AuthContext); // Use authToken from context
  
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
      console.log("Redirecting to login...");
      navigate('/');
    }
  }, [navigate]);
  

  return <Outlet />; // Render child routes if authenticated
};

export default ProtectedRoute;
