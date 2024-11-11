import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, Spinner, Alert, AlertIcon, VStack } from '@chakra-ui/react';
import { getOneReview } from '../../service/apiclient';
import Sidebar from './sidebar';

const ReviewDetails = () => {
  const { id } = useParams(); // Get review ID from URL
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, [id]);

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
          Review Details
        </Heading>
        <Sidebar />
        {review ? (
          <VStack align="start" spacing={4}>
            <Text><strong>ID:</strong> {review.id}</Text>
            <Text><strong>Title:</strong> {review.title}</Text>
            <Text><strong>Description:</strong> {review.description}</Text>
            <Text><strong>Media ID:</strong> {review.media_fk}</Text>
            <Text><strong>Platform ID:</strong> {review.platform_fk}</Text>
            <Text><strong>User ID:</strong> {review.user_fk}</Text>
            <Text><strong>Created At:</strong> {new Date(review.createdAt).toLocaleDateString()}</Text>
            <Text><strong>Updated At:</strong> {new Date(review.updatedAt).toLocaleDateString()}</Text>
          </VStack>
        ) : (
          <Text>No review data available.</Text>
        )}
      </Box>
    </Box>
  );
};

export default ReviewDetails;
