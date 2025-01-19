import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <Box
      as="footer"
      bg="blue.400"
      color="white"
      textAlign="center"
      py={4}
      position="relative"
      width="100%"
      marginTop="auto"
    >
      <Text fontSize="sm">&copy; 2025 World of Podcast Reviews. All rights reserved.</Text>
      <Text
        fontSize="sm"
        onClick={() => navigate("/policies")}
        cursor="pointer"
        textDecoration="underline"
      >
        Terms of Service
      </Text>
    </Box>
  );
};

export default Footer;
