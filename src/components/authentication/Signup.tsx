import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Heading,
  Input,
  Button,
  Text,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { signup, getRoles } from '../../service/apiclient';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    role_fk: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleSelect = (roleId) => {
    setFormData({ ...formData, role_fk: roleId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup({
        name: formData.name,
        lastname: formData.lastName,
        role_fk: formData.role_fk,
        email: formData.email,
        password: formData.password,
      });
      setMessage('Signup successful!');
      localStorage.setItem('authToken', response.token);
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
        margin="0 auto"
      >
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <Heading as="h2" size="lg" color="blue.500">
              Sign Up
            </Heading>
            <Input
              placeholder="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              borderColor="black"
              _hover={{ borderColor: 'black' }}
              focusBorderColor="black"
              _placeholder={{ color: 'black' }}
              isRequired
            />
            <Input
              placeholder="Last name"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              borderColor="black"
              _hover={{ borderColor: 'black' }}
              focusBorderColor="black"
              _placeholder={{ color: 'black' }}
              isRequired
            />
            <Input
              placeholder="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              borderColor="black"
              _hover={{ borderColor: 'black' }}
              focusBorderColor="black"
              _placeholder={{ color: 'black' }}
              isRequired
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
              _placeholder={{ color: 'black' }}
              isRequired
            />
            
            <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              border="1px solid black"  // Explicit black border
              bg="white"
              color="black"  // Text color black
              width="100%"
              _hover={{ bg: 'gray.100' }}  // Light gray on hover
              _focus={{ borderColor: 'black' }}  // Ensure focus state has black border
              textAlign="left"
            >
              {formData.role_fk
                ? roles.find((r) => r.id === formData.role_fk)?.name
                : 'Select role'}
            </MenuButton>

              <MenuList bg="white" borderColor="black">
                {roles.map((role) => (
                  <MenuItem
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    _hover={{ bg: 'gray.100' }}
                    bg="white"  // White background
                    color="black"  // Black text
                  >
                    {role.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            <Button colorScheme="blue" width="100%" type="submit">
              SIGN UP
            </Button>
            {message && (
              <Text
                textAlign="center"
                color={message.includes('successful') ? 'green.500' : 'red.500'}
              >
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
