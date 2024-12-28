import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { searchReviews, searchUsers } from "../../../service/apiclient"; // Import both search APIs
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onSearchResults, searchType = "reviews" }) => {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedInput, setDebouncedInput] = useState(''); // For debounce
  const navigate = useNavigate();

  const authToken = sessionStorage.getItem('authToken'); // or localStorage.getItem('authToken')
  if (!authToken) {
    navigate('/'); // Redirect to login page if token is missing
  }

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(searchInput);
    }, 500); // 500ms delay

    return () => clearTimeout(timer); // Clear timeout if input changes
  }, [searchInput]);

  useEffect(() => {
    const handleSearch = async () => {
      if (!debouncedInput) return; // Prevent search if input is empty
      try {
        const result = await searchUsers(debouncedInput);
        onSearchResults(result); 
      } catch (error) {
        console.error(`Error searching for ${searchType}:`, error);
      }
    };

    handleSearch();
  }, [debouncedInput, searchType]); // Trigger search when debouncedInput or searchType changes

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
        placeholder={`Search ${searchType}...`}
        border="2px solid"
        borderColor="blue.600"
        borderRadius="full"
        focusBorderColor="blue.400"
        _placeholder={{ color: "blue.400" }}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <InputRightAddon p={0} border="none">
        <Button
          size="lg"
          colorScheme="blue"
          borderRadius="full"
          borderTopLeftRadius={0}
          borderBottomLeftRadius={0}
          px={6}
          onClick={() => setDebouncedInput(searchInput)} // Optional search button
        >
          Search
        </Button>
      </InputRightAddon>
    </InputGroup>
  );
};

export default SearchBar;