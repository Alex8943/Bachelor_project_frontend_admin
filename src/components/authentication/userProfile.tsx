import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const navigate = useNavigate();

    const authToken = sessionStorage.getItem('authToken'); // or localStorage.getItem('authToken')
    if (!authToken) {
      navigate('/'); // Redirect to login page if token is missing
    }

  

    return (
        <div style={{ padding: '20px' }}>
            <h1>User Profile</h1>
            <div>
                
                <p>Access granted</p>
                
            </div>
        </div>
    );
};

export default UserProfile;
