import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken'); // Check if token exists

  if (!authToken) {
    return <Navigate to="/" />; // Redirect to login if not authenticated
  }

  return children; // Render the protected component if authenticated
};

export default ProtectedRoute;