import React from "react";
import { Box, Text, VStack, Heading } from "@chakra-ui/react";
import { useEventContext } from "../../components/eventContext"; // Import the EventContext

const RealTimeUpdates: React.FC = () => {
    const { events } = useEventContext(); // Access the global events

    return (
      <Box
          bg="white"
          minHeight="100vh"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
      >
          <Heading as="h2" size="lg" mb={4} marginTop="50px" textAlign="center">
              Real-Time Updates
          </Heading>
          <VStack
              spacing={4}
              align="stretch"
              width="50vw"
              mb={10}
              marginRight="400px"
              marginLeft="350px"
          >
              {events.length > 0 ? (
                  events.map((event, index) => {
                      const user = event.user || {};
                      return (
                          <Box
                              key={index}
                              p={4}
                              bg="black"
                              color="white"
                              borderRadius="md"
                              boxShadow="md"
                              border="1px solid"
                              borderColor="gray.700"
                              textAlign="center"
                          >
                              <Text fontSize="lg" fontWeight="bold">
                                  Event: {event.event || "Unknown"}
                              </Text>
                              <Text>
                                  <strong>Name:</strong> {user.name || "N/A"}
                              </Text>
                              <Text>
                                  <strong>Last Name:</strong> {user.lastName || "N/A"}
                              </Text>
                              <Text>
                                  <strong>Email:</strong> {user.email || "N/A"}
                              </Text>
                              <Text>
                                  <strong>Timestamp:</strong>{" "}
                                  {event.timestamp
                                      ? new Date(event.timestamp).toLocaleString()
                                      : "N/A"}
                              </Text>
                          </Box>
                      );
                  })
              ) : (
                  <Text textAlign="center" mt={10} color="black">
                      No events received yet.
                  </Text>
              )}
          </VStack>
      </Box>
  );
};

export default RealTimeUpdates;
