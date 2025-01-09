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
  Heading
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
  const [allReviews, setAllReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleted, setShowDeleted] = useState(false);
  const reviewsPerPage = 25;
  const navigate = useNavigate();

    useEffect(() => {
      const fetchAllReviews = async () => {
        try {
          setLoading(true);
          if (showDeleted) {
            const deletedReviews = await showAllDeletedReviews();
            setAllReviews(deletedReviews);
            setFilteredReviews(deletedReviews);
          } else {
            const reviewsData = await getRangeOfReviews(500); // Fetch up to 500 reviews
            setAllReviews(reviewsData);
            setFilteredReviews(reviewsData);
          }
        } catch (error) {
          setError("Failed to load reviews.");
        } finally {
          setLoading(false);
        }
      };
    
      fetchAllReviews(); // Call the function inside useEffect
    }, [showDeleted]); // Add dependencies
  
  

    // Fetch reviews
    const fetchAllReviews = async () => {
      try {
        setLoading(true);
        if (showDeleted) {
          const deletedReviews = await showAllDeletedReviews();
          setAllReviews(deletedReviews);
          setFilteredReviews(deletedReviews);
        } else {
          const reviewsData = await getRangeOfReviews(500); // Fetch up to 500 reviews
          setAllReviews(reviewsData);
          setFilteredReviews(reviewsData);
        }
      } catch (error) {
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchAllReviews();
    }, [showDeleted]);
  
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
      filteredReviews.forEach((review) => {
        if (!users[review.user_fk]) {
          fetchUserDetails(review.user_fk);
        }
      });
    }, [filteredReviews]);
  
    // Handle search
    const handleSearch = () => {
      if (searchTerm.trim() === "") {
        setFilteredReviews(allReviews);
      } else {
        const filtered = allReviews.filter((review) =>
          review.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredReviews(filtered);
      }
      setCurrentPage(1); // Reset to the first page
    };
  
    const handleInputChange = (e) => {
      const value = e.target.value;
      setSearchTerm(value);
  
      if (value.trim() === "") {
        setFilteredReviews(allReviews);
        setCurrentPage(1); // Reset to the first page
      }
    };
  
    // Pagination logic
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const currentReviews = filteredReviews.slice(
      startIndex,
      startIndex + reviewsPerPage
    );
  
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
        await deleteReview(id);
        setAllReviews((prev) => prev.filter((review) => review.id !== id));
        setFilteredReviews((prev) => prev.filter((review) => review.id !== id));
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    };
  
    const handleUndelete = async (id) => {
      try {
        await undeleteReview(id);
        setAllReviews((prev) => prev.filter((review) => review.id !== id));
        setFilteredReviews((prev) => prev.filter((review) => review.id !== id));
      } catch (error) {
        console.error("Error undeleting review:", error);
      }
    };
  
    return (
      <Flex minHeight="100vh" direction="column" mt={90} bg="white">
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" p={8}>
          <Box maxWidth="80%" width="100%" mx="auto">
            <Heading as="h1" size="lg" mb={4} textAlign="center" color="blue.600">
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
                colorScheme={showDeleted ? "gray" : "gray"}
                onClick={toggleDeletedReviews}
                borderColor={showDeleted ? "black" : "gray"}
                textColor={showDeleted ? "black" : "gray"}
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
                <TableContainer mt={4} bg="blue.50" borderRadius="md" boxShadow="md">
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
                      {currentReviews.map((review) => (
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
                          <Td>{users[review.user_fk] || "Unknown"}</Td>
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
                    isDisabled={currentReviews.length < reviewsPerPage}
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
  