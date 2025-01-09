import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Text, Spinner, Alert, AlertIcon, VStack } from '@chakra-ui/react';
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bg="gray.50">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bg="gray.50">
        <Alert status="error" maxW="400px" boxShadow="md" borderRadius="md" color="black">
          <AlertIcon color="black" />
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center" p={4} bg={"white"}>
      <Box width="100%" maxW="500px" p={8} boxShadow="md" borderRadius="md" bg="white" marginRight="350px" marginLeft="700px">
        <Heading as="h1" size="lg" mb={6} color="black" textAlign="center">
          Review Details
        </Heading>
        <Sidebar />
        {review ? (
          <VStack align="start" spacing={4}>
            <Text color="black"><strong>ID:</strong> {review.id}</Text>
            <Text color="black"><strong>Title:</strong> {review.title}</Text>
            <Text color="black"><strong>Description:</strong> {review.description}</Text>
            <Text color="black"><strong>Media:</strong> {review.media?.name || 'Unknown'}</Text>
            <Text color="black">
              <strong>Platform:</strong>{" "}
              <a href={review.platform.link} target="_blank" rel="noopener noreferrer">
                {review.platform.link}
              </a>
            </Text>
            <Text color="black"><strong>User:</strong> {review.user ? `${review.user.name} ${review.user.lastname}` : 'Unknown'}</Text>
            <Text color="black"><strong>Created At:</strong> {new Date(review.createdAt).toLocaleDateString()}</Text>
            <Text color="black"><strong>Updated At:</strong> {new Date(review.updatedAt).toLocaleDateString()}</Text>
            {review.genres && review.genres.length > 0 && (
              <Text color="black"><strong>Genres:</strong> {review.genres.map((genre) => genre.name).join(', ')}</Text>
            )}
          </VStack>
        ) : (
          <Text color="black">No review data available.</Text>
        )}
      </Box>
    </Box>
  );
};

export default ReviewDetails;
