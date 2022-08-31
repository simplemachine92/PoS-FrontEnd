import { Menu, Affix, Drawer, Button, Spin } from "antd";
import "antd/dist/antd.css";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, get, child } from "firebase/database";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import React, { useCallback, useEffect, useState } from "react";
import {
  HomeOutlined,
  HighlightOutlined,
  UserOutlined,
  BookOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { ReactComponent as LogoSVG } from "./assets/lego.svg";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { Link, Route, useLocation } from "react-router-dom";
import "./App.css";
import { Account, NetworkDisplay, SignatureDisplay } from "./components";
import { NETWORKS, ALCHEMY_KEY } from "./constants";
import externalContracts from "./contracts/external_contracts";
// contracts
import deployedContracts from "./contracts/hardhat_contracts.json";
import { Transactor, Web3ModalSetup } from "./helpers";
import { useStaticJsonRPC } from "./hooks";
import SignatorViewer from "./SignatorViewer";
import styled from "styled-components";
import Profile from "./views/Profile";
import { Suspense } from "react";
import { CustomSwitch, Waitlist2, Waitlist, AfterPledge, Maintenance } from "./components";
import { Home, Pledge, Order, SignatureList, Sign } from "./views";

export const StyledMenu = styled(Menu)`
  height: 100%;
  background: #7ee6cd;
  border-width: 0px;
  &:hover {
    color: #fff871;
    background: #7ee6cd;
    border-color: red;
  }
`;

const { ethers } = require("ethers");
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/scaffold-eth/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Alchemy.com & Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

/// 📡 What chain are your contracts deployed to?
const initialNetwork = NETWORKS.mainnet; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = false;
const NETWORKCHECK = true;
const USE_BURNER_WALLET = false; // toggle burner wallet feature
const USE_NETWORK_SELECTOR = false;

const web3Modal = Web3ModalSetup();

// 🛰 providers
const providers = [
  /* "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406", */
  process.env.REACT_APP_ANKR,
];

function App(props) {
  // specify all the chains your app is available on. Eg: ['localhost', 'mainnet', ...otherNetworks ]
  // reference './constants.js' for other networks
  const networkOptions = [initialNetwork.name, "localhost"];
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [visible, setVisible] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);
  const location = useLocation();

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };

  const targetNetwork = initialNetwork;

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  // load all your providers
  const localProvider = useStaticJsonRPC([providers[0]]);

  const mainnetProvider = useStaticJsonRPC([providers[0]]);

  if (DEBUG) console.log(`Using ${selectedNetwork} network`);

  // 🛰 providers
  if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, USE_BURNER_WALLET);
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  // const contractConfig = useContractConfig();

  const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  const events = "";
  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig);

  // If you want to call a function on a new block
  /* useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  }); */

  // keep track of a variable from the contract in the local React state:
  const tokenId = useContractReader(
    readContracts,
    "ProofOfStake_Pages",
    "tokenOfOwnerByIndex",
    [address, "0"],
    60000,
    null,
  );
  /* console.log("purpose", purpose); */

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      yourLocalBalance &&
      yourMainnetBalance &&
      readContracts &&
      writeContracts &&
      mainnetContracts
    ) {
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("📝 readContracts", readContracts);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance,
    yourMainnetBalance,
    readContracts,
    writeContracts,
    mainnetContracts,
  ]);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      logoutOfWeb3Modal();
    });
  }, [setInjectedProvider]);

  const [chainList, setChainList] = useState([]);

  useEffect(() => {
    const getChainList = async () => {
      try {
        const rawChainList = await fetch("https://chainid.network/chains.json");
        const chainListJson = await rawChainList.json();

        setChainList(chainListJson);
      } catch (e) {
        console.log(e);
      }
    };
    getChainList();
  }, []);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const [ready, setReady] = useState(false);
  const [ready2, setReady2] = useState(false);
  const [sData, setData] = useState();
  const [uMessage, setMessage] = useState();

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const myData = [];

  useEffect(async () => {
    const dbRef = ref(getDatabase(app));
    get(child(dbRef, `PoS/`))
      .then(snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(sig => {
            const message = sig.val().message;

            const sigMsg = message.msg;
            const sigRecipient = message.recipient;
            const pledgeValue = message.pledge;
            const sigTime = message.timestamp;
            message.signature = sig.val().signature;
            message.typedData = sig.val().typedData;

            const svgBoiler = `<svg xmlns="http://www.w3.org/2000/svg" width="7.94in" height="10.59in" viewBox="-35 -25 571.46 762.2"><circle cx="255.76" cy="99.98" r="99.48" fill="#f6cf46" stroke="#000" stroke-miterlimit="10"/><g><path d="M233.66,179c.2,19.13,17.69,31.14,33.65,27.52,7.41-1.67,13-5.68,17.65-11.49,6.86-8.63,13.79-17.2,20.68-25.81Q317.33,154.6,329,140c4.8-6,7.36-12.8,6.57-20.46-1.26-12.29-7.75-20.74-19.65-24.61-11-3.59-22.5-.1-30.22,9.08-3.18,3.79-6.21,7.71-9.31,11.58-11.9,14.83-23.75,29.69-35.69,44.48C236.21,165.61,233.58,171.77,233.66,179Z" transform="translate(-30.92 -49.36)" fill="#fff"/><path d="M233.66,179c-.08-7.2,2.55-13.36,7-18.9,11.94-14.79,23.79-29.65,35.69-44.48,3.1-3.87,6.13-7.79,9.31-11.58,7.72-9.18,19.21-12.67,30.22-9.08,11.9,3.87,18.39,12.32,19.65,24.61.79,7.66-1.77,14.47-6.57,20.46q-11.7,14.58-23.35,29.19C298.75,177.8,291.82,186.37,285,195c-4.61,5.81-10.24,9.82-17.65,11.49C251.35,210.11,233.86,198.1,233.66,179Zm30.71-42.21c-8.09,10.36-16.3,20-23.43,30.3-5,7.2-4.35,15.43-.38,23.29a10.9,10.9,0,0,0,7.62,6c10.15,2.43,18.7-.28,25.35-8.29s13.22-16.43,19.81-24.67a25.9,25.9,0,0,0,1.41-2.28Zm33.46,20.84c7.89-10,15.69-19.11,22.6-28.86,5.31-7.48,5.08-15.89.93-24.11a10.42,10.42,0,0,0-7.17-5.82c-10.15-2.51-18.68.1-25.4,8.09-4.83,5.75-9.42,11.69-14.11,17.56-2.27,2.85-4.52,5.71-7.06,8.92Zm-37.9,44.66c8.86.25,15.8-3.18,21.19-10,6-7.65,12.13-15.22,18.19-22.84a23.88,23.88,0,0,0,1.44-2.23c-1.63-2.57-2.91-1.67-4.21-.05-5,6.22-10.15,12.31-14.93,18.69-5.59,7.46-11.94,13.71-21.39,15.88C260.13,201.69,260.08,201.93,259.93,202.26Zm69.75-86.92c0,8.65-3.87,15.58-9.24,22-5,6-9.83,12.17-14.71,18.29-1.17,1.47-2.25,3-3.25,4.37.78,1.86,1.74,2.43,3.09,1.29a17.65,17.65,0,0,0,2.25-2.47c5.41-6.71,10.83-13.42,16.18-20.18a42.38,42.38,0,0,0,4.07-5.9A21.3,21.3,0,0,0,329.68,115.34Z" transform="translate(-30.92 -49.36)"/><path d="M264.37,136.76l30.38,24.36a25.9,25.9,0,0,1-1.41,2.28c-6.59,8.24-13.08,16.56-19.81,24.67s-15.2,10.72-25.35,8.29a10.9,10.9,0,0,1-7.62-6c-4-7.86-4.6-16.09.38-23.29C248.07,156.72,256.28,147.12,264.37,136.76Z" transform="translate(-30.92 -49.36)" fill="#01e2ac"/><path d="M297.83,157.6l-30.21-24.22c2.54-3.21,4.79-6.07,7.06-8.92,4.69-5.87,9.28-11.81,14.11-17.56,6.72-8,15.25-10.6,25.4-8.09a10.42,10.42,0,0,1,7.17,5.82c4.15,8.22,4.38,16.63-.93,24.11C313.52,138.49,305.72,147.61,297.83,157.6Z" transform="translate(-30.92 -49.36)" fill="#5bf1cd"/><path d="M259.93,202.26c.15-.33.2-.57.29-.59,9.45-2.17,15.8-8.42,21.39-15.88,4.78-6.38,9.95-12.47,14.93-18.69,1.3-1.62,2.58-2.52,4.21.05a23.88,23.88,0,0,1-1.44,2.23c-6.06,7.62-12.17,15.19-18.19,22.84C275.73,199.08,268.79,202.51,259.93,202.26Z" transform="translate(-30.92 -49.36)" fill="#12c094"/><path d="M329.68,115.34a21.3,21.3,0,0,1-1.61,17.38,42.38,42.38,0,0,1-4.07,5.9c-5.35,6.76-10.77,13.47-16.18,20.18a17.65,17.65,0,0,1-2.25,2.47c-1.35,1.14-2.31.57-3.09-1.29,1-1.35,2.08-2.9,3.25-4.37,4.88-6.12,9.67-12.31,14.71-18.29C325.81,130.92,329.66,124,329.68,115.34Z" transform="translate(-30.92 -49.36)" fill="#12c094"/></g><text transform="translate(0 282.85)" font-size="18" font-family="ArialMT, Arial">{<tspan x="0" y="28.8">"signer": 0x00de4b13153673bcae2616b67bf822500d325fc3,</tspan><tspan x="0" y="57.6" xml:space="preserve">"timestamp": ${sigTime},</tspan><tspan x="0" y="86.4" xml:space="preserve">"recipient": ${sigRecipient},</tspan><tspan x="0" y="115.2">"pledge": ${pledgeValue} ETH,</tspan><tspan x="0" y="144">"version": 0,</tspan><tspan x="0" y="172.8">},</tspan><tspan x="0" y="230.4">"msg": ${sigMsg}</tspan></text></svg>`;

            const encodedData = btoa(svgBoiler);

            const dataURI = "data:image/svg+xml;base64," + encodedData;

            message.imageData = dataURI;

            myData.push(message);
          });
          setData(myData);
          setReady(true);
        } else {
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, [tokenId, address, readContracts]);

  useEffect(async () => {
    if (tokenId && readContracts.ProofOfStake_Pages && address) {
      const nId = await readContracts.ProofOfStake_Pages.tokenOfOwnerByIndex(address, "0");
      const token = await readContracts.ProofOfStake_Pages.tokenURI(nId);
      const json = atob(token.substring(29));
      const result = JSON.parse(json);

      setMessage(result.message);
    }
    setReady2(true);
  }, [tokenId, address, readContracts, sData]);

  return (
    <div className="App">
      {loading ? (
        <div className="w-full h-screen">
          <div className="h-screen w-1/2 sm:w-1/4 sm:mt-0 md:w-5/12 mx-auto flex justify-center items-center">
            <svg
              className="w-1/2 sm:mt-0 md:w-5/12 mx-auto animate-spin"
              width="500"
              height="500"
              viewBox="0 0 115 115"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M57.5001 114.999C25.7439 114.999 -2.28882e-05 89.2561 -2.28882e-05 57.4999C-2.28882e-05 25.7436 25.7439 0 57.5001 0C89.2564 0 115 25.7436 115 57.4999C115 89.2561 89.2564 114.999 57.5001 114.999Z"
                fill="#40C9A8"
              />
              <path
                d="M71.6438 48.1145C73.5629 50.9931 74.7623 54.3516 74.7623 57.7101C74.7623 61.0685 73.5629 64.427 71.6438 67.3057L75.722 70.4242C78.3608 66.8259 79.8001 62.268 79.8001 57.7101C79.8001 52.9123 78.3607 48.3544 75.482 44.5161L73.0831 46.6752L71.6438 48.1145Z"
                fill="#E6FFF9"
              />
              <path
                d="M79.5547 73.3003L65.4013 62.5053C66.3609 61.066 67.0804 59.6267 67.0804 57.9475C67.0804 56.2682 66.6007 54.589 65.881 53.1497L72.598 47.1524L79.5547 40.6754C80.0345 40.1956 80.0345 39.4759 79.5547 38.9961L78.5953 38.0365C73.5576 32.9988 66.8406 30.1202 59.6439 29.8803V26.042C59.6439 25.8021 59.6439 25.5622 59.6439 25.3223C59.6439 25.0824 59.404 24.8426 59.1641 24.6027C58.9242 24.3628 58.6843 24.3628 58.4445 24.1229C58.2046 24.1229 57.9647 23.8831 57.7248 23.8831C57.4849 23.8831 57.2451 23.883 57.0052 24.1229C56.7653 24.1229 56.5253 24.3628 56.2854 24.6027C56.0455 24.8426 56.0456 25.0824 55.8057 25.3223C55.8057 25.5622 55.8057 25.8021 55.8057 26.042V30.1201C54.1265 30.36 52.4472 30.6 50.7679 31.0798V26.042C50.7679 25.8021 50.7679 25.5622 50.7679 25.3223C50.7679 25.0824 50.528 24.8426 50.2881 24.6027C50.0482 24.3628 49.8084 24.3628 49.5685 24.1229C49.3286 24.1229 49.0887 23.8831 48.8489 23.8831C48.609 23.8831 48.3691 23.883 48.1292 24.1229C47.8893 24.1229 47.6495 24.3628 47.4096 24.6027C47.1697 24.8426 47.1697 25.0824 46.9298 25.3223C46.9298 25.5622 46.9298 25.8021 46.9298 26.042V32.2792C41.1724 34.918 36.3745 39.4759 33.4958 44.9934C30.6171 50.5108 29.6576 57.2277 30.8571 63.2249C32.0565 69.4621 35.4151 74.9796 40.2129 79.0578C45.0107 83.1359 51.2477 85.5348 57.4848 85.5348H77.8755C78.5952 85.5348 79.0749 85.055 79.0749 84.3354V74.02C80.0345 74.02 79.7946 73.5402 79.5547 73.3003ZM58.6843 80.737C53.6466 80.737 48.8488 79.0578 44.7707 75.9392C40.6926 72.8207 38.0539 68.5025 36.6145 63.7047C35.4151 58.9069 35.6549 53.6294 37.574 49.0715C39.4931 44.5136 42.8517 40.4354 47.4096 38.0365V45.4732C47.4096 45.7131 47.4096 45.9529 47.4096 46.1928C47.4096 46.4327 47.6493 46.6726 47.8892 46.9124C48.1291 47.1523 48.3691 47.1524 48.609 47.3923C48.8489 47.3923 49.0888 47.6321 49.3287 47.6321C49.5686 47.6321 49.8084 47.6321 50.0483 47.3923C50.2882 47.3923 50.5281 47.1523 50.7679 46.9124C51.0078 46.6726 51.0079 46.4327 51.2478 46.1928C51.2478 45.9529 51.2478 45.7131 51.2478 45.4732V36.1174C53.6467 35.1578 56.5253 34.6781 59.1641 34.6781C64.2018 34.6781 68.9996 36.3573 72.8379 39.2359C73.0777 39.4758 73.0777 39.9557 72.8379 40.1956L62.0428 50.031C61.0832 49.5512 59.8838 49.3113 58.9243 49.3113C57.7248 49.3113 56.5253 49.5512 55.5657 50.031C54.3663 50.5108 53.4067 51.2305 52.687 52.1901C51.9674 53.1496 51.2478 54.1091 51.0079 55.3086C50.768 56.508 50.5281 57.7075 50.7679 58.9069C51.0078 60.1064 51.2477 61.3059 51.9674 62.2655C52.6871 63.225 53.4067 64.1846 54.3663 64.6644C55.3259 65.384 56.5254 65.6239 57.7248 65.8638C58.9243 66.1037 60.1237 65.8637 61.3232 65.6238L74.9969 75.9392C75.2368 75.9392 75.2368 76.179 75.2368 76.4189V80.0172C75.2368 80.2571 74.9968 80.4971 74.7569 80.4971L58.6843 80.737ZM62.0428 57.9475C62.0428 58.6671 61.8029 59.1469 61.563 59.8666C61.0832 60.3463 60.6035 60.8261 60.1237 61.066C59.404 61.3059 58.9243 61.3058 58.2046 61.3058C57.485 61.066 57.0051 60.8262 56.5254 60.3464C56.0456 59.8666 55.8056 59.3868 55.5657 58.6671C55.5657 57.9474 55.5658 57.4677 55.8057 56.748C56.0456 56.0284 56.5254 55.5485 57.0052 55.3086C57.485 55.0687 58.2046 54.8288 58.9243 54.8288C59.8838 54.8288 60.6035 55.0687 61.3232 55.7884C61.8029 56.2682 62.0428 56.9879 62.0428 57.9475Z"
                fill="#E6FFF9"
              />
            </svg>
            <div className="text-2xs sm:text-xs md:text-base lg:text-lg animate-pulse mx-auto">Welcome, anon...</div>
          </div>
        </div>
      ) : (
        <div className="App">
          <Affix>
            <NetworkDisplay
              NETWORKCHECK={NETWORKCHECK}
              localChainId={localChainId}
              selectedChainId={selectedChainId}
              targetNetwork={targetNetwork}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
            />
            <SignatureDisplay
              NETWORKCHECK={NETWORKCHECK}
              address={address}
              localChainId={localChainId}
              selectedChainId={selectedChainId}
              firebaseConfig={firebaseConfig}
              targetNetwork={targetNetwork}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
              tokenId={tokenId}
              readContracts={readContracts}
              ready={ready}
              ready2={ready2}
              uMessage={uMessage}
              sData={sData}
            />
            <StyledMenu
              className="hidden justify-start items-center md:flex"
              selectedKeys={[location.pathname]}
              mode="horizontal"
              collapsedWidth="0"
            >
              <Menu.Item
                key="Home"
                style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                className="modified-item transform transition hover:scale-110 duration-300 ease-in-out"
                icon={<LogoSVG />}
              >
                <Link to="/"></Link>
              </Menu.Item>
              <Menu.Item
                style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                key="mail"
                className="modified-item"
                icon={<BookOutlined />}
              >
                Donate & Mint
                <Link to="/pledge"></Link>
              </Menu.Item>
              <Menu.Item
                style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                key="order"
                className="modified-item"
                icon={<ShoppingCartOutlined />}
              >
                Pre-Order
                <Link to="/order"></Link>
              </Menu.Item>
              <Menu.Item
                style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                key="donations"
                className="modified-item"
                icon={<DollarCircleOutlined />}
              >
                Donors
                <Link to="/donations"></Link>
              </Menu.Item>
              <Menu.Item
                style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                key="signatures"
                className="modified-item"
                icon={<HighlightOutlined />}
              >
                Signatures
                <Link to="/signatures"></Link>
              </Menu.Item>

              <Menu.Item
                style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                key="profile"
                className="modified-item"
                icon={<UserOutlined />}
              >
                Profile
                <Link to="/profile"></Link>
              </Menu.Item>

              <Menu.Item style={{ marginLeft: "auto" }} className="modified-item">
                <div>
                  {USE_NETWORK_SELECTOR && <div style={{ marginRight: 20 }}></div>}
                  <Account
                    useBurner={USE_BURNER_WALLET}
                    address={address}
                    localProvider={localProvider}
                    userSigner={userSigner}
                    mainnetProvider={mainnetProvider}
                    price={price}
                    web3Modal={web3Modal}
                    loadWeb3Modal={loadWeb3Modal}
                    logoutOfWeb3Modal={logoutOfWeb3Modal}
                    blockExplorer={blockExplorer}
                  />
                </div>
              </Menu.Item>
            </StyledMenu>

            <div className="flex md:hidden justify-between p-2" style={{ background: "#7ee6cd" }}>
              <button
                onClick={() => setVisible(true)}
                className="flex flex-col w-10 justify-center items-center bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
              >
                <div className="h-1 w-5 bg-black rounded-md mt-1 mb-1" />
                <div className="h-1 w-5 bg-black rounded-md mb-1" />
                <div className="h-1 w-5 bg-black rounded-md mb-1" />
              </button>
              <Drawer
                bodyStyle={{ background: "#7ee6cd", paddingTop: "3rem" }}
                placement="left"
                visible={visible}
                onClose={() => setVisible(false)}
              >
                <Menu className="bg-primary border-none font-bold">
                  <Menu.Item
                    className="flex justify-start items-center"
                    onClick={() => setVisible(false)}
                    key="Home"
                    icon={<HomeOutlined />}
                  >
                    Home
                    <Link to="/"></Link>
                  </Menu.Item>
                  <Menu.Item
                    className="flex justify-start items-center"
                    onClick={() => setVisible(false)}
                    key="mail"
                    icon={<BookOutlined />}
                  >
                    Donate & Mint
                    <Link to="/pledge"></Link>
                  </Menu.Item>
                  <Menu.Item
                    className="flex justify-start items-center"
                    onClick={() => setVisible(false)}
                    key="order"
                    icon={<ShoppingCartOutlined />}
                  >
                    Pre-Order
                    <Link to="/order"></Link>
                  </Menu.Item>
                  <Menu.Item
                    className="flex justify-start items-center"
                    onClick={() => setVisible(false)}
                    key="donations"
                    icon={<DollarCircleOutlined />}
                  >
                    Donors
                    <Link to="/donations"></Link>
                  </Menu.Item>
                  <Menu.Item
                    className="flex justify-start items-center"
                    onClick={() => setVisible(false)}
                    key="signatures"
                    icon={<HighlightOutlined />}
                  >
                    Signatures
                    <Link to="/signatures"></Link>
                  </Menu.Item>
                  <Menu.Item
                    className="flex justify-start items-center"
                    onClick={() => setVisible(false)}
                    key="profile"
                    icon={<UserOutlined />}
                  >
                    Your Profile
                    <Link to="/profile"></Link>
                  </Menu.Item>
                </Menu>
              </Drawer>
              <div>
                <div>
                  {USE_NETWORK_SELECTOR && <div style={{ marginRight: 20 }}></div>}
                  <Account
                    useBurner={USE_BURNER_WALLET}
                    address={address}
                    localProvider={localProvider}
                    userSigner={userSigner}
                    mainnetProvider={mainnetProvider}
                    price={price}
                    web3Modal={web3Modal}
                    loadWeb3Modal={loadWeb3Modal}
                    logoutOfWeb3Modal={logoutOfWeb3Modal}
                    blockExplorer={blockExplorer}
                  />
                </div>
                {/* {yourLocalBalance.lte(ethers.BigNumber.from("0")) && (
      <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
    )} */}
              </div>
            </div>
          </Affix>
          <CustomSwitch>
            <Route exact path="/">
              {/* pass in any web3 props to this Home component. For example, yourLocalBalance */}
              <Home
                yourLocalBalance={yourLocalBalance}
                writeContracts={writeContracts}
                readContracts={readContracts}
                tx={tx}
                localProvider={localProvider}
                address={address}
              />
            </Route>
            <Route path="/pledge">
              <Pledge
                yourLocalBalance={yourLocalBalance}
                writeContracts={writeContracts}
                readContracts={readContracts}
                tx={tx}
                localProvider={localProvider}
                loadWeb3Modal={loadWeb3Modal}
                address={address}
              />
            </Route>
            <Route path="/donations">
              <Waitlist2
                yourLocalBalance={yourLocalBalance}
                mainnetProvider={mainnetProvider}
                writeContracts={writeContracts}
                readContracts={readContracts}
                firebaseConfig={firebaseConfig}
                tx={tx}
                localProvider={localProvider}
                loadWeb3Modal={loadWeb3Modal}
                address={address}
                events={events}
                visible={visible}
              />
            </Route>
            <Route path="/complete">
              <AfterPledge
                yourLocalBalance={yourLocalBalance}
                writeContracts={writeContracts}
                readContracts={readContracts}
                tx={tx}
                localProvider={localProvider}
                loadWeb3Modal={loadWeb3Modal}
                address={address}
                tokenId={tokenId}
              />
            </Route>
            <Route path="/view">
              <SignatorViewer
                mainnetProvider={mainnetProvider}
                injectedProvider={injectedProvider}
                address={address}
                loadWeb3Modal={loadWeb3Modal}
                chainList={chainList}
                writeContracts={writeContracts}
                readContracts={readContracts}
                tx={tx}
                firebaseConfig={firebaseConfig}
              />
            </Route>
            <Route path="/pledge">
              <Pledge
                yourLocalBalance={yourLocalBalance}
                writeContracts={writeContracts}
                readContracts={readContracts}
                tx={tx}
                localProvider={localProvider}
                address={address}
              />
            </Route>
            <Route path="/order">
              <Order
                yourLocalBalance={yourLocalBalance}
                writeContracts={writeContracts}
                readContracts={readContracts}
                tx={tx}
                localProvider={localProvider}
                address={address}
              />
            </Route>
            <Route path="/signatures">
              <Maintenance />
              {/* <SignatureList
                address={address}
                yourLocalBalance={yourLocalBalance}
                mainnetProvider={mainnetProvider}
                price={price}
                firebaseConfig={firebaseConfig}
                events={events}
                visible={visible}
              /> */}
            </Route>
            <Route path="/sign">
              <Sign
                mainnetProvider={mainnetProvider}
                injectedProvider={injectedProvider}
                address={address}
                loadWeb3Modal={loadWeb3Modal}
                chainList={chainList}
                contracts={readContracts}
                localProvider={localProvider}
                firebaseConfig={firebaseConfig}
                events={events}
                tx={tx}
                writeContracts={writeContracts}
              />
            </Route>
            <Route path="/profile">
              <Profile
                firebaseConfig={firebaseConfig}
                yourLocalBalance={yourLocalBalance}
                writeContracts={writeContracts}
                readContracts={readContracts}
                tx={tx}
                localProvider={localProvider}
                address={address}
                tokenId={tokenId}
              />
            </Route>
          </CustomSwitch>
        </div>
      )}
    </div>
  );
}

export default App;
