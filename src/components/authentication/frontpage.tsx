import React from 'react';
import { Box, Grid, Heading, Input, Button, Checkbox, Text, VStack, } from '@chakra-ui/react';
import SignUp from './signup';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const FrontPage = () => {
  return (
    <Router>
      <Routes>
        {/* Route for the signup page */}
        <Route path="/signup" element={<SignUp />} />
        {/* Default route for the frontpage */}
        <Route
          path="/"
          element={
            <Grid
              minHeight="100vh"
              templateColumns="1fr"
              alignItems="center"
              justifyContent="center"
              bg="white"
            >
              {/* Centered Sign-in Form */}
              <Box width="100%" maxW="400px" p={8} boxShadow="md" borderRadius="md" marginRight="40px">
                <VStack spacing={4} align="stretch">
                  <Heading as="h2" size="lg" textAlign="center">
                    Welcome back!
                  </Heading>
                  <Input placeholder="Email address" type="email" />
                  <Input placeholder="Password" type="password" />
                  <Checkbox>Remember password</Checkbox>
                  <Button colorScheme="blue" width="100%">
                    SIGN IN
                  </Button>
                  <Text textAlign="center" color="blue.500" cursor="pointer">
                    Forgot password (will work)
                  </Text>
                  <Text textAlign="center" color="blue.500" cursor="pointer">
                    <Link to="/signup">Don't have an account? Sign Up</Link>
                  </Text>
                </VStack>
              </Box>
            </Grid>
        }
        />
      </Routes>
    </Router>
    );
}
export default FrontPage;
