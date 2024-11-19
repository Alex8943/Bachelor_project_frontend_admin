import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Heading, Text, VStack, Flex } from '@chakra-ui/react';

const UserProfile = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userRoleName, setUserRoleName] = useState(''); // Track role name
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authToken = sessionStorage.getItem('authToken');
        const storedName = sessionStorage.getItem('userName');
        const storedEmail = sessionStorage.getItem('userEmail');
        const storedRoleName = sessionStorage.getItem('userRoleName'); // Get role name from storage
        

        if (!authToken) {
            navigate('/'); // Redirect to login if no auth token
            return;
        }

        setUserName(storedName);
        setUserEmail(storedEmail);
        setUserRoleName(storedRoleName); // Set role name
        setLoading(false);
    }, [navigate]);

    const handleSignOut = () => {
        sessionStorage.clear(); // Clear session storage
        navigate('/'); // Redirect to login page
    };

    if (loading) {
        return (
            <Flex minHeight="100vh" justifyContent="center" alignItems="center">
                <Text>Loading...</Text>
            </Flex>
        );
    }

    return (
        <Flex minHeight="100vh" p={4} justifyContent="center" alignItems="center" gap={12}>
            <Box width="100%" maxW="500px" p={8} boxShadow="md" borderRadius="md" bg="white">
                <Heading as="h1" size="lg" mb={6} color="blue.600" textAlign="center">
                    User Profile
                </Heading>
                <VStack spacing={4} align="stretch">
                    <Text fontSize="lg">
                        <strong>Name:</strong> {userName}
                    </Text>
                    <Text fontSize="lg">
                        <strong>Email:</strong> {userEmail}
                    </Text>
                    <Text fontSize="lg">
                        <strong>Role:</strong> {userRoleName || "Unknown"}
                    </Text>
                    <Button colorScheme="blue" onClick={handleSignOut}>
                        Sign Out
                    </Button>
                </VStack>
            </Box>
        </Flex>
    );
};

export default UserProfile;
