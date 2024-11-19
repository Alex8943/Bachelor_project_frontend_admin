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
  Select,
} from '@chakra-ui/react';
import { getReviews, getRangeOfReviews, getOneUser } from '../../service/apiclient';
import { Link } from 'react-router-dom';
import SearchBar from './searchbar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState(10); // Default range value

  const navigate = useNavigate();

  const authToken = sessionStorage.getItem('authToken');
  if (!authToken) {
    navigate('/'); // Redirect to login page if token is missing
  }

  const fetchReviews = async (range) => {
    try {
      const data = range ? await getRangeOfReviews(range) : await getReviews();
      setReviews(data);
      setFilteredReviews([]); // Reset filtered reviews when range changes
      setLoading(false);
    } catch (error) {
      setError('Failed to load reviews');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(range);
  }, [range]);

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

  const handleRangeChange = (event) => {
    setRange(parseInt(event.target.value, 10));
  };

  const truncateText = (text, length = 50) => {
    return text.length > length ? `${text.slice(0, length)}...` : text;
  };

  return (
    <Flex minHeight="100vh" direction="column" mt={90}>
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" p={4}>
        <Box maxWidth="80%" width="100%" mx="auto" marginRight={200}>
         

          {/* Search Bar and Dropdown */}
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <SearchBar onSearchResults={handleSearchResults} />
            <Select
              width="200px"
              onChange={handleRangeChange}
              value={range}
              placeholder="Select range"
              color="blue.700"
              borderColor="blue.400"
            >
              <option value={5}>5 Reviews</option>
              <option value={10}>10 Reviews</option>
              <option value={20}>20 Reviews</option>
              <option value={50}>50 Reviews</option>
            </Select>
          </Flex>

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
                      <Td>
                        <Link
                          to={`/user/${users[review.user_fk] ? users[review.user_fk].id : 'Loading...'}`}
                          style={{ color: 'black', textDecoration: 'underline' }}
                        >
                          {users[review.user_fk] ? users[review.user_fk].name : 'Loading...'}
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