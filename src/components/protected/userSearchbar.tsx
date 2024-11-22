import React, { useState, useEffect } from "react";
import {
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

const UserSearchBar = ({ onSearchResults }) => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState(""); // For debounce

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch users whenever debouncedInput changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (!debouncedInput) return;

      try {
        const result = await searchUsers(debouncedInput); // Make API call for users
        onSearchResults(result);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    };

    fetchUsers();
  }, [debouncedInput, onSearchResults]);

  return (
    <InputGroup
      size="lg"
      borderRadius="full"
      width="100%"
      maxWidth="1400px"
    >
      <InputLeftElement pointerEvents="none">
        <Search2Icon color="blue.600" />
      </InputLeftElement>
      <Input
        type="text"
        placeholder="Search users..."
        border="2px solid"
        borderColor="blue.600"
        borderRadius="full"
        focusBorderColor="blue.400"
        _placeholder={{ color: "blue.400" }}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </InputGroup>
  );
};

export default UserSearchBar;
