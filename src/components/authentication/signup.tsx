import React, { useState } from 'react';
import { Box, Grid, Heading, Input, Button, Text, VStack } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../service/apiclient';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '', // Changed to "name" to match the database
    lastName: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup({
        name: formData.name,
        lastname: formData.lastName, // Make sure to send "lastname" as the key
        email: formData.email,
        password: formData.password
      });
      setMessage('Signup successful!');
      console.log('Signup response:', response);

      // Store token in local storage if provided
      localStorage.setItem('authToken', response.token);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setMessage('Signup failed. Please try again.');
      console.error('Signup error:', error);
    }
  };

  return (
    <Grid
      minHeight="100vh"
      templateColumns="1fr"
      alignItems="center"
      justifyContent="center"
      bg="white"
    >
      <Box width="100%" maxW="400px" p={8} boxShadow="md" borderRadius="md" marginRight="40px">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <Heading as="h2" size="lg" textAlign="center">
              Sign up
            </Heading>
            <Input
              placeholder="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              placeholder="Last name"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            <Input
              placeholder="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              placeholder="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button colorScheme="blue" width="100%" type="submit">
              SIGN UP
            </Button>
            {message && (
              <Text textAlign="center" color={message.includes('successful') ? 'green.500' : 'red.500'}>
                {message}
              </Text>
            )}
            <Text textAlign="center" color="blue.500" cursor="pointer">
              <Link to="/">Already have an account? Go back</Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Grid>
  );
}

export default SignUp;
