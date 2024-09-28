import React, { useEffect, useState } from "react";
//import { getAllReviews } from "../service/apiclient";
import { Box, Text, VStack, Flex } from "@chakra-ui/react";
import Login from "./login_button";
import SearchBar from "./navigation/Searchbar";
import Picture from "./Picture";

const Home = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [allReviews, setAllReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        //const reviews = getAllReviews();
        console.log('Fetched Reviews JSON: (empty for now)');
        //setReviews(reviews);
        //setAllReviews(reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  const handleSearchResult = (results) => {
    if (results.length > 0) {
      setReviews(results);
    } else {
      setReviews(allReviews);
    }
  };

  return (
    <>
      
      <Picture />
      
      <SearchBar onSearchResult={handleSearchResult} />
      <Login />
      <Flex
        justify="center" // Centers content horizontally
        align="center"   // Centers content vertically
        //minH="100vh"     // Takes up the full height of the viewport
        p={4}            // Adds padding around the content
      >
        <VStack
          spacing={8}  // Space between each review
          w={{ base: "90%", md: "60%", lg: "50%" }}  // Responsive width for mobile, tablet, and desktop
          maxW="500px"  // Maximum width of the container
        >
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <Box
                key={index}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                boxShadow="md"
                w="100%"  // Takes up full width of the container
                overflow="hidden"
              >
                <Text
                  fontWeight="bold"
                  isTruncated  
                  fontSize="lg"
                  mb={2} 
                >
                  {review.title}
                </Text>
                <Text
                  noOfLines={3} 
                  color="gray.600"
                >
                  {review.description}
                </Text>
              </Box>
            ))
          ) : (
            <Text>No reviews found.</Text>
          )}
        </VStack>
      </Flex>
    </>
  );
};

export default Home; 