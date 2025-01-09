import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Text,
  Flex,
  Button,
  Heading,
} from "@chakra-ui/react";
import { 
  getRangeOfReviews, 
  getOneUser, 
  deleteReview, 
  showAllDeletedReviews, 
  undeleteReview 
} from "../../../service/apiclient";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../Users/Searchbar";

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 25;
  const [showDeleted, setShowDeleted] = useState(false);

  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRoleName, setUserRoleName] = useState('');

  useEffect(() => {
    const authToken = sessionStorage.getItem('authToken');
    const storedName = sessionStorage.getItem('userName');
    const storedEmail = sessionStorage.getItem('userEmail');
    const storedRoleName = sessionStorage.getItem('userRoleName');

    if (!authToken) {
      navigate('/'); // Redirect to login if not authenticated
      return;
    }

    setUserName(storedName);
    setUserEmail(storedEmail);
    setUserRoleName(storedRoleName);
    setLoading(false);

    console.log('User profile:', 'Name:', storedName, 'Email:', storedEmail, 'Role:', storedRoleName);
    console.log("Auth token:", authToken);
  }, [navigate]);

  const fetchReviews = async (page) => {
    try {
      setLoading(true);
      const startIndex = (page - 1) * reviewsPerPage;

      const authToken = sessionStorage.getItem('authToken');
      if (!authToken) {
        throw new Error("Unauthorized");
      }

      if (showDeleted) {
        const deletedReviews = await showAllDeletedReviews(authToken);
        setReviews(deletedReviews.slice(startIndex, startIndex + reviewsPerPage));
      } else {
        const data = await getRangeOfReviews(startIndex, reviewsPerPage, authToken);
        setReviews(data.slice(startIndex, startIndex + reviewsPerPage));
      }

      setFilteredReviews([]); // Reset filtered reviews
      setLoading(false);
    } catch (error) {
      setError(showDeleted ? "Failed to load deleted reviews" : "Failed to load reviews");
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage, showDeleted]);

  const fetchUserDetails = async (userId) => {
    if (users[userId]) {
      return; 
    }

    try {
      const authToken = sessionStorage.getItem('authToken');
      const user = await getOneUser(userId, authToken);
      setUsers((prevUsers) => ({ ...prevUsers, [userId]: user }));
    } catch (error) {
      console.error(`Failed to load user details for user ID: ${userId}`, error);
      setUsers((prevUsers) => ({ ...prevUsers, [userId]: { name: "Unknown" } }));
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

  const handleDelete = async (id) => {
    try {
      const authToken = sessionStorage.getItem('authToken');
      await deleteReview(id, authToken);
      setReviews((prev) => prev.filter((review) => review.id !== id));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleUndelete = async (id) => {
    try {
      const authToken = sessionStorage.getItem('authToken');
      await undeleteReview(id, authToken);
      setReviews((prev) => prev.filter((review) => review.id !== id));
    } catch (error) {
      console.error("Error undeleting review:", error);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update/review/${id}`);
  };

  const toggleDeletedReviews = () => {
    setShowDeleted((prev) => !prev);
    setCurrentPage(1);
  };

  return (
    <Flex minHeight="100vh" direction="column" mt={90}>
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" p={8} bg="white">
        <Box maxWidth="180%" width="400%" mx="10" marginRight={300} marginLeft={250}>
          <Heading as="h1" size="lg" mb={4} textAlign="center" color="blue.600">
            Review Dashboard
          </Heading>

          <SearchBar onSearchResults={handleSearchResults} />

          <Flex justifyContent="center" mb={4}>
            <Button colorScheme={showDeleted ? "gray" : "gray"} onClick={toggleDeletedReviews}>
              {showDeleted ? "Back to all reviews" : "Show deleted reviews"}
            </Button>
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
                      <Th color="blue.700">Review updated</Th>
                      <Th color="blue.700">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {(filteredReviews.length > 0 ? filteredReviews : reviews).map((review) => (
                      <Tr key={review.id}>
                        <Td>{review.id}</Td>
                        <Td>
                          <Link
                            to={`/review/${review.id}`}
                            style={{ color: "black", textDecoration: "underline" }}
                          >
                            {review.title}
                          </Link>
                        </Td>
                        <Td style={{ color: "rgba(0, 0, 0, 0.6)", whiteSpace: "nowrap" }}>
                          {truncateText(review.description, 50)}
                        </Td>
                        <Td>{users[review.user_fk]?.name || "Unknown"}</Td>
                        <Td>{new Date(review.updatedAt).toLocaleDateString()}</Td>
                        <Td>
                          {showDeleted ? (
                            <Button
                              colorScheme="green"
                              size="sm"
                              onClick={() => handleUndelete(review.id)}
                            >
                              Undelete
                            </Button>
                          ) : (
                            <>
                              <Button
                                colorScheme="blue"
                                size="sm"
                                onClick={() => handleUpdate(review.id)}
                                mr={2}
                              >
                                Edit
                              </Button>
                              <Button
                                colorScheme="red"
                                size="sm"
                                onClick={() => handleDelete(review.id)}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              <Flex justifyContent="center" mt={4}>
                <Button
                  onClick={goToPreviousPage}
                  isDisabled={currentPage === 1}
                  colorScheme="blue"
                  mr={4}
                >
                  Previous
                </Button>
                <Button
                  onClick={goToNextPage}
                  isDisabled={reviews.length < reviewsPerPage}
                  colorScheme="blue"
                >
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
