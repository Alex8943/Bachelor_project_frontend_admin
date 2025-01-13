import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Heading, Text, VStack, Flex, Grid } from "@chakra-ui/react";
import EventList from "../../components/EventList";

const UserProfile = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userRoleName, setUserRoleName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authToken = sessionStorage.getItem("authToken");
        const storedRoleName = sessionStorage.getItem("role_fk");
        const storedName = sessionStorage.getItem("userName");
        const storedEmail = sessionStorage.getItem("userEmail");

        if (!authToken) {
            navigate("/");
            return;
        }

        setUserName(storedName || "");
        setUserEmail(storedEmail || "");
        setUserRoleName(storedRoleName || "");
        setLoading(false);
    }, [navigate]);

    const handleSignOut = () => {
        sessionStorage.clear();
        navigate("/");
    };

    if (loading) {
        return (
            <Flex minHeight="100vh" justifyContent="center" alignItems="center">
                <Text fontSize="lg" color="gray.600">
                    Loading...
                </Text>
            </Flex>
        );
    }

    return (
        <Grid
            minHeight="100vh"
            templateColumns="1fr"
            alignItems="center"
            justifyContent="center"
            width="100vw"
            bg="white"
            color="gray.800"
        >
            <Box
                width="100%"
                maxW="400px"
                p={8}
                boxShadow="lg"
                borderRadius="md"
                bg="white"
                textAlign="center"
                margin="0 auto"
            >
                <Heading as="h1" size="lg" mb={6} color="blue.500">
                    User Profile
                </Heading>
                <VStack spacing={4} align="stretch">
                    <Box border="1px solid black" p={3} borderRadius="md">
                        <Text fontSize="lg">
                            <strong>Name:</strong> {userName}
                        </Text>
                    </Box>
                    <Box border="1px solid black" p={3} borderRadius="md">
                        <Text fontSize="lg">
                            <strong>Email:</strong> {userEmail}
                        </Text>
                    </Box>
                    <Box border="1px solid black" p={3} borderRadius="md">
                        <Text fontSize="lg">
                            <strong>Role:</strong> {userRoleName || "Unknown"}
                        </Text>
                    </Box>
                    <Button colorScheme="blue" width="100%" onClick={handleSignOut}>
                        Sign Out
                    </Button>
                </VStack>
            </Box>

            {/* Debugging Component */}
            <Box mt={8}>
                <EventList />
            </Box>
        </Grid>
    );
};

export default UserProfile;
