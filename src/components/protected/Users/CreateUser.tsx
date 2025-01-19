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
import { signup, getRoles } from '../../../service/apiclient';

function CreateUser() {
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
      sessionStorage.setItem('userId', response.user.id); // Assuming user.id represents the user_fk

      setMessage('User created!');
      navigate('/users'); // Redirect to profile page
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
      bg="white"
      color="gray.800"
      width="100vw"
      pt={12}
    >
  <Box
    width="100%"
    maxW="1200px"
    p={8}
    boxShadow="lg"
    borderRadius="md"
    bg="white"
    textAlign="center"
    margin="0 auto"
  >
    <Heading>Create User</Heading>
    <VStack spacing={4}>
      <Input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        bg="white" // Keep background white
        color="black" // Input text color black
        focusBorderColor="black" // Black border on focus
        borderColor="black" // Black border by default
        _placeholder={{ color: "black" }} // Black placeholder
      />
      <Input
        name="lastname"
        placeholder="Lastname"
        value={formData.lastname}
        onChange={handleChange}
        bg="white"
        color="black"
        focusBorderColor="black"
        borderColor="black"
        _placeholder={{ color: "black" }}
      />
      <Input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        bg="white"
        color="black"
        focusBorderColor="black"
        borderColor="black"
        _placeholder={{ color: "black" }}
      />
      <Input
        name="password"
        placeholder="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        bg="white"
        color="black"
        focusBorderColor="black"
        borderColor="black"
        _placeholder={{ color: "black" }}
      />
          <Menu>
            <MenuButton 
              as={Button} 
              rightIcon={<ChevronDownIcon />}
              bg="white"
              color="black"
              focusBorderColor="black"
              borderColor="black"
              >
              {formData.role_fk ? `Role: ${formData.role_fk}` : 'Select Role'}
            </MenuButton>
            <MenuList
              bg="white"
              color="black"
              focusBorderColor="black"
              borderColor="black"
              
            >
              {roles.map((role) => (
                <MenuItem key={role.id} onClick={() => handleRoleSelect(role.id)}>
                  {role.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Button onClick={handleSubmit} colorScheme="teal">
            Create User
          </Button>
          <Text>{message}</Text>
        </VStack>
      </Box>
    </Grid>
  );  
}

export default CreateUser;