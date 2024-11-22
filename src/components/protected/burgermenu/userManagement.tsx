import React, { useEffect, useState, useCallback } from 'react';
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
import { Link } from 'react-router-dom';
import SearchBar from '../searchbar'; // Import your reusable SearchBar component
import {
  getAllUsers,
  getUsersByRole,
  getOneUser,
  deleteUser,
  showAllDeletedUsers,
  searchUsers,
} from '../../../service/apiclient';

const UserManagement = () => {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]); // All users
  const [specificUsers, setSpecificUsers] = useState({}); // Cached user details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedRole, setSelectedRole] = useState(''); // Selected role for filtering
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [showBlocked, setShowBlocked] = useState(false); // Toggle for showing blocked users
  const navigate = useNavigate();
  const [userRoleName, setUserRoleName] = useState(''); // Role name from access
  const usersPerPage = 25; // Number of users per page

  // Fetch user details (used for caching individual users)
  const fetchUserDetails = async (userId) => {
    if (!specificUsers[userId]) {
      try {
        const user = await getOneUser({ id: userId });
        setSpecificUsers((prevUsers) => ({ ...prevUsers, [userId]: user }));
      } catch (error) {
        console.log('Failed to load user details:', error);
      }
    }
  };

  // Fetch all users or filtered users by role
  const fetchUsers = async (role_fk = '') => {
    try {
      setLoading(true);
      let usersData;
      if (role_fk) {
        usersData = await getUsersByRole(role_fk);
      } else {
        usersData = await getAllUsers();
      }
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
      setUsers(blockedUsers); // Set state to show only blocked users
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch blocked users');
      console.error('Error fetching blocked users:', error);
      setLoading(false);
    }
  };

  // Handle user search
  const handleSearchResults = (results) => {
    console.log('Search results:', results); // Debugging
    if (results && results.length > 0) {
      setUsers(results); // Set users to the search results
      setCurrentPage(1); // Reset pagination
      setError(null); // Clear error message
    } else {
      setUsers([]); // Clear users if no results found
      setError('No users found. Try a different search term.');
    }
  };

  // Handle user deletion
  const handleDelete = async (id) => {
    try {
      await deleteUser(id); // Call API to soft delete the user
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id)); // Remove the deleted user from the list
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  // Access control logic
  const checkAccess = useCallback(async () => {
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
      navigate('/'); // Redirect to login page if token is missing
    }
    try {
      const userRole = localStorage.getItem('userRole');
      const storedRoleName = sessionStorage.getItem('userRoleName');
      if (userRole === '2' || storedRoleName === 'admin') {
        setMessage("Access denied: Admins can't access this page");
        navigate('/dashboard'); // Redirect admins
      } else if (userRole === '1') {
        setUserRoleName(storedRoleName);
      } else {
        setMessage('Access denied: Unrecognized role');
        navigate('/dashboard');
      }
    } catch (error) {
      setMessage('Failed to verify access.');
      console.error('Access check error:', error);
    }
  }, [navigate]);

  // Initial fetch of users
  useEffect(() => {
    checkAccess();
    if (showBlocked) {
      fetchBlockedUsers();
    } else {
      fetchUsers();
    }
  }, [checkAccess, showBlocked]);

  // Filter users by role
  const handleRoleChange = (event) => {
    const role = event.target.value;
    setSelectedRole(role);
    setCurrentPage(1); // Reset pagination
    fetchUsers(role);
  };

  // Toggle blocked users
  const toggleBlockedUsers = () => {
    setShowBlocked((prev) => !prev); // Toggle between all users and blocked users
    setCurrentPage(1); // Reset pagination
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
            searchType="users" // Search logic for users
            onSearchResults={handleSearchResults} // Update users state with search results
          />

          {message && <Text color="green.500" mb={4}>{message}</Text>}
          {error ? (
            <Text color="red.500" textAlign="center" mb={4}>
              {error}
            </Text>
          ) : (
            <>
              {/* Dropdown to filter by role */}
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
                <Button
                  colorScheme={showBlocked ? "gray" : "gray"}
                  onClick={toggleBlockedUsers}
                >
                  {showBlocked ? "Back to All Users" : "Show Blocked Users"}
                </Button>
              </Flex>

              {/* Users Table */}
              {loading ? (
                <Spinner size="xl" color="blue.500" />
              ) : (
                <TableContainer mt={4}>
                  <Table variant="striped" colorScheme="blue">
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>Role</Th>
                        <Th>Updated at</Th>
                        {!showBlocked && <Th>Actions</Th>}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {paginatedUsers.map((user) => (
                        <Tr key={user.id}>
                          <Td>{user.id}</Td>
                          <Td>
                            <Link
                              to={`/user/${user.id}`}
                              style={{ color: 'black', textDecoration: 'underline' }}
                            >
                              {`${user.name} ${user.lastname}`}
                            </Link>
                          </Td>
                          <Td>{user.email}</Td>
                          <Td>{user.Role?.name || 'Unknown'}</Td>
                          <Td>{new Date(user.updatedAt).toLocaleDateString()}</Td>
                          {!showBlocked && (
                            <Td>
                              <Button
                                colorScheme="red"
                                size="sm"
                                onClick={() => handleDelete(user.id)}
                              >
                                Delete
                              </Button>
                            </Td>
                          )}
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}

              {/* Pagination Controls */}
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
