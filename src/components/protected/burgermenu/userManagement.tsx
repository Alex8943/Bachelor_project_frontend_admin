import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flex,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Text,
  Heading,
  Select,
  Button,
} from '@chakra-ui/react';
import SearchBar from '../Users/searchbar'; // Import your reusable SearchBar component
import {
  getAllUsers,
  getUsersByRole,
  deleteUser,
  showAllDeletedUsers,
} from '../../../service/apiclient';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showBlocked, setShowBlocked] = useState(false);
  const navigate = useNavigate();
  const usersPerPage = 25;

  // Fetch all users or filtered users by role
  const fetchUsers = async (role_fk = '') => {
    try {
      setLoading(true);
      const usersData = role_fk ? await getUsersByRole(role_fk) : await getAllUsers();
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  // Fetch blocked users
  const fetchBlockedUsers = async () => {
    try {
      setLoading(true);
      const blockedUsers = await showAllDeletedUsers();
      setUsers(blockedUsers);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch blocked users');
      console.error('Error fetching blocked users:', error);
      setLoading(false);
    }
  };

  // Handle search results
  const handleSearchResults = (results) => {
    if (results && results.length > 0) {
      setUsers(results);
      setCurrentPage(1);
      setError(null);
    } else {
      setUsers([]);
      setError('No users found. Try a different search term.');
    }
  };

  // Handle user deletion
  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  useEffect(() => {
    if (showBlocked) {
      fetchBlockedUsers();
    } else {
      fetchUsers();
    }
  }, [showBlocked]);

  // Filter users by role
  const handleRoleChange = (event) => {
    const role = event.target.value;
    setSelectedRole(role);
    fetchUsers(role);
  };

  // Toggle between showing blocked and all users
  const toggleBlockedUsers = () => {
    setShowBlocked((prev) => !prev);
    setCurrentPage(1);
  };

  // Pagination controls
  const goToNextPage = () => setCurrentPage((prev) => prev + 1);
  const goToPreviousPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <Flex minHeight="100vh" direction="column" mt={90}>
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" p={4}>
      <Box maxWidth="80%" width="100%" mx="auto" marginRight={200}>
        <Heading as="h1" size="lg" mb={4} textAlign="center" color="blue.600">
          User Management
        </Heading>

        <SearchBar
          searchType="users"
          onSearchResults={handleSearchResults}
        />

        {error && (
          <Text color="red.500" textAlign="center" mb={4}>
            {error}
          </Text>
        )}

        {!error && (
          <>
            <Flex mb={4} alignItems="center">
              <Select
                placeholder="Filter by Role"
                onChange={handleRoleChange}
                value={selectedRole}
                mr={4}
                width="200px"
                color="blue.700"
                borderColor="blue.400"
              >
                <option value="1">Role 1</option>
                <option value="2">Role 2</option>
                <option value="3">Role 3</option>
              </Select>
              <Button colorScheme="gray" onClick={toggleBlockedUsers}>
                {showBlocked ? "Back to All Users" : "Show Blocked Users"}
              </Button>
            </Flex>

            {loading ? (
              <Spinner size="xl" color="blue.500" />
            ) : (
              <TableContainer>
                <Table variant="striped" colorScheme="blue">
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Role</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginatedUsers.map((user) => (
                      <Tr key={user.id}>
                        <Td>{user.id}</Td>
                        <Td>{user.name}</Td>
                        <Td>{user.email}</Td>
                        <Td>{user.Role?.name || 'Unknown'}</Td>
                        <Td>
                          <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={() => navigate(`/update/user/${user.id}`)}
                          >
                            Update
                          </Button>
                          <Button
                            colorScheme="red"
                            size="sm"
                            ml={2}
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}

            <Flex justifyContent="center" mt={4}>
              <Button
                onClick={goToPreviousPage}
                isDisabled={currentPage === 1}
                colorScheme="blue"
                mr={4}
              >
                Previous
              </Button>
              <Button
                onClick={goToNextPage}
                isDisabled={endIndex >= users.length}
                colorScheme="blue"
              >
               Next
                </Button>
              </Flex>
            </>
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default UserManagement;
