import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Grid,
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
  Flex,
  Button,
  Input,
  Select,
  Heading,
} from "@chakra-ui/react";
import { getUsers, deleteUser, undeleteUser, showAllDeletedUsers } from "../../../service/apiclient";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showBlocked, setShowBlocked] = useState(false);
  const [loggedInUserRoleName, setLoggedInUserRoleName] = useState(null);
  const [loggedInUserRoleId, setLoggedInUserRoleId] = useState(null);
  const [filterRoleFk, setFilterRoleFk] = useState(null); // New state for role filtering
  const navigate = useNavigate();
  const usersPerPage = 25;

  // Check access on mount and fetch logged-in user's role
  useEffect(() => {
    const authToken = sessionStorage.getItem("authToken");
    const storedRoleName = sessionStorage.getItem("userRoleName");
    const storedRoleId = sessionStorage.getItem("userRole");

    if (!authToken) {
      navigate("/");
      return;
    }

    setLoggedInUserRoleName(storedRoleName);
    setLoggedInUserRoleId(parseInt(storedRoleId, 10));
  }, [navigate]);

  // Fetch users based on `showBlocked` and `filterRoleFk` state
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

      // Apply role filtering for "Super Admin"
      if (loggedInUserRoleName === "Super Admin" && filterRoleFk) {
        usersData = usersData.filter((user) => user.role_fk === parseInt(filterRoleFk, 10));
      }

      setUsers(usersData);
    } catch (error) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, showBlocked, filterRoleFk]); // Fetch users whenever these change

  const handleRoleFilterChange = (e) => {
    const value = e.target.value;
    setFilterRoleFk(value);
    setCurrentPage(1); // Reset to the first page
  };

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      fetchUsers();
    } else {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUsers(filtered);
    }
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      fetchUsers();
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
    setCurrentPage(1);
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
      pt={12} // Same as Dashboard component
    >
      <Box
        width="100%"
        maxW="1200px" // Same max width as Dashboard
        p={8}
        boxShadow="lg"
        borderRadius="md"
        bg="white"
        textAlign="center"
        margin="0 auto"
      >
        <Heading as="h1" size="lg" mb={6} color="blue.500">
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

        {loggedInUserRoleName === "Super Admin" && (
          <Flex justifyContent="center" mb={4}>
            <Select
              placeholder="Filter by Role"
              width="200px"
              color="blue.700"
              borderColor="blue.400"
              onChange={handleRoleFilterChange}
            >
              <option value="1">Super Admin</option>
              <option value="2">Admin</option>
              <option value="3">Customer</option>
            </Select>
          </Flex>
        )}

        <Flex justifyContent="center" mb={4}>
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
          <TableContainer mt={4} bg="blue.50" borderRadius="md" boxShadow="md">
            <Table variant="striped" colorScheme="blue" width="100%">
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
                    <Td>{user.id}</Td>
                    <Td>
                      <Link
                        to={`/user/${user.id}`}
                        style={{ color: "blue", textDecoration: "underline" }}
                      >
                        {user.name}
                      </Link>
                    </Td>
                    <Td>{user.email}</Td>
                    <Td>{user.Role?.name || "Unknown"}</Td>
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
                          {(loggedInUserRoleName === "Super Admin" ||
                            (loggedInUserRoleName === "Admin" &&
                              user.Role?.name === "Customer")) && (
                            <>
                              <Button
                                colorScheme="blue"
                                size="sm"
                                onClick={() => navigate(`/update/user/${user.id}`)}
                                mr={2}
                              >
                                Update
                              </Button>
                              <Button
                                colorScheme="red"
                                size="sm"
                                onClick={() => handleDelete(user.id)}
                              >
                                Delete
                              </Button>
                            </>
                          )}
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
    </Grid>
  );
};

export default UserManagement;
