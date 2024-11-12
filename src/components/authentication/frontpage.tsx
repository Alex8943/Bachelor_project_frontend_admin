import React, { useState } from 'react';
import { Box, Grid, Heading, Input, Button, Checkbox, Text, VStack } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../service/apiclient';

const FrontPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [authToken, setAuthToken] = useState(null); 
  const [userRole, setUserRole] = useState(null); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email: formData.email, password: formData.password });
      setAuthToken(response.authToken);
      setUserRole(response.user.role_fk);
  
      // Store session details
      sessionStorage.setItem('authToken', response.authToken);
      sessionStorage.setItem('userRole', response.user.role_fk);
  
      if (response.user.role_fk === 3) {
        setMessage("Customers can't login here");
        return;
      }
  
      setMessage('Login successful!');
      console.log('Auth Token:', sessionStorage.getItem('authToken'));
      console.log('User Role:', sessionStorage.getItem('userRole'));
      
      navigate('/dashboard');
    } catch (error) {
      setMessage('Login failed. Please check your credentials.');
      console.error('Login error:', error);
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
      {/* Centered Sign-in Form */}
      <Box width="100%" maxW="400px" p={8} boxShadow="md" borderRadius="md" marginRight="40px">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <Heading as="h2" size="lg" textAlign="center">
              Welcome back!
            </Heading>
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
            <Checkbox>Remember password</Checkbox>
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
