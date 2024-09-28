import { HStack, Image, Button } from "@chakra-ui/react";
import logo from "../../assets/logo.webp";
import ColorModeSwitch from "../ColorModeSwitch";

const NavBar = () => {
    return (
        <HStack justifyContent="space-between" padding="10px">
            <Image src={logo} boxSize="60px" />
            <HStack spacing="24px">
                <ColorModeSwitch />
            </HStack>
        </HStack>
    );
};

export default NavBar;
