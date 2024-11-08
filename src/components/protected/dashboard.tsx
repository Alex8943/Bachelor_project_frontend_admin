import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Heading, Spinner, Text } from '@chakra-ui/react';
import { getReviews } from '../../service/apiclient';
import SearchBar from './searchbar';

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews();
        setReviews(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load reviews');
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={4}
    >
      
      <Box maxWidth="80%" width="100%" mx="auto" marginRight={200}> {/* Inner Box with centered alignment */}
        <Heading as="h1" size="lg" mb={4} color="blue.600" textAlign="center">
        </Heading>
        <SearchBar />
        {loading ? (
          <Spinner size="xl" color="blue.500" />
        ) : error ? (
          <Text color="red.500" textAlign="center">{error}</Text>
        ) : (
          <TableContainer>
            <Table variant="striped" colorScheme="blue">
              <Thead>
                <Tr>
                  <Th color="blue.700">ID</Th>
                  <Th color="blue.700">Title</Th>
                  <Th color="blue.700">Content</Th>
                  <Th color="blue.700">User's Name</Th>
                  <Th color="blue.700">Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {reviews.map((review) => (
                  <Tr key={review.id}>
                    <Td>{review.id}</Td>
                    <Td>{review.title}</Td>
                    <Td>{review.description}</Td>
                    <Td>{review.User.name}</Td>
                    <Td>{new Date(review.createdAt).toLocaleDateString()}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
