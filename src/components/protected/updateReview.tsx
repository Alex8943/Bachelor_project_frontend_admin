import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOneReview, updateReview } from "../../service/apiclient";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Spinner,
  Flex,
} from "@chakra-ui/react";

const UpdateReview = () => {
  const { id } = useParams(); // Get the review ID from the URL
  const navigate = useNavigate();

  const [review, setReview] = useState({ title: "", description: "", genre_ids: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReview = async () => {
    try {
      const data = await getOneReview(id);
      setReview(data);
      setLoading(false);
    } catch (error) {
      setError("Failed to load review");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReview();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await updateReview(id, review); // Update the review
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  return (
    <Flex minHeight="100vh" alignItems="center" justifyContent="center">
      {loading ? (
        <Spinner size="xl" color="blue.500" />
      ) : error ? (
        <Box color="red.500">{error}</Box>
      ) : (
        <Box maxWidth="600px" width="100%" p={6} boxShadow="md" borderRadius="md">
          <FormControl mb={4}>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={review.title}
              onChange={handleInputChange}
              placeholder="Enter title"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={review.description}
              onChange={handleInputChange}
              placeholder="Enter description"
            />
          </FormControl>
          {/* Add Genre Selection UI if necessary */}
          <Button colorScheme="blue" onClick={handleUpdate}>
            Update Review
          </Button>
        </Box>
      )}
    </Flex>
  );
};

export default UpdateReview;