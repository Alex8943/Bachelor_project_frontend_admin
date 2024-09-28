import React from 'react';
import {
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { HamburgerIcon, AddIcon, ExternalLinkIcon, RepeatIcon, EditIcon } from '@chakra-ui/icons';

const Burgermenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
        onClick={onOpen}
      />

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>

          <DrawerBody>
            <VStack align="start">
              <Button leftIcon={<AddIcon />} variant="ghost" w="100%">
                New Tab
              </Button>
              <Button leftIcon={<ExternalLinkIcon />} variant="ghost" w="100%">
                New Window
              </Button>
              <Button leftIcon={<RepeatIcon />} variant="ghost" w="100%">
                Open Closed Tab
              </Button>
              <Button leftIcon={<EditIcon />} variant="ghost" w="100%">
                Open File...
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Burgermenu;