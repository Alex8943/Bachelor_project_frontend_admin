import { Flex, Box, Link, Text, Icon, HStack, Grid } from '@chakra-ui/react';
import { FaLinkedin } from 'react-icons/fa';

  const footer = () => {
    
    return (

          <Box as="footer" py={4} bg="teal.500" color="white">
            <HStack justifyContent="center" spacing={4}>
              <Text>Connect with me:</Text>
              <Link href="https://www.linkedin.com/in/alexander-stohn-a54b241a3/" isExternal>
                <Icon as={FaLinkedin} boxSize={6} />
              </Link>
            </HStack>
            <Text textAlign="center" mt={2}>
              © {new Date().getFullYear()} All rights reserved.
            </Text>
          </Box>
    )
  }

export default footer
