import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import React from "react";
import { ethers } from "ethers";
import { Button, Stack, Text, Box } from "@chakra-ui/react";
import { FaPlusCircle } from "react-icons/fa";
import MetaMaskIcon from "./components/MetaMaskIcon";
import Header from "./components/Header";
import Subtitle from "./components/SubTitle";
import HeroImage from "./components/HeroImage";
import { useNotification } from "./utils/feedback";
import { FcPicture } from "react-icons/fc";
import Banner from "./components/Banner";

const networks = {
  ["1"]: "Mainnet",
  ["42"]: "Ropsten",
  ["2"]: "Rinkeby",
  ["5"]: "Goerli",
};

import myEpicNft from "./utils/MyEpicNFT.json";
import MintAlert from "./components/MintAlert";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

const App = () => {
  /*
   * Just a state variable we use to store our user's public wallet. Don't forget to import useState.
   */
  const [currentAccount, setCurrentAccount] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [numberOfMints, setNumberOfMints] = React.useState(null);
  const [currentNetwork, setCurrentNetwork] = React.useState("");
  const [mintAlert, setMintAlert] = React.useState(null);

  const { notify } = useNotification();

  const handleCurrentNetwork = () => {
    const networkVersion = window.ethereum.networkVersion;
    if (networkVersion) {
      console.log(networkVersion === "2");
      if (networkVersion.includes("1")) {
        setCurrentNetwork("Mainnet");
        return;
      }

      if (networkVersion.includes("42")) {
        setCurrentNetwork("Ropsten");
        return;
      }

      if (networkVersion.includes("2")) {
        setCurrentNetwork("Rinkeby");
        return;
      }

      if (networkVersion.includes("5")) {
        setCurrentNetwork("Goerli");
        return;
      }
    }
  };

  const handleNumberOfMints = async (contract) => {
    const count = await contract.getTotalNFTsMintedSoFar();
    setNumberOfMints(count.toNumber());
  };

  const checkIfWalletIsConnected = async () => {
    /*
     * First make sure we have access to window.ethereum
     */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    /*
     * Check if we're authorized to access the user's wallet
     */
    const accounts = await ethereum.request({ method: "eth_accounts" });

    /*
     * User can have multiple authorized accounts, we grab the first one if its there!
     */
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);

      handleCurrentNetwork();

      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      setupEventListener();
    } else {
      console.log("No authorized account found");
    }
  };

  /*
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        notify({
          title: "Get MetaMask!",
          description: "You need a crypto wallet to interact with this website",
          status: "error",
        });
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      handleCurrentNetwork();

      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        await handleNumberOfMints(connectedContract);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          // alert(
          //   `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          // );
          setMintAlert(
            `https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    setIsLoading(true);
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining...please wait.");
        await nftTxn.wait();

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
        notify({
          title: "NFT Minted!",
          description: "You have successfully minted your NFT",
          status: "success",
        });
        await handleNumberOfMints(connectedContract);
        setIsLoading(false);
      } else {
        console.log("Ethereum object doesn't exist!");
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      notify({
        title: "Minting Error!",
        description: error.message,
        status: "error",
      });
      setIsLoading(false);
    }
  };

  /*
   * We want the "Connect to Wallet" button to dissapear if they've already connected their wallet!
   */
  const renderMintUI = () => (
    <>
      <Stack
        direction={{ base: "column", sm: "row" }}
        mb={{ base: 4, md: 8 }}
        spacing={2}
        justifyContent={{ sm: "left", md: "center" }}
      >
        <Button
          size="lg"
          rightIcon={<FaPlusCircle />}
          color="white"
          fontWeight="bold"
          borderRadius="md"
          onClick={askContractToMintNft}
          bgGradient="linear(to-r, teal.500, green.500)"
          isLoading={isLoading}
          isDisabled={!currentNetwork === "Rinkeby"}
        >
          Mint NFT
        </Button>

        <Button
          as="a"
          colorScheme="gray"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          w={{ base: "full", sm: "auto" }}
          mb={{ base: 2, sm: 0 }}
          size="lg"
          cursor="pointer"
          rightIcon={<FcPicture />}
          href="https://testnets.opensea.io/collection/dvhnft"
          target="_blank"
        >
          View Collection on OpenSea
        </Button>
      </Stack>
    </>
  );

  // Render Methods
  const renderNotConnectedContainer = () => (
    <Button
      size="lg"
      leftIcon={<MetaMaskIcon />}
      color="white"
      fontWeight="bold"
      borderRadius="md"
      onClick={connectWallet}
      _hover={{
        bgGradient: "linear(to-r, red.500, yellow.500)",
      }}
    >
      Connect to Wallet
    </Button>
  );

  /*
   * This runs our function when the page loads.
   */
  React.useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      {!currentNetwork === "Rinkeby" && (
        <Banner
          message={`Hey — I see you're connected to ${currentNetwork} but this only works on Rinkeby!`}
        />
      )}
      <div className="container">
        <div className="header-container">
          <Header text="DVH Character Titles NFT Collection" />
          <Subtitle text="Each unique. Each Meaningful. Get Your Character Title Today." />
          <br />
          {currentAccount === ""
            ? renderNotConnectedContainer()
            : renderMintUI()}
        </div>
        {numberOfMints && (
          <Box
            display="flex"
            justifyContent="center"
            alignContent="center"
            alignItems="center"
            direction="row"
          >
            <Text>Minted already:&ensp;</Text>
            <span>
              <Text as="sub">{numberOfMints}</Text>
              <br />
              <Text as="sup">50</Text>
            </span>
          </Box>
        )}
        {mintAlert && <MintAlert link={mintAlert} />}
        <HeroImage src="https://seetyah.s3.amazonaws.com/Screen%20Shot%202021-09-26%20at%204.11.18%20PM.png" />
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE} by`}</a>
          <a
            href="https://twitter.com/irtimid_harding"
            target="_blank"
            rel="noreferrer"
            className="footer-text"
          >
            {`--->  @irtimid_harding`}
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
