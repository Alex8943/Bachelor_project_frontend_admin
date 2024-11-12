import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const navigate = useNavigate();

    useEffect(() => {
        
        const isLoggedIn = sessionStorage.getItem('isLoggedIn'); 
        
        if (!isLoggedIn) {
            navigate('/'); 
        }
    }, [navigate]);

  

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
