import { useState } from "react";
import { Input, InputGroup, Icon, InputRightElement, VStack } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { getReviewByTitle } from "../../service/apiclient";

const SearchBar = ({ onSearchResult }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const inputSize = "lg";

  const handleInputChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term) {
      try {
        const review = await getReviewByTitle(term);
        onSearchResult([review]);  // Pass the result back to the parent component
      } catch (error) {
        console.error('Error fetching review:', error);
        onSearchResult([]); // If there's an error, clear the search results
      }
    } else {
      onSearchResult([]);  // If the input is cleared, clear the search results
    }
  };

  return (

      <>
      <VStack
        spacing={8}
        mt={8}
        
      >


    <InputGroup size={inputSize} width="50%">
      <InputRightElement pointerEvents="none">
        <Icon as={SearchIcon} color="gray.400" />
      </InputRightElement>
      <Input
        type="text"
        variant="filled"
        placeholder="Search"
        size={inputSize}
        borderRadius={15}
        value={searchTerm}
        onChange={handleInputChange}
      />
    </InputGroup>
    </VStack>
    </>
   
  );
};

export default SearchBar;