import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { getOneUser } from '../../service/apiclient';

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
    return <Spinner size="xl" color="blue.500" />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box p={4} maxWidth="600px" mx="auto">
      <Heading as="h1" size="lg" mb={4} color="blue.600" textAlign="center">
        User Details
      </Heading>
      {user ? (
        <>
          <Text><strong>ID:</strong> {user.id}</Text>
          <Text><strong>Name:</strong> {user.name}</Text>
          <Text><strong>Last Name:</strong> {user.lastname}</Text>
          <Text><strong>Email:</strong> {user.email}</Text>
          <Text><strong>Role ID:</strong> {user.role_fk}</Text>
          <Text><strong>Created At:</strong> {new Date(user.createdAt).toLocaleDateString()}</Text>
          <Text><strong>Verified At:</strong> {user.verifiedAt ? new Date(user.verifiedAt).toLocaleDateString() : "Not Verified"}</Text>
          <Text><strong>Is Blocked:</strong> {user.isBlocked ? "Yes" : "No"}</Text>
          {/* Add more fields as needed */}
        </>
      ) : (
        <Text>No user data available.</Text>
      )}
    </Box>
  );
};

export default UserDetails;


