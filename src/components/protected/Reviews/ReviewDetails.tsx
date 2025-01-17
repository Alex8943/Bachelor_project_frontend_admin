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
} from '@chakra-ui/react';
import { getOneReview } from '../../../service/apiclient';
import Sidebar from '../burgermenu/Sidebar';

const ReviewDetails = () => {
  const { id } = useParams(); // Get review ID from URL
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
      navigate('/'); // Redirect to login page if token is missing
      return;
    }

    const fetchReview = async () => {
      try {
        const reviewData = await getOneReview(id);
        setReview(reviewData);
        setLoading(false);
      } catch (error) {
        setError('Failed to load review details');
        setLoading(false);
      }
    };

    fetchReview();
  }, [id, navigate]);

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
          Review Details
        </Heading>
        <Sidebar />
        <Box>
          {review ? (
            <VStack align="start" spacing={4}>
              <Text><strong>ID:</strong> {review.id}</Text>
              <Text><strong>Title:</strong> {review.title}</Text>
              <Text><strong>Description:</strong> {review.description}</Text>
              <Text><strong>Media:</strong> {review.media?.name || 'Unknown'}</Text>
              <Text>
                <strong>Platform:</strong>{' '}
                <a href={review.platform?.link} target="_blank" rel="noopener noreferrer">
                  {review.platform?.link || 'Unknown'}
                </a>
              </Text>
              <Text><strong>User:</strong> {review.user ? `${review.user.name} ${review.user.lastname}` : 'Unknown'}</Text>
              <Text><strong>Created At:</strong> {new Date(review.createdAt).toLocaleDateString()}</Text>
              <Text><strong>Updated At:</strong> {new Date(review.updatedAt).toLocaleDateString()}</Text>
              {review.genres && review.genres.length > 0 && (
                <Text><strong>Genres:</strong> {review.genres.map((genre) => genre.name).join(', ')}</Text>
              )}
            </VStack>
          ) : (
            <Text>No review data available.</Text>
          )}
        </Box>
      </Box>
    </Grid>
  );
};

export default ReviewDetails;
