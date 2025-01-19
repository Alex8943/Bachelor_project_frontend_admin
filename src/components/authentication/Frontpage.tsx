import React, { useState } from 'react';
import { Box, Grid, Heading, Input, Button, Text, VStack } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../service/apiclient';

const FrontPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // <-- Add loading stat

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);  // Start loading
    try {
      const response = await login({ email: formData.email, password: formData.password });

      sessionStorage.setItem('authToken', response.authToken);
      sessionStorage.setItem('userRoleName', response.user.Role.name);
      sessionStorage.setItem('role_fk', response.user.role_fk);
      sessionStorage.setItem('userName', response.user.name);
      sessionStorage.setItem('userEmail', response.user.email);
      sessionStorage.setItem('userId', response.user.id); // Assuming user.id represents the user_fk

      if (response.user.role_fk === 3) {
        setMessage("Customers can't login here");
        setIsLoading(false);  // Stop loading
        return;
      }

      setMessage('Login successful!');
      navigate('/profile');
    } catch (error) {
      setMessage('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);  // Stop loading
    }
  };

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
        color="gray.800"
        textAlign="center"
        alignItems={'center'}
        margin="0 auto"
      >
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <Heading as="h2" size="lg" color="blue.500">
              Welcome Back!
            </Heading>
            <Input
              placeholder="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              borderColor="black"
              _hover={{ borderColor: 'black' }}
              focusBorderColor="black"
              isRequired
              _placeholder={{ color: 'black' }}
            />
            <Input
              placeholder="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              borderColor="black"
              _hover={{ borderColor: 'black' }}
              focusBorderColor="black"
              isRequired
              _placeholder={{ color: 'black' }}
            />
            <Button colorScheme="blue" width="100%" type="submit">
              LOGIN
            </Button>
            {message && (
              <Text textAlign="center" color={message.includes('successful') ? 'green.500' : 'red.500'}>
                {message}
              </Text>
            )}
            <Text textAlign="center" color="blue.500" cursor="pointer">
              Forgot password?
            </Text>
            <Text textAlign="center" color="blue.500" cursor="pointer">
              <Link to="/signup">Don't have an account? Sign Up</Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Grid>
  );
};

export default FrontPage;
