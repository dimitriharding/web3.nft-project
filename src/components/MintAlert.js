import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link,
  Text,
  Box,
  CloseButton,
  Flex,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
const MintAlert = ({
  link,
  message = "Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea.",
}) => {
  return (
    <Flex mx="auto" justifySelf="center" w="50%" h="200px">
      <Alert
        status="success"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
        borderRadius="2xl"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          NFT Minted
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          <Text>
            {message}{" "}
            <Link isExternal color="teal.500" href={link}>
              Here's the link <ExternalLinkIcon mx="2px" />
            </Link>
          </Text>
        </AlertDescription>
      </Alert>
    </Flex>
  );
};

export default MintAlert;
