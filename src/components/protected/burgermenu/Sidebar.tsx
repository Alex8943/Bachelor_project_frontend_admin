import React from 'react';
import { Box, VStack, Heading, Text, Link, Icon, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure } from "@chakra-ui/react";
import { FiHome, FiUser, FiSettings, FiMenu } from "react-icons/fi";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* Burger Menu Button */}
      <IconButton
        aria-label="Open Menu"
        icon={<FiMenu />}
        size="lg"
        position="fixed"
        top={5}
        right={100}
        zIndex={10}
        onClick={onOpen}
        color="black"
        bg="blue.400"
        _hover={{ bg: "blue.500" }}
      />

      {/* Sidebar Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <Box
            w="250px"
            bg="blue.400"
            color="black"
            minH="100vh"
            p={4}
          >
            <VStack align="start" spacing={6}>
              <Heading size="md" mb={6}>Admin Dashboard</Heading>

              <Link href="/dashboard" display="flex" alignItems="center">
                <Icon as={FiHome} boxSize={5} mr={2} />
                <Text>Manage reviews</Text>
              </Link>

              <Link href="/users" display="flex" alignItems="center">
                <Icon as={FiUser} boxSize={5} mr={2} />
                <Text>Manage users</Text>
              </Link>

              <Link href="/statistics" display="flex" alignItems="center">
                <Icon as={FiSettings} boxSize={5} mr={2} />
                <Text>statistics</Text>
              </Link>

              <Link href="/sse" display="flex" alignItems="center">
                <Icon as={FiSettings} boxSize={5} mr={2} />
                <Text>Real-time updates</Text>
              </Link>
            </VStack>
          </Box>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
