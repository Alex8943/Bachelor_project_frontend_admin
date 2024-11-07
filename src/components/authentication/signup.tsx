import React from 'react';
import { Box, Grid, Heading, Input, Button, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function SignUp() {
  return (
    <Grid
      minHeight="100vh"
      templateColumns="1fr"
      alignItems="center"
      justifyContent="center"
      bg="white"
    >
      {/* Centered Sign-up Form */}
      <Box width="100%" maxW="400px" p={8} boxShadow="md" borderRadius="md" marginRight="40px">
        <VStack spacing={4} align="stretch">
          <Heading as="h5" size="lg" textAlign="center">
            Signup
          </Heading>
          <Input placeholder="First name" type="text" />
          <Input placeholder="Last name" type="text" />
          <Input placeholder="Email address" type="email" />
          <Input placeholder="Password" type="password" />
          
          <Button colorScheme="blue" width="100%">
            SIGN UP
          </Button>
          <Text textAlign="center" color="black" cursor="pointer">
            Have an account?
          </Text>
          <Text textAlign="center" color="blue.500" cursor="pointer">
            <Link to="/">Go back</Link>
          </Text>
        </VStack>
      </Box>
    </Grid>
  );
}

export default SignUp;
