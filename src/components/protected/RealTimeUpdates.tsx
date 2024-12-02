import React, { useEffect, useState } from "react";
import { Box, Text, VStack, Heading } from "@chakra-ui/react";
import { getUpdates } from "../../service/apiclient"; // Adjust the import path as needed

const RealTimeUpdates = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    // Start listening to updates via SSE
    const eventSource = getUpdates((data) => {
      console.log("New event received:", data); // Debug the incoming data
      setEvents((prevEvents) => [data, ...prevEvents]); // Add new event to the top of the list
    });

    // Cleanup on component unmount
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <>
      <Heading
        as="h2"
        size="lg"
        mb={4}
        marginTop={"100px"}
        textAlign={"center"}
        marginRight={"200px"}
      >
        Real-Time Updates
      </Heading>
      <VStack spacing={4} align="stretch" width="50vw">
        {events.map((event, index) => {
          // Parse user information from the nested structure
          const user = event.user?.authToken?.user || {};
          return (
            <Box
              key={index}
              p={4}
              bg="gray.100"
              borderRadius="md"
              boxShadow="md"
              border="1px solid"
              borderColor="gray.200"
              textAlign="center"
              marginTop={"100px"}
            >
              <Text fontSize="lg" fontWeight="bold">
                Event: {event.event || "Unknown"}
              </Text>
              <Text>User: {user.name || "Unknown"}</Text>
              <Text>Email: {user.email || "Unknown"}</Text>
              <Text>Timestamp: {new Date(event.timestamp).toLocaleString()}</Text>
            </Box>
          );
        })}
      </VStack>
    </>
  );
};

export default RealTimeUpdates;
