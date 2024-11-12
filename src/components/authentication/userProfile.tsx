import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Simulating a session check - replace with your actual authentication logic
        const isLoggedIn = sessionStorage.getItem('isLoggedIn'); // or use context/api if available
        
        if (!isLoggedIn) {
            navigate('/'); // Redirect to login page if not logged in
        }
    }, [navigate]);

    // Assuming that the user's profile information would be stored in state or context
    const user = {
        name: 'John Doe', // Replace with actual user data
        email: 'johndoe@example.com',
        // ...other profile details
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>User Profile</h1>
            <div>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                {/* Add other user details as necessary */}
            </div>
        </div>
    );
};

export default UserProfile;
