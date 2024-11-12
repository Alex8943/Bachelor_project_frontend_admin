import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Heading, Text, VStack, HStack, Flex } from '@chakra-ui/react';



const UserProfile = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const authToken = sessionStorage.getItem('authToken');
        const userRole = sessionStorage.getItem('userRole');

        // Redirect to login if no auth token
        if (!authToken) {
            navigate('/');
        } else {
            // Mock user information - replace with actual user data retrieval if needed
            setUserInfo({
                name: 'John Doe',
                email: 'johndoe@example.com',
                role: userRole === '1' ? 'Super Admin' : 'User',
            });
        }
    }, [navigate]);

    const handleSignOut = () => {
        sessionStorage.clear(); // Clear session storage (or localStorage if used)
        navigate('/'); // Redirect to login page
    };

    return (
            <Flex minHeight="100vh" p={4} justifyContent="center" alignItems="center" gap={12}>
                {/* User Details Box */}
                <Box width="100%" maxW="500px" p={8} boxShadow="md" borderRadius="md" bg="white" marginRight="280px">
                <Heading as="h1" size="lg" mb={6} color="blue.600" textAlign="center">
                </Heading>
              
                    <Heading as="h1" size="lg" mb={6} color="blue.600">
                        User Profile
                    </Heading>
                    {userInfo && (
                        <VStack spacing={4} align="stretch">
                            <Text fontSize="lg">
                                <strong>Name:</strong> {userInfo.name}
                            </Text>
                            <Text fontSize="lg">
                                <strong>Email:</strong> {userInfo.email}
                            </Text>
                            <Text fontSize="lg">
                                <strong>Role:</strong> {userInfo.role}
                            </Text>
                            <Button colorScheme="blue" onClick={handleSignOut}>
                                Sign Out
                            </Button>
                        </VStack>
                    )}
                </Box>
       
    </Flex>
    );
}    

export default UserProfile;
