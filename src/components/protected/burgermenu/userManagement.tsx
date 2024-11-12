import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      const authToken = sessionStorage.getItem('authToken'); // or localStorage.getItem('authToken')
        if (!authToken) {
          navigate('/'); // Redirect to login page if token is missing
        }
      try {
        
        const userRole = localStorage.getItem('userRole');
        
        if (userRole === '2') {
          setMessage("Access denied: Admins can't access this page");
          console.log("Admins can't access this page");
          navigate('/dashboard'); // Redirect to another page
        } else if (userRole === '1') {
          setMessage('Access granted to User management!');
          
        } else {
          setMessage('Access denied: Unrecognized role');
          console.log("Unrecognized role:", userRole);
          navigate('/dashboard');
        }
      } catch (error) {
        setMessage('Failed to verify access.');
        console.error('Access check error:', error);
      }
    };

    checkAccess(); // Run the access check on component mount
  }, [navigate]); // Add navigate as a dependency

  return (
    <div>
      <h1>UserManagement</h1>
      <p>{message}</p>
     
    </div>
  );
};

export default UserManagement;
