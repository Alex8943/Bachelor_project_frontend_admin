import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Spinner,
  Text,
  Flex,
  Button,
  Select,
} from '@chakra-ui/react';
import { getRangeOfReviews, getOneUser } from '../../service/apiclient';
import { Link } from 'react-router-dom';
import SearchBar from './searchbar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const reviewsPerPage = 25; // Max reviews per page
  const [range, setRange] = useState(reviewsPerPage); // Default range

  const navigate = useNavigate();

  const authToken = sessionStorage.getItem('authToken');
  if (!authToken) {
    navigate('/'); // Redirect to login page if token is missing
  }

  const fetchReviews = async (page) => {
    try {
      setLoading(true);
      const startIndex = (page - 1) * reviewsPerPage;
      const data = await getRangeOfReviews(startIndex + reviewsPerPage); // Fetch enough to cover the page
      setReviews(data.slice(startIndex, startIndex + reviewsPerPage)); // Slice the exact range for the page
      setFilteredReviews([]); // Reset filtered reviews when changing pages
      setLoading(false);
    } catch (error) {
      setError('Failed to load reviews');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage]);

  const fetchUserDetails = async (userId) => {
    if (!users[userId]) {
      try {
        const user = await getOneUser({ id: userId });
        setUsers((prevUsers) => ({ ...prevUsers, [userId]: user }));
      } catch (error) {
        console.log('Failed to load user details:', error);
      }
    }
  };


  useEffect(() => {
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

  const goToNextPage = () => setCurrentPage((prev) => prev + 1);
  const goToPreviousPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <Flex minHeight="100vh" direction="column" mt={90}>
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" p={4}>
        <Box maxWidth="80%" width="100%" mx="auto" marginRight={200}>
         

          {/* Search Bar and Dropdown */}
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <SearchBar onSearchResults={handleSearchResults} />
           
          </Flex>



          {loading ? (
            <Spinner size="xl" color="blue.500" />
          ) : error ? (
            <Text color="red.500" textAlign="center">{error}</Text>
          ) : (
            <>
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
                          <Link
                            to={`/review/${review.id}`}
                            style={{ color: 'black', textDecoration: 'underline' }}
                          >
                            {review.title}
                          </Link>
                        </Td>
                        <Td style={{ color: 'rgba(0, 0, 0, 0.6)', whiteSpace: 'nowrap' }}>
                          {truncateText(review.description, 50)}
                        </Td>
                        <Td>{users[review.user_fk]?.name || 'Unknown'}</Td>
                        <Td>{new Date(review.createdAt).toLocaleDateString()}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              {/* Pagination Controls */}
              <Flex justifyContent="center" mt={4}>
                <Button
                  onClick={goToPreviousPage}
                  isDisabled={currentPage === 1}
                  colorScheme="blue"
                  mr={4}
                >
                  Previous
                </Button>
                <Button onClick={goToNextPage} colorScheme="blue">
                  Next
                </Button>
              </Flex>
            </>
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default Dashboard;