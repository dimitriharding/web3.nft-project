import React from "react";
import { Box, Image } from "@chakra-ui/react";

const HeroImage = ({ src }) => {
  return (
    <Box px={8} py={1} mx="auto">
      <Box
        w={{ base: "full", md: 10 / 12 }}
        mx="auto"
        mt={20}
        textAlign="center"
      >
        <Image
          w="full"
          rounded="lg"
          shadow="2xl"
          src={src}
          alt="NFT software screenshot"
        />
      </Box>
    </Box>
  );
};

export default HeroImage;
