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
  Input,
  Heading,
  Grid
} from "@chakra-ui/react";
import { 
  getRangeOfReviews, 
  getOneUser, 
  deleteReview, 
  showAllDeletedReviews, 
  undeleteReview 
} from "../../../service/apiclient";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleted, setShowDeleted] = useState(false);
  const reviewsPerPage = 25;
  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * reviewsPerPage;
  
      let data;
      if (showDeleted) {
        data = await showAllDeletedReviews();
      } else {
        data = await getRangeOfReviews(reviewsPerPage, offset);
      }
  
      // Ensure all items in `data` are valid
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from API");
      }
  
      // Filter out invalid objects
      setReviews(data.filter((review) => review && review.id));
    } catch (err) {
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchReviews();
  }, [currentPage, showDeleted]); // Re-fetch when the page or showDeleted status changes

  // Fetch user details dynamically
  const fetchUserDetails = async (userId) => {
    if (!users[userId]) {
      try {
        const user = await getOneUser({ id: userId });
        setUsers((prevUsers) => ({
          ...prevUsers,
          [userId]: user.name || "Unknown",
        }));
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    }
  };

  useEffect(() => {
    reviews.forEach((review) => {
      if (!users[review.user_fk]) {
        fetchUserDetails(review.user_fk);
      }
    });
  }, [reviews]);

  // Handle search
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      fetchReviews(); // Reset reviews if search is cleared
    } else {
      const filtered = reviews.filter((review) =>
        review.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setReviews(filtered);
    }
    setCurrentPage(1); // Reset to the first page
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Pagination handlers
  const goToNextPage = () => setCurrentPage((prev) => prev + 1);
  const goToPreviousPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));

  const truncateText = (text, length = 50) => {
    return text.length > length ? `${text.slice(0, length)}...` : text;
  };

  const toggleDeletedReviews = () => {
    setShowDeleted((prev) => !prev);
    setCurrentPage(1); // Reset to the first page
  };

  const handleDelete = async (id) => {
    try {
      await deleteReview(id); // Send delete request to the server
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== id) // Remove the deleted review from state
      );
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };
  

  const handleUndelete = async (id) => {
    try {
      await undeleteReview(id);
      fetchReviews(); // Refetch reviews after undeleting
    } catch (error) {
      console.error("Error undeleting review:", error);
    }
  };

  return (
  <Grid
    minHeight="100vh"
    templateColumns="1fr"
    alignItems="center"
    justifyContent="center"
    bg="white" // Ensure white background
    color="gray.800"
    width="100%" // Full width
    pt={20}
    marginRight="680px"
    >
    <Box
       width="100%"
       maxW="1300px"
       p={8}
       boxShadow="lg"
       borderRadius="md"
       bg="white"
       textAlign="center"
       margin="0 auto"
    >
        <Heading as="h1" size="lg" mb={6} color="blue.500">
          Review Dashboard
        </Heading>
  
        {/* Search bar */}
        <Flex justifyContent="center" alignItems="center" mb={4}>
          <Box width="70%">
            <Input
              placeholder="Search by title..."
              value={searchTerm}
              onChange={handleInputChange}
              width="100%"
              border="2px solid"
              borderColor="blue.600"
              borderRadius="full"
              focusBorderColor="blue.400"
              _placeholder={{ color: "blue.400" }}
              textColor={searchTerm ? "black" : "gray.500"}
            />
          </Box>
          <Button onClick={handleSearch} colorScheme="blue" ml={2}>
            Search
          </Button>
        </Flex>
  
        <Flex justifyContent="center" mb={4}>
          <Button
            colorScheme="gray"
            onClick={toggleDeletedReviews}
            textColor="black"
          >
            {showDeleted ? "Back to all reviews" : "Show deleted reviews"}
          </Button>
        </Flex>
  
        {loading ? (
          <Spinner size="xl" color="blue.500" />
        ) : error ? (
          <Text color="red.500" textAlign="center">{error}</Text>
        ) : (
          <>
            <TableContainer 
              mt={4} 
              bg="blue.50" 
              borderRadius="md" 
              boxShadow="md"
              width="100%" // Ensures the table spans the entire container
            >
              <Table variant="striped" colorScheme="blue">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Title</Th>
                    <Th>Content</Th>
                    <Th>Created by</Th>
                    <Th>Updated</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {reviews
                    .filter((review) => review) // Filter out null or undefined items
                    .map((review) => (
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
                        <Td>{truncateText(review.description)}</Td>
                        <Td>
                          {review.user ? (
                            <Link
                              to={`/user/${review.user.id}`}
                              style={{ color: "black" }}
                            >
                              {review.user.name || "Unknown"}
                            </Link>
                          ) : (
                            "Unknown"
                          )}
                        </Td>
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
                                onClick={() => navigate(`/update/review/${review.id}`)}
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
    </Grid>
  );
}  

export default Dashboard;
