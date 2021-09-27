import { Text } from "@chakra-ui/react";

const Subtitle = ({ text }) => {
  return (
    <Text fontSize="2xl" fontWeight="hairline">
      {text}
    </Text>
  );
};

export default Subtitle;
