import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../service/apiclient';

const Role = ({ email, password }) => {
    const [userRole, setUserRole] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await login({ email, password });
                const role_fk = response.user.role_fk; // Assuming 'role_fk' is the field for the role ID
                setUserRole(role_fk);
            } catch (error) {
                setMessage("Login failed. Please check your credentials.");
                console.error("Login error:", error);
                navigate('/'); // Redirect to login if there's an error
            }
        };

        fetchUserRole();
    }, [email, password, navigate]);

    return (
        <div>
            {userRole ? (
                <p>User Role: {userRole}</p> // Display the user's role
            ) : (
                <p>{message}</p> // Display a message if there's an error
            )}
        </div>
    );
};

export default Role;
