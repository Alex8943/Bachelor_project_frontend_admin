import React, { useState } from "react";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { searchReviews } from "../../service/apiclient";

const SearchBar = ({ onSearchResults }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = async () => {
    if (!searchInput) return; // Prevent search if input is empty
    try {
      const result = await searchReviews(searchInput); // Call the API with the search input
      onSearchResults(result); // Pass results to parent component
      
    } catch (error) {
      console.error("Error searching for reviews:", error);
    }
  };

  return (
    <InputGroup
      size="lg"
      borderRadius="full"
      width="100%"
      maxWidth="800px"
    >
      <InputLeftElement pointerEvents="none">
        <Search2Icon color="blue.600" />
      </InputLeftElement>
      <Input
        type="text"
        placeholder="Search..."
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
          onClick={handleSearch} // Trigger search on click
        >
          Search
        </Button>
      </InputRightAddon>
    </InputGroup>
  );
};

export default SearchBar;
