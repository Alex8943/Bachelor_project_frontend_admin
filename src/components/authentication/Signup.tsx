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
    lastname: '',
    email: '',
    password: '',
    role_fk: '', // Ensure role_fk is numeric
  });

  const [message, setMessage] = useState('');
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();
        if (!rolesData || rolesData.length === 0) {
          setMessage('No roles available. Please contact support.');
        } else {
          setRoles(rolesData);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        setMessage('Failed to fetch roles.');
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleSelect = (role_fk) => {
    setFormData({ ...formData, role_fk: parseInt(role_fk, 10) }); // Convert to integer
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role_fk) {
      setMessage('Please select a role.');
      return;
    }

    try {
      const response = await signup({
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        role_fk: formData.role_fk,
      });

      sessionStorage.setItem('authToken', response.authToken);
      sessionStorage.setItem('userName', response.user.name);
      sessionStorage.setItem('userEmail', response.user.email);
      sessionStorage.setItem('role_fk', response.user.role_fk);
      sessionStorage.setItem('userRoleName', response.user.Role.name);
      sessionStorage.setItem('user_fk', response.user.id); // Assuming user.id represents the user_fk

      setMessage('Signup successful!');
      navigate('/profile'); // Redirect to profile page
    } catch (error) {
      console.error('Signup error:', error);
      setMessage('Signup failed. Please try again.');
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
              name="lastname"
              value={formData.lastname}
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
                border="1px solid black"
                bg="white"
                color="black"
                width="100%"
                _hover={{ bg: 'gray.100' }}
                _focus={{ borderColor: 'black' }}
                textAlign="left"
              >
                {formData.role_fk
                  ? roles.find((r) => r.id === formData.role_fk)?.name || 'Invalid Role'
                  : 'Select role'}
              </MenuButton>

              <MenuList bg="white" borderColor="black">
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <MenuItem
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      _hover={{ bg: 'gray.100' }}
                      bg="white"
                      color="black"
                    >
                      {role.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem bg="white" color="black" disabled>
                    No roles available
                  </MenuItem>
                )}
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
