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
  Grid,
  Select,
} from "@chakra-ui/react";
import {
  getRangeOfReviews,
  getOneUser,
  deleteReview,
  showAllDeletedReviews,
  undeleteReview,
  getAllPlatforms,
} from "../../../service/apiclient";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]); // Original dataset
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleted, setShowDeleted] = useState(false);
  const [platformOptions, setPlatformOptions] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [filterMessage, setFilterMessage] = useState(""); // Filter message
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

      console.log("Reviews data:", data);

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from API");
      }

      setAllReviews(data); // Save original dataset
      setReviews(data); // Display dataset
    } catch (err) {
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlatforms = async () => {
    try {
      const platforms = await getAllPlatforms();
      setPlatformOptions(platforms);
      console.log("Platforms fetched:", platforms.map((p) => p.link));
    } catch (err) {
      console.error("Failed to fetch platforms:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchPlatforms();
  }, [currentPage, showDeleted]);

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

  useEffect(() => {
    let filteredReviews = [...allReviews];
  
    // Filter by Genre
    if (selectedGenre) {
      filteredReviews = filteredReviews.filter((review) =>
        review.genres && Array.isArray(review.genres)
          ? review.genres.some((genre) => genre.name === selectedGenre)
          : false
      );
    }
  
    // Filter by Platform
    if (selectedPlatform) {
      filteredReviews = filteredReviews.filter((review) =>
        review.Reviews &&
        Array.isArray(review.Reviews) &&
        review.Reviews.some((nestedReview) =>
          platformOptions.some(
            (platform) =>
              platform.id === nestedReview.platform_fk &&
              platform.link === selectedPlatform
          )
        )
      );
    }
  
    // Update Filter Message
    if (filteredReviews.length === 0) {
      setFilterMessage("No reviews match the selected filters.");
    } else if (selectedGenre) {
      setFilterMessage(`Filtering reviews for genre: ${selectedGenre}`);
    } else if (selectedPlatform) {
      setFilterMessage(`Filtering reviews for platform: ${selectedPlatform}`);
    } else {
      setFilterMessage("");
    }
  
    setReviews(filteredReviews);
  }, [selectedGenre, selectedPlatform, allReviews, platformOptions]);
  
  
  const handleSearch = () => {
    let filteredReviews = [...allReviews];

    if (searchTerm.trim()) {
      filteredReviews = filteredReviews.filter((review) =>
        review.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setReviews(filteredReviews);
    setCurrentPage(1);

    if (filteredReviews.length === 0) {
      setFilterMessage("No reviews match your search.");
    } else {
      setFilterMessage("");
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  const handlePlatformChange = (e) => {
    setSelectedPlatform(e.target.value);
  };

  const resetFilters = () => {
    setSelectedGenre("");
    setSelectedPlatform("");
    setSearchTerm("");
    setFilterMessage("");
    setCurrentPage(1);
    setReviews(allReviews);
  };

  const goToNextPage = () => setCurrentPage((prev) => prev + 1);
  const goToPreviousPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
  const toggleDeletedReviews = () => setShowDeleted((prev) => !prev);

  const truncateText = (text, length = 50) => {
    return text.length > length ? `${text.slice(0, length)}...` : text;
  };

  return (
    <Grid
      minHeight="100vh"
      templateColumns="1fr"
      alignItems="center"
      justifyContent="center"
      bg="white"
      color="gray.800"
      width="100%"
      pt={12}
      marginRight="680px"
      marginTop={20}
    >
      <Box width="100%" maxW="1500px" p={8} boxShadow="lg" borderRadius="md" bg="white" textAlign="center" margin="0 auto">
        <Heading as="h1" size="lg" mb={6} color="blue.500">
          Review Dashboard
        </Heading>

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

        <Flex mb={4} justifyContent="space-between">
          <Box width="48%">
          <Select placeholder="Filter by genre" onChange={handleGenreChange} value={selectedGenre}>
            {Array.from(
              new Set(
                allReviews.flatMap((review) =>
                  review.genres && Array.isArray(review.genres) ? review.genres.map((genre) => genre.name) : []
                )
              )
            ).map((genreName, index) => (
              <option key={index} value={genreName}>
                {genreName}
              </option>
            ))}
          </Select>

          </Box>
          <Box width="48%">
            <Select placeholder="Filter by platform" onChange={handlePlatformChange} value={selectedPlatform}>
              {platformOptions.map((platform) => (
                <option key={platform.id} value={platform.link}>
                  {platform.link}
                </option>
              ))}
            </Select>
          </Box>
        </Flex>

        <Flex justifyContent="flex-end" mb={4}>
          <Button onClick={resetFilters} colorScheme="red" mr={4}>
            Reset Filters
          </Button>
          <Button colorScheme="blue" onClick={toggleDeletedReviews} mr={4}>
            {showDeleted ? "Back to all reviews" : "Show deleted reviews"}
          </Button>
        </Flex>

        {filterMessage && (
          <Text mb={4} color="blue.500" fontWeight="bold" textAlign="center">
            {filterMessage}
          </Text>
        )}

        <Flex justifyContent="center" mb={4}>
          <Button
            colorScheme="blue"
            onClick={() => navigate("/create/review")}
          >
            Create Review
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
            <Box overflowX="auto" border="1px solid" borderColor="blue.200" borderRadius="md">
              <TableContainer>
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
                    {reviews.map((review) => (
                      <Tr key={review.id}>
                        <Td>{review.id}</Td>
                        <Td>
                          <Link to={`/review/${review.id}`} style={{ color: "black", textDecoration: "underline" }}>
                            {review.title}
                          </Link>
                        </Td>
                        <Td>{truncateText(review.description)}</Td>
                        <Td>{review.user ? review.user.name : "Unknown"}</Td>
                        <Td>{new Date(review.updatedAt).toLocaleDateString()}</Td>
                        <Td>
                          {showDeleted ? (
                            <Button colorScheme="green" size="sm" onClick={() => undeleteReview(review.id)}>
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
                                onClick={() => deleteReview(review.id)}
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
            </Box>

            <Flex justifyContent="center" mt={4}>
              <Button onClick={goToPreviousPage} isDisabled={currentPage === 1} colorScheme="blue" mr={4}>
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
};

export default Dashboard;
