import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  Flex,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { getOneUser, getAllReviewsByUser } from '../../../service/apiclient';
import Sidebar from '../burgermenu/Sidebar';
import { useNavigate } from 'react-router-dom';


const UserDetails = () => {
  const { id } = useParams(); // Get user ID from URL
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState(null);
  const [errorReviews, setErrorReviews] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = sessionStorage.getItem('authToken'); // or localStorage.getItem('authToken')
    if (!authToken) {
      navigate('/'); // Redirect to login page if token is missing
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
    <Flex direction="column" align="center" minHeight="100vh" p={4} mt={12}>
      {/* User Details */}
      <Box width="100%" maxW="600px" p={8} boxShadow="md" borderRadius="md" bg="white" mb={8} marginRight={200}>
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
            <Text><strong>Role:</strong> {user.role_fk}</Text>
            <Text><strong>Created At:</strong> {new Date(user.createdAt).toLocaleDateString()}</Text>
            <Text><strong>Verified At:</strong> {user.verifiedAt ? new Date(user.verifiedAt).toLocaleDateString() : "Not Verified"}</Text>
            <Text><strong>Is Blocked:</strong> {user.isBlocked ? "Yes" : "No"}</Text>
          </VStack>
        ) : (
          <Text>No user data available.</Text>
        )}
      </Box>
  
      {/* User Reviews */}
      <Box width="100%" maxW="900px" p={8} boxShadow="md" borderRadius="md" bg="white" marginRight={200}>
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
          <Grid templateColumns="repeat(5, 1fr)" gap={6}>
            {reviews.map((review, index) => (
              <GridItem
                key={review.id}
                p={4}
                bg="gray.50"
                borderRadius="md"
                boxShadow="sm"
                textAlign="center"
              >
                <Text fontWeight="bold">{review.title}</Text>
                <Text>{review.description}</Text>
                <Text fontSize="sm">
                  <strong>Created:</strong> {new Date(review.createdAt).toLocaleDateString()}
                </Text>
              </GridItem>
            ))}
          </Grid>
        ) : (
          <Text>No reviews available for this user.</Text>
        )}
      </Box>
    </Flex>
  );
};

export default UserDetails;
