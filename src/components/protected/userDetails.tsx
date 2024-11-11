import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, Spinner, Alert, AlertIcon, VStack } from '@chakra-ui/react';
import { getOneUser } from '../../service/apiclient';
import Sidebar from './sidebar';

const UserDetails = () => {
  const { id } = useParams(); // Get user ID from URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getOneUser({ id });
        setUser(userData);
        setLoading(false);
      } catch (error) {
        setError('Failed to load user details');
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert status="error" maxW="400px" boxShadow="md" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center" p={4}>
      <Box width="100%" maxW="500px" p={8} boxShadow="md" borderRadius="md" bg="white" marginRight="345px">
        <Heading as="h1" size="lg" mb={6} color="blue.600" textAlign="center">
          User Details
        </Heading>
        <Sidebar />
        {user ? (
          <VStack align="start" spacing={4}>
            <Text><strong>ID:</strong> {user.id}</Text>
            <Text><strong>Name:</strong> {user.name}</Text>
            <Text><strong>Last Name:</strong> {user.lastname}</Text>
            <Text><strong>Email:</strong> {user.email}</Text>
            <Text><strong>Role ID:</strong> {user.role_fk}</Text>
            <Text><strong>Created At:</strong> {new Date(user.createdAt).toLocaleDateString()}</Text>
            <Text><strong>Verified At:</strong> {user.verifiedAt ? new Date(user.verifiedAt).toLocaleDateString() : "Not Verified"}</Text>
            <Text><strong>Is Blocked:</strong> {user.isBlocked ? "Yes" : "No"}</Text>
          </VStack>
        ) : (
          <Text>No user data available.</Text>
        )}
      </Box>
    </Box>
  );
};

export default UserDetails;