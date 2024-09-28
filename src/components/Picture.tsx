import { Image, Box, Stack, VStack } from '@chakra-ui/react';
import coolPic from '../assets/cool_pic.jpg';  // Import the image

const Picture = () => {
    return (
        <VStack
            spacing={8}
            mt={8}
            w="100%"
        >
        <Stack>
            
            <Image
                src={coolPic}
                alt='Cool Pic'
                width='1700px'
                height='500px'
                objectFit='cover'
                
            />
          
        </Stack>
        </VStack>
        
    );
}

export default Picture;