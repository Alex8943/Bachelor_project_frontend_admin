import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Input, FormControl, FormLabel, Heading, Text } from '@chakra-ui/react';
import { getOneUser, updateUser } from '../../../service/apiclient';

const UpdateUser = () => {
  const { id } = useParams(); // Get user ID from URL
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    lastname: '',
    email: '',
    role_fk: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch user details when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getOneUser({ id });
        setUser(fetchedUser);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      await updateUser(id, user); // Call the updateUser API
      setMessage('User updated successfully!');
      setTimeout(() => {
        navigate('/users'); // Redirect to /users after a short delay
      }, 2000); // Delay to show the success message
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage('Failed to update user. Please try again.');
    }
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <Box maxWidth="500px" mx="auto" mt={10}>
      <Heading as="h1" size="lg" mb={4} textAlign="center" color="blue.600">
        Update User
      </Heading>

      {message && (
        <Text color={message.includes('successfully') ? 'green.500' : 'red.500'} mb={4}>
          {message}
        </Text>
      )}

      <FormControl mb={4}>
        <FormLabel>Name</FormLabel>
        <Input
          name="name"
          value={user.name}
          onChange={handleChange}
          placeholder="Enter name"
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Last Name</FormLabel>
        <Input
          name="lastname"
          value={user.lastname}
          onChange={handleChange}
          placeholder="Enter last name"
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Role</FormLabel>
        <Input
          name="role_fk"
          value={user.role_fk}
          onChange={handleChange}
          placeholder="Enter role ID"
        />
      </FormControl>

      <Button colorScheme="blue" onClick={handleSubmit} isDisabled={loading}>
        Update
      </Button>
    </Box>
  );
};

export default UpdateUser;
