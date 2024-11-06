import React from 'react';
import { Box, Grid, Heading, Input, Button, Checkbox, Text, VStack, Center } from '@chakra-ui/react';

const FrontPage = () => {
  return (
    <Grid
      minHeight="100vh"
      templateColumns="1fr"
      alignItems="center"
      justifyContent="center"
      bg="white"

    >
      {/* Centered Sign-in Form */}
      <Box width="100%" maxW="400px" p={8} boxShadow="md" borderRadius="md" marginRight='40px'>
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
            Forgot password?
          </Text>
        </VStack>
      </Box>
    </Grid>
  );
};

export default FrontPage;
