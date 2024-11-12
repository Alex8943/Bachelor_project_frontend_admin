import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Statistics = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        
        const userRole = localStorage.getItem('userRole');
        
        if (userRole === '2') {
          console.log("Admins can't access this page");
          navigate('/dashboard'); // Redirect to another page
        } else if (userRole === '1') {
          setMessage('Access granted to Statistics!');
          
        } else {
    
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
      <h1>Statistics</h1>
      <p>{message}</p>
     
    </div>
  );
};

export default Statistics;
