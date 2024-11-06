import { HStack, Image, Spacer, Text, Box } from "@chakra-ui/react";
import React from "react";
import logo from "../assets/logo.webp";

const Navbar = () => {
  return (
    <HStack p={4} bg="blue.400" color="white" justifyContent="center">
      <Image src={logo} alt="Sheridan College Logo" boxSize="50px" />
      <Spacer />
      <Text fontSize="2xl" textAlign="center">
        Admin Dashboard
      </Text>
      <Spacer />
    </HStack>
  );
};

export default Navbar;
