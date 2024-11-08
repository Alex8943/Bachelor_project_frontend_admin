import React from "react";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

const SearchBar = () => {
  return (
    <InputGroup
      size="lg"
      borderRadius="full"
      width="100%" // Make it as wide as the parent container
      maxWidth="800px" // Set a max width if you want to limit it
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
      />
      <InputRightAddon p={0} border="none">
        <Button
          size="lg"
          colorScheme="blue"
          borderRadius="full"
          borderTopLeftRadius={0}
          borderBottomLeftRadius={0}
          px={6} // Add padding to make the button wider
        >
          Search
        </Button>
      </InputRightAddon>
    </InputGroup>
  );
};

export default SearchBar;