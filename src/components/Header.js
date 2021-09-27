import { Text } from "@chakra-ui/react";

const Header = ({ text }) => {
  return (
    <Text
      bgGradient="linear(to-r, red.500, yellow.500)"
      bgClip="text"
      fontSize="6xl"
      fontWeight="extrabold"
    >
      {text}
    </Text>
  );
};

export default Header;
