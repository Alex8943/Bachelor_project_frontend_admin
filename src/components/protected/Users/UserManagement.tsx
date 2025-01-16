import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Input,
} from "@chakra-ui/react";
import { getUsers, getUsersByRole, deleteUser, undeleteUser, showAllDeletedUsers } from "../../../service/apiclient";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showBlocked, setShowBlocked] = useState(false);
  const navigate = useNavigate();
  const usersPerPage = 25;

  // Check access on mount
  useEffect(() => {
    const authToken = sessionStorage.getItem("authToken");
    if (!authToken) {
      navigate("/");
    }
  }, [navigate]);

  // Fetch active or deleted users based on `showBlocked` state
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * usersPerPage;

      let usersData;
      if (showBlocked) {
        usersData = await showAllDeletedUsers(usersPerPage, offset);
      } else {
        usersData = await getUsers(usersPerPage, offset);
      }

      setUsers(usersData);
    } catch (error) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users whenever the page or showBlocked changes
  }, [currentPage, showBlocked]);

  // Handle search
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      fetchUsers(); // Reset users if search is cleared
    } else {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUsers(filtered);
    }
    setCurrentPage(1); // Reset to the first page
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      fetchUsers(); // Reset users if input is cleared
    }
  };

  // Handle role filter
  const handleRoleChange = async (event) => {
    const role = event.target.value;
    setSelectedRole(role);
    if (role) {
      try {
        setLoading(true);
        const usersByRole = await getUsersByRole(role);
        setUsers(usersByRole);
      } catch (error) {
        setError("Failed to filter users by role.");
      } finally {
        setLoading(false);
      }
    } else {
      fetchUsers(); // Fetch all users if no role is selected
    }
  };

  const goToNextPage = () => setCurrentPage((prev) => prev + 1);
  const goToPreviousPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUndelete = async (id) => {
    try {
      await undeleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error undeleting user:", error);
    }
  };

  const toggleBlockedUsers = () => {
    setShowBlocked((prev) => !prev);
    setCurrentPage(1); // Reset to the first page
  };

  return (
    <Flex minHeight="100vh" direction="column" mt={90}>
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" p={4} bg="white">
        <Box maxWidth="80%" width="100%" mx="auto">
          <Heading as="h1" size="lg" mb={4} textAlign="center" color="blue.600">
            User Management
          </Heading>

          {/* Search bar */}
          <Flex justifyContent="center" alignItems="center" mb={4}>
            <Box width="70%">
              <Input
                placeholder="Search users by name..."
                value={searchTerm}
                onChange={handleInputChange}
                width="100%"
                border="2px solid"
                borderColor="blue.600"
                borderRadius="full"
                focusBorderColor="blue.400"
                _placeholder={{ color: "blue.400" }}
                textColor="black"
              />
            </Box>
            <Button onClick={handleSearch} colorScheme="blue" ml={2}>
              Search
            </Button>
          </Flex>

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
              onClick={toggleBlockedUsers}
              bg="transparent"
              border="1px solid black"
              color="black"
              _hover={{ bg: "gray.100" }}
            >
              {showBlocked ? "Back to All Users" : "Show Blocked Users"}
            </Button>
          </Flex>

          {loading ? (
            <Spinner size="xl" color="blue.500" />
          ) : error ? (
            <Text color="red.500" textAlign="center" mb={4}>
              {error}
            </Text>
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
                  {users.map((user) => (
                    <Tr key={user.id}>
                      <Td color="black">{user.id}</Td>
                      <Td color="black">{user.name}</Td>
                      <Td color="black">{user.email}</Td>
                      <Td color="black">{user.Role?.name || "Unknown"}</Td>
                      <Td>
                        {showBlocked ? (
                          <Button
                            colorScheme="green"
                            size="sm"
                            onClick={() => handleUndelete(user.id)}
                          >
                            Undelete
                          </Button>
                        ) : (
                          <>
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
                          </>
                        )}
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
              colorScheme="blue"
            >
              Next
            </Button>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};

export default UserManagement;
