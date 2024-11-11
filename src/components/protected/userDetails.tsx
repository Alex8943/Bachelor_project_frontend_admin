import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, Spinner, Alert, AlertIcon, VStack, Flex } from '@chakra-ui/react';
import { getOneUser, getAllReviewsByUser } from '../../service/apiclient';
import Sidebar from './sidebar';

const UserDetails = () => {
  const { id } = useParams(); // Get user ID from URL
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState(null);
  const [errorReviews, setErrorReviews] = useState(null);

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
    <Flex minHeight="100vh" p={4} justifyContent="center" alignItems="center" gap={12}>
      {/* User Details Box */}
      <Box width="100%" maxW="500px" p={8} boxShadow="md" borderRadius="md" bg="white">
        <Heading as="h1" size="lg" mb={6} color="blue.600" textAlign="center">
          User Details
        </Heading>
        <Sidebar />
        {user ? (
          <VStack align="start" spacing={4} mb={6}>
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

      {/* User Reviews Box */}
      <Box width="100%" maxW="500px" p={8} boxShadow="md" borderRadius="md" bg="white" marginRight="170px">
        <Heading as="h2" size="lg" mb={6} color="blue.600" textAlign="center">
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
          <VStack align="start" spacing={4}>
            {reviews.map((review) => (
              <Box key={review.id} p={4} bg="gray.50" borderRadius="md" boxShadow="sm" width="100%">
                <Text><strong>Title:</strong> {review.title}</Text>
                <Text><strong>Description:</strong> {review.description}</Text>
                <Text><strong>Media ID:</strong> {review.media_fk}</Text>
                <Text><strong>Platform ID:</strong> {review.platform_fk}</Text>
                <Text><strong>Created At:</strong> {new Date(review.createdAt).toLocaleDateString()}</Text>
              </Box>
            ))}
          </VStack>
        ) : (
          <Text>No reviews available for this user.</Text>
        )}
      </Box>
    </Flex>

  );
};

export default UserDetails;
