import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid,
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  Flex,
  GridItem,
} from '@chakra-ui/react';
import { getOneUser, getAllReviewsByUser } from '../../../service/apiclient';
import Sidebar from '../burgermenu/Sidebar';

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState(null);
  const [errorReviews, setErrorReviews] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
      navigate('/');
    }

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

    const fetchUserReviews = async () => {
      try {
        const userReviews = await getAllReviewsByUser(id);
        setReviews(userReviews);
        setLoadingReviews(false);
      } catch (error) {
        setErrorReviews('Failed to load user reviews');
        setLoadingReviews(false);
      }
    };

    fetchUser();
    fetchUserReviews();
  }, [id]);

  if (loading) {
      return (
        <Box
          minHeight="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bg="white"
          width="100vw"
        >
          <Spinner size="xl" color="blue.500" />
        </Box>
      );
    }
    
    if (error) {
      return (
        <Box
          minHeight="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bg="white"
          width="100vw"
        >
          <Alert status="error" maxW="400px" boxShadow="md" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        </Box>
      );
    }

  return (
    <Grid
      minHeight="100vh"
      templateColumns="1fr"
      alignItems="center"
      justifyContent="center"
      bg="white"
      color="gray.800"
      width="100vw"
      pt={12}
    >
      <Box
        width="100%"
        maxW="1200px"
        p={8}
        boxShadow="lg"
        borderRadius="md"
        bg="white"
        textAlign="center"
        margin="0 auto"
      >
        <Heading as="h1" size="lg" mb={6} color="blue.500">
          User Details
        </Heading>
        <Sidebar />
        <Box mb={8}>
          {user ? (
            <VStack align="start" spacing={4}>
              <Text><strong>ID:</strong> {user.id}</Text>
              <Text><strong>Name:</strong> {user.name}</Text>
              <Text><strong>Last Name:</strong> {user.lastname}</Text>
              <Text><strong>Email:</strong> {user.email}</Text>
              <Text><strong>Role:</strong> {user.role_fk}</Text>
              <Text><strong>Created At:</strong> {new Date(user.createdAt).toLocaleDateString()}</Text>
              <Text>
                <strong>Verified At:</strong>{' '}
                {user.verifiedAt ? new Date(user.verifiedAt).toLocaleDateString() : 'Not Verified'}
              </Text>
              <Text><strong>Is Blocked:</strong> {user.isBlocked ? 'Yes' : 'No'}</Text>
            </VStack>
          ) : (
            <Text>No user data available.</Text>
          )}
        </Box>

        <Heading as="h2" size="lg" mb={6} color="blue.500">
          User Reviews
        </Heading>
        {loadingReviews ? (
          <Spinner size="lg" color="blue.500" />
        ) : errorReviews ? (
          <Alert status="error" maxW="400px" boxShadow="md" borderRadius="md">
            <AlertIcon />
            {errorReviews}
          </Alert>
        ) : reviews.length > 0 ? (
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {reviews.map((review) => (
              <GridItem
                key={review.id}
                p={4}
                bg="blue.50"
                borderRadius="md"
                boxShadow="md"
                textAlign="center"
              >
                <Text fontWeight="bold" color="blue.600">
                  {review.title}
                </Text>
                <Text color="gray.700">{review.description}</Text>
                <Text fontSize="sm" color="gray.500">
                  <strong>Created:</strong> {new Date(review.createdAt).toLocaleDateString()}
                </Text>
              </GridItem>
            ))}
          </Grid>
        ) : (
          <Text>No reviews available for this user.</Text>
        )}
      </Box>
    </Grid>
  );
};

export default UserDetails;
