import React from 'react';
import { VStack } from '@chakra-ui/react';
import {
  Button,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  useDisclosure,
} from '@chakra-ui/react';

const Login = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Login</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Input placeholder="Email" mb={4} />
        <Input placeholder="Password" type="password" />
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="teal" mr={3} onClick={onClose}>
          Login
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

const SignUp = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Sign Up</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Input placeholder="Username" mb={4} />
        <Input placeholder="Email" mb={4} />
        <Input placeholder="Password" type="password" mb={4} />
        <Input placeholder="Confirm Password" type="password" />
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="teal" mr={3} onClick={onClose}>
          Sign Up
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

const LoginButton = () => {
  const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
  const { isOpen: isSignUpOpen, onOpen: onSignUpOpen, onClose: onSignUpClose } = useDisclosure();

  return (
    <>
    <VStack
      spacing={8}
      mt={8}
      >
     
      <Stack direction="row" spacing={4} align="center">
        <Button colorScheme="teal" variant="outline" onClick={onLoginOpen}>
          Login
        </Button>
        <Button colorScheme="teal" variant="solid" onClick={onSignUpOpen}>
          Sign Up
        </Button>
      </Stack>

      <Login isOpen={isLoginOpen} onClose={onLoginClose} />
      <SignUp isOpen={isSignUpOpen} onClose={onSignUpClose} />

      </VStack>
    </>
  );
};

export default LoginButton;
