import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Spinner,
  useToast,
  Checkbox,
} from "@chakra-ui/react";
import {
  createReview,
  getAllGenres,
  getAllPlatforms,
  getAllMedias,
} from "../../../service/apiclient"; // Adjust the import path
import { useNavigate } from "react-router-dom";

const CreateReview = () => {
  const [formData, setFormData] = useState({
    media_fk: "",
    title: "",
    description: "",
    platform_fk: "",
    genre_ids: [],
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [mediaOptions, setMediaOptions] = useState([]);
  const [platformOptions, setPlatformOptions] = useState([]);
  const [genreOptions, setGenreOptions] = useState([]);
  const [userId, setUserId] = useState<number | null>(null); // Store user ID

  const toast = useToast();
  const navigate = useNavigate();

  // Fetch user ID from session storage
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    if (storedUserId) {
      setUserId(Number(storedUserId));
    }
  }, []);

  // Fetch media, platforms, and genres
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mediaData, platformData, genreData] = await Promise.all([
          getAllMedias(),
          getAllPlatforms(),
          getAllGenres(),
        ]);

        setMediaOptions(mediaData);
        setPlatformOptions(platformData);
        setGenreOptions(genreData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load form options.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenreChange = (genreId) => {
    const selectedGenres = formData.genre_ids.includes(genreId)
      ? formData.genre_ids.filter((id) => id !== genreId) // Remove ID if already selected
      : [...formData.genre_ids, genreId]; // Add ID if not selected
  
    setFormData({ ...formData, genre_ids: selectedGenres });
  
    console.log("Updated genre_ids:", selectedGenres); // Log selected genres
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Attach user ID dynamically
    const dataToSubmit = {
      ...formData,
      user_fk: userId,
    };

    console.log("Submitting data:", dataToSubmit); // Log the data before sending

    try {
      await createReview(dataToSubmit);
      toast({
        title: "Review Created",
        description: "Your review was successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setFormData({
        media_fk: "",
        title: "",
        description: "",
        platform_fk: "",
        genre_ids: [],
      });
      navigate("/profile");
    } catch (error) {
      console.error("Error creating review:", error);
      toast({
        title: "Error",
        description: error.response?.data || "Failed to create the review.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }   
  };

  if (fetchingData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box
    minHeight="100vh"
    alignItems="center"
    justifyContent="center"
    bg="white" // Ensure white background
    color="gray.800"
    width="100%" // Full width
    pt={12}
    marginRight="1700px"
    marginTop={20}
  >
    <Box
      width="100%"
      maxWidth="600px"
      bg="white"
      borderRadius="md"
      boxShadow="lg"
      p={8}
      margin="0 auto"

    >
      <Heading as="h1" size="lg" mb={6} color="teal.700" textAlign="center">
        Create Review
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={6}>
          <FormControl isRequired>
            <FormLabel color="black">Title</FormLabel>
            <Input
              placeholder="Review Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              color="gray.800" // Text color
              bg="gray.100" // Background for inputs
              _placeholder={{ color: "gray.500" }} // Placeholder color
            />
          </FormControl>
  
          <FormControl isRequired>
            <FormLabel color="black">Description</FormLabel>
            <Textarea
              placeholder="Write your review here"
              name="description"
              value={formData.description}
              onChange={handleChange}
              color="gray.800"
              bg="gray.100"
              _placeholder={{ color: "gray.500" }}
            />
          </FormControl>
  
          <FormControl isRequired>
            <FormLabel color="black">Media</FormLabel>
            <Select
              placeholder="Select Media"
              name="media_fk"
              value={formData.media_fk}
              onChange={handleChange}
              color="gray.800"
              bg="gray.100"
            >
              {mediaOptions.map((media) => (
                <option key={media.id} value={media.id}>
                  {media.name}
                </option>
              ))}
            </Select>
          </FormControl>
  
          <FormControl isRequired>
            <FormLabel color="black">Platform</FormLabel>
            <Select
              placeholder="Select Platform"
              name="platform_fk"
              value={formData.platform_fk}
              onChange={handleChange}
              color="gray.800"
              bg="gray.100"
            >
              {platformOptions.map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.link}
                </option>
              ))}
            </Select>
          </FormControl>
  
          <FormControl>
            <FormLabel color="black">Genres</FormLabel>
            <VStack align="start">
              {genreOptions.map((genre) => (
                <Checkbox
                  key={genre.id}
                  isChecked={formData.genre_ids.includes(genre.id)}
                  onChange={() => handleGenreChange(genre.id)}
                  color="gray.800"
                >
                  {genre.name}
                </Checkbox>
              ))}
            </VStack>
          </FormControl>
  
          <Button
            type="submit"
            colorScheme="teal"
            size="lg"
            width="100%"
            isLoading={loading}
          >
            {loading ? <Spinner size="md" /> : "Submit Review"}
          </Button>
        </VStack>
      </form>
    </Box>
  </Box>
  
  );
};

export default CreateReview;
