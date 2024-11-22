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
import { getRangeOfReviews, getOneUser, deleteReview, showAllDeletedReviews } from "../../../service/apiclient";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../Users/searchbar";

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 25;
  const [showDeleted, setShowDeleted] = useState(false); // Toggle for deleted reviews

  const navigate = useNavigate();

  const authToken = sessionStorage.getItem("authToken");
  if (!authToken) {
    navigate("/"); // Redirect to login page if token is missing
  }

  // Fetch reviews or deleted reviews based on toggle state
  const fetchReviews = async (page) => {
    try {
      setLoading(true);
      const startIndex = (page - 1) * reviewsPerPage;
      if (showDeleted) {
        const deletedReviews = await showAllDeletedReviews();
        setReviews(deletedReviews.slice(startIndex, startIndex + reviewsPerPage));
      } else {
        const data = await getRangeOfReviews(startIndex + reviewsPerPage);
        setReviews(data.slice(startIndex, startIndex + reviewsPerPage));
      }
      setFilteredReviews([]); // Reset filtered reviews when changing pages
      setLoading(false);
    } catch (error) {
      setError(showDeleted ? "Failed to load deleted reviews" : "Failed to load reviews");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage, showDeleted]);

  const fetchUserDetails = async (userId) => {
    if (!users[userId]) {
      try {
        const user = await getOneUser({ id: userId });
        setUsers((prevUsers) => ({ ...prevUsers, [userId]: user }));
      } catch (error) {
        console.log("Failed to load user details:", error);
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

  const handleDelete = async (id) => {
    try {
      await deleteReview(id); // Call the API to delete the review
      setReviews((prev) => prev.filter((review) => review.id !== id)); // Update the table
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update/review/${id}`); // Redirect to the UpdateReview component with the review ID
  };

  const toggleDeletedReviews = () => {
    setShowDeleted((prev) => !prev); // Toggle between showing all and deleted reviews
    setCurrentPage(1); // Reset to the first page
  };

  return (
    <Flex minHeight="100vh" direction="column" mt={90}>
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" p={4}>
        <Box maxWidth="80%" width="100%" mx="auto" marginRight={200}>
          {/* Search Bar */}
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <SearchBar onSearchResults={handleSearchResults} />
          </Flex>

          {/* Deleted Reviews Button */}
          <Flex justifyContent="center" mb={4}>
            <Button
              colorScheme={showDeleted ? "gray" : "gray"}
              onClick={toggleDeletedReviews}
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
              <TableContainer mt={4}>
                <Table variant="striped" colorScheme="blue">
                  <Thead>
                    <Tr>
                      <Th color="blue.700">ID</Th>
                      <Th color="blue.700">Title</Th>
                      <Th color="blue.700">Content</Th>
                      <Th color="blue.700">Created by</Th>
                      <Th color="blue.700">Review updated</Th>
                      {!showDeleted && <Th color="blue.700">Actions</Th>} {/* Hide Actions for deleted reviews */}
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
                        {!showDeleted && (
                          <Td>
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
                          </Td>
                        )}
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