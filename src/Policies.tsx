import React from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";

const Policies = () => {

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      minHeight="100vh"
      width="100vw"
      bg="white"
      color="black"
      marginTop={20}
    >
      <VStack spacing={6} mt={16} px={8} maxW="800px">
        <Heading as="h1" size="xl" textAlign="center">
          Platform Policies
        </Heading>
        <Text fontSize="lg" textAlign="center">
          We are committed to maintaining a respectful and inclusive environment for all users. Please read the following policies carefully.
        </Text>
        
        <Box textAlign="left" bg="whiteAlpha.800" p={6} borderRadius="md" color="gray.800">
          <Heading as="h2" size="md" mb={4}>Review Moderation Policy</Heading>
          <Text>
            1. Reviews containing offensive, racist, discriminatory, or hateful language will be removed immediately.
          </Text>
          <Text mt={2}>
            2. Admins hold the right to delete any review that violates our guidelines without prior notice.
          </Text>
          <Text mt={2}>
            3. Spam, misleading, or fake reviews are strictly prohibited and will be flagged for deletion.
          </Text>
        </Box>

        <Box textAlign="left" bg="whiteAlpha.800" p={6} borderRadius="md" color="gray.800" mt={4}>
          <Heading as="h2" size="md" mb={4}>User Conduct</Heading>
          <Text>
            1. Users must respect all members of the community. Harassment or bullying will not be tolerated.
          </Text>
          <Text mt={2}>
            2. Any attempt to exploit platform features or bypass security measures is grounds for immediate account termination.
          </Text>
          <Text mt={2}>
            3. Impersonation of other users or entities is strictly forbidden.
          </Text>
          <Text mt={2}>
            4. Users are responsible for the content they post and must ensure it aligns with our community standards.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default Policies;
