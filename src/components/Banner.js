import { BellIcon } from "@chakra-ui/icon";
import {
  Box,
  HStack,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import BannerLink from "./BannerLink";

const Banner = ({ message, icon, onClick, label }) => (
  <Box as="section" pt="8" pb="12">
    <Stack
      direction={{ base: "column", sm: "row" }}
      justifyContent="center"
      alignItems="center"
      py="3"
      px={{ base: "3", md: "6", lg: "8" }}
      color="white"
      bg={useColorModeValue("orange.600", "orange.400")}
    >
      <HStack spacing="3">
        <Icon as={icon} fontSize="2xl" h="10" />
        <Text fontWeight="medium" marginEnd="2">
          {message}
        </Text>
      </HStack>
      {label && (
        <BannerLink
          onClick={() => onClick()}
          w={{ base: "full", sm: "auto" }}
          flexShrink={0}
        >
          {label}
        </BannerLink>
      )}
    </Stack>
  </Box>
);

export default Banner;
