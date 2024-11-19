import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Heading, Spinner, Text, Flex } from '@chakra-ui/react';
import { getReviews, getOneUser } from '../../service/apiclient';
import { Link } from 'react-router-dom';
import SearchBar from './searchbar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [users, setUsers] = useState({}); // State to store user details by ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const authToken = sessionStorage.getItem('authToken'); // or localStorage.getItem('authToken')
  if (!authToken) {
    navigate('/'); // Redirect to login page if token is missing
  }

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

  const fetchUserDetails = async (userId) => {
    if (!users[userId]) { // Only fetch if user data isn't already available
      try {
        const user = await getOneUser({ id: userId });
        setUsers((prevUsers) => ({ ...prevUsers, [userId]: user }));
      } catch (error) {
        console.log("Failed to load user details:", error);
      }
    }
  };

  useEffect(() => {
    // Fetch user details for each user_fk in the reviews
    (filteredReviews.length > 0 ? filteredReviews : reviews).forEach((review) => {
      fetchUserDetails(review.user_fk);
    });
  }, [reviews, filteredReviews]);

  const handleSearchResults = (results) => {
    setFilteredReviews(results);
  };

  const truncateText = (text, length = 50) => {
    return text.length > length ? `${text.slice(0, length)}...` : text;
  };

  return (
    <Flex minHeight="100vh" direction="column">

      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" p={4}>
        <Box maxWidth="80%" width="100%" mx="auto" marginRight={200}>
          <Heading as="h1" size="lg" mb={4} color="blue.600" textAlign="center">
            Manage reviews
          </Heading>
          
          <SearchBar onSearchResults={handleSearchResults} />

          {loading ? (
            <Spinner size="xl" color="blue.500" />
          ) : error ? (
            <Text color="red.500" textAlign="center">{error}</Text>
          ) : (
            <TableContainer mt={4}>
              <Table variant="striped" colorScheme="blue">
                <Thead>
                  <Tr>
                    <Th color="blue.700">ID</Th>
                    <Th color="blue.700">Title</Th>
                    <Th color="blue.700">Content</Th>
                    <Th color="blue.700">Created by</Th>
                    <Th color="blue.700">Review created</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {(filteredReviews.length > 0 ? filteredReviews : reviews).map((review) => (
                    <Tr key={review.id}>
                      <Td>{review.id}</Td>
                      <Td>
                        <Link to={`/review/${review.id}`} style={{ color: 'black', textDecoration: 'underline' }}>
                          {review.title}
                        </Link>
                      </Td>
                      <Td style={{ color: 'rgba(0, 0, 0, 0.6)', whiteSpace: 'nowrap' }}>
                        {truncateText(review.description, 50)}
                      </Td>
                      <Td>
                        <Link to={`/user/${users[review.user_fk] ? users[review.user_fk].id : 'Loading...'}`} style={{ color: 'black', textDecoration: 'underline' }}>
                          {users[review.user_fk] ? users[review.user_fk].name : "Loading..."}
                        </Link>
                      </Td>
                      <Td>{new Date(review.createdAt).toLocaleDateString()}</Td>
                    </Tr>
                  ))}
                </Tbody>

              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default Dashboard;
