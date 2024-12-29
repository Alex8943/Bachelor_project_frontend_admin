import React, { useEffect, useState } from "react";
import { Box, Text, VStack, Heading } from "@chakra-ui/react";
import { getUpdates } from "../../service/apiclient";

const RealTimeUpdates = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const eventSource = getUpdates((data) => {
      console.log("New event received:", data);
      setEvents((prevEvents) => [data, ...prevEvents]); 
    });

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <>
      <Heading as="h2" size="lg" mb={4} marginTop="100px" textAlign="center">
        Real-Time Updates
      </Heading>
      <VStack spacing={4} align="stretch" width="50vw" margin="0 auto">
        {events.length > 0 ? (
          events.map((event, index) => {
            const user = event.user || {};
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
              >
                <Text fontSize="lg" fontWeight="bold">
                  Event: {event.event || "Unknown"}
                </Text>
                <Text>User: {user.name || "N/A"}</Text>
                <Text>Email: {user.email || "N/A"}</Text>
                <Text>
                  Timestamp:{" "}
                  {event.timestamp
                    ? new Date(event.timestamp).toLocaleString()
                    : "N/A"}
                </Text>
              </Box>
            );
          })
        ) : (
          <Text textAlign="center" mt={10}>
            No events received yet.
          </Text>
        )}
      </VStack>
    </>
  );
};

export default RealTimeUpdates;
