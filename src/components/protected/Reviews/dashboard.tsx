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
} from "@chakra-ui/react";
import {
  getRangeOfReviews,
  deleteReview,
  showAllDeletedReviews,
  undeleteReview,
} from "../../../service/apiclient";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../Users/Searchbar";

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 25;
  const [showDeleted, setShowDeleted] = useState(false);

  const navigate = useNavigate();

  // Check if the user is authenticated
  useEffect(() => {
    const checkAccess = async () => {
      const authToken = sessionStorage.getItem("authToken");
      if (!authToken) {
        navigate("/");
        return;
      }
    };
    checkAccess();
  }, [navigate]);

  // Fetch reviews with or without deleted state
  const fetchReviews = async (page) => {
    try {
      setLoading(true);
      const startIndex = (page - 1) * reviewsPerPage;
      let reviewsData = [];

      if (showDeleted) {
        const deletedReviews = await showAllDeletedReviews();
        reviewsData = deletedReviews.slice(startIndex, startIndex + reviewsPerPage);
      } else {
        const allReviews = await getRangeOfReviews(startIndex + reviewsPerPage);
        reviewsData = allReviews.slice(startIndex, startIndex + reviewsPerPage);
      }

      setReviews(reviewsData);
      setFilteredReviews([]);
      setLoading(false);
    } catch (error) {
      setError(showDeleted ? "Failed to load deleted reviews" : "Failed to load reviews");
      setLoading(false);
    }
  };

  // Fetch reviews on component load and whenever the page or showDeleted state changes
  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage, showDeleted]);

  // Handle search results and ensure the user info is displayed
  const handleSearchResults = (results) => {
    setFilteredReviews(results);
  };

  // Truncate long text
  const truncateText = (text, length = 50) => {
    return text.length > length ? `${text.slice(0, length)}...` : text;
  };

  // Pagination handlers
  const goToNextPage = () => setCurrentPage((prev) => prev + 1);
  const goToPreviousPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((review) => review.id !== id));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  // Handle undelete action
  const handleUndelete = async (id) => {
    try {
      await undeleteReview(id);
      setReviews((prev) => prev.filter((review) => review.id !== id));
    } catch (error) {
      console.error("Error undeleting review:", error);
    }
  };

  // Navigate to update review page
  const handleUpdate = (id) => {
    navigate(`/update/review/${id}`);
  };

  // Toggle between showing deleted reviews or all reviews
  const toggleDeletedReviews = () => {
    setShowDeleted((prev) => !prev);
    setCurrentPage(1);
  };

  return (
    <Flex minHeight="100vh" direction="column" mt={90}>
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" p={4}>
        <Box maxWidth="80%" width="100%" mx="auto" marginRight={200}>
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <SearchBar onSearchResults={handleSearchResults} />
          </Flex>

          <Flex justifyContent="center" mb={4}>
            <Button colorScheme={showDeleted ? "gray" : "gray"} onClick={toggleDeletedReviews}>
              {showDeleted ? "Back to all reviews" : "Show deleted reviews"}
            </Button>
          </Flex>

          {loading ? (
            <Spinner size="xl" color="blue.500" />
          ) : error ? (
            <Text color="red.500" textAlign="center">
              {error}
            </Text>
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
                        <Td>
                          {review.user
                            ? `${review.user.name} ${review.user.lastname || ""}`
                            : "Unknown"}
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
                                onClick={() => handleUpdate(review.id)}
                                mr={2}
                              >
                                Update
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
