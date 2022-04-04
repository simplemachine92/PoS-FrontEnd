import { Menu, Affix, Button, Drawer, Row, Col } from "antd";
import "antd/dist/antd.css";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import React, { useCallback, useEffect, useState } from "react";
import { HomeOutlined, UserOutlined, BookOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import "./App.css";
import {
  Account,
  Contract,
  NetworkDisplay,
  FaucetHint,
  AfterPledge,
  Waitlist,
  Faucet,
  Ramp,
  GasGauge,
} from "./components";
import { NETWORKS, ALCHEMY_KEY } from "./constants";
import externalContracts from "./contracts/external_contracts";
// contracts
import deployedContracts from "./contracts/hardhat_contracts.json";
import { Transactor, Web3ModalSetup } from "./helpers";
import { Home, SignatureList, Sign, Pledge, Order } from "./views";
import { useStaticJsonRPC } from "./hooks";
import { useLookupAddress } from "eth-hooks/dapps/ens";
import SignatorViewer from "./SignatorViewer";
import styled from "styled-components";

export const StyledMenu = styled(Menu)`
  height: 100%;
  background: #7ee6cd;
  border-width: 0px;
  &:hover {
    color: #454545;
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
  "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
  `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  "https://rpc.scaffoldeth.io:48544",
];

function App(props) {
  // specify all the chains your app is available on. Eg: ['localhost', 'mainnet', ...otherNetworks ]
  // reference './constants.js' for other networks
  const networkOptions = [initialNetwork.name, "mainnet", "rinkeby"];

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

  const targetNetwork = NETWORKS[selectedNetwork];

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);
  const mainnetProvider = useStaticJsonRPC(providers);

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

  const events = useEventListener(readContracts, "ProofOfStake_Pages", "Pledge", localProvider, "1");
  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig);

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });

  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader(mainnetContracts, "DAI", "balanceOf", [
    "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  ]);

  // keep track of a variable from the contract in the local React state:
  const purpose = useContractReader(readContracts, "na", "balanceOf", [address]);
  //console.log(purpose);

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
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...");
      console.log("📝 readContracts", readContracts);
      console.log("🌍 DAI contract on mainnet:", mainnetContracts);
      console.log("💵 yourMainnetDAIBalance", myMainnetDAIBalance);
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
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
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

  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Affix>
        <NetworkDisplay
          NETWORKCHECK={NETWORKCHECK}
          localChainId={localChainId}
          selectedChainId={selectedChainId}
          targetNetwork={targetNetwork}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
        />
        <StyledMenu
          className="hidden justify-start items-center sm:flex"
          selectedKeys={[location.pathname]}
          mode="horizontal"
          collapsedWidth="0"
        >
          <Menu.Item
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            key="Home"
            icon={<HomeOutlined />}
          >
            Home
            <Link to="/"></Link>
          </Menu.Item>
          <Menu.Item
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            key="mail"
            icon={<BookOutlined />}
          >
            Mint
            <Link to="/pledge"></Link>
          </Menu.Item>
          <Menu.Item
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            key="order"
            icon={<ShoppingCartOutlined />}
          >
            Pre-Order
            <Link to="/order"></Link>
          </Menu.Item>
          <Menu.Item
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            key="donations"
            icon={<UserOutlined />}
          >
            Top Donors
            <Link to="/donations"></Link>
          </Menu.Item>
          <Menu.Item
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            key="signatures"
            icon={<UserOutlined />}
          >
            Signatures
            <Link to="/signatures"></Link>
          </Menu.Item>

          <Menu.Item style={{ marginLeft: "auto" }}>
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
            {yourLocalBalance.lte(ethers.BigNumber.from("0")) && (
              <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
            )}
          </Menu.Item>
        </StyledMenu>

        <div className="flex sm:hidden justify-between p-2" style={{ background: "#7ee6cd" }}>
          <button
            className="flex flex-col justify-center items-center gap-1 py-2 px-2 sm:py-2 sm:px-3 text-xs md:text-lg bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
            type="primary"
            onClick={() => setVisible(true)}
          >
            <div className="h-0.5 w-5 bg-black rounded-md" />
            <div className="h-0.5 w-5 bg-black rounded-md" />
            <div className="h-0.5 w-5 bg-black rounded-md" />
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
                Mint
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
                icon={<UserOutlined />}
              >
                Top Donors
                <Link to="/donations"></Link>
              </Menu.Item>
              <Menu.Item
                className="flex justify-start items-center"
                onClick={() => setVisible(false)}
                key="signatures"
                icon={<UserOutlined />}
              >
                Signatures
                <Link to="/signatures"></Link>
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
            {yourLocalBalance.lte(ethers.BigNumber.from("0")) && (
              <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
            )}
          </div>
        </div>
      </Affix>
      <Switch>
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
          <Waitlist
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
        <Route exact path="/debug">
          {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally
            */}

          <Contract
            name="ProofOfStake_Pages"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
        </Route>
        <Route path="/signatures">
          <SignatureList
            address={address}
            yourLocalBalance={yourLocalBalance}
            mainnetProvider={mainnetProvider}
            price={price}
            firebaseConfig={firebaseConfig}
            events={events}
          />
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
          />
        </Route>
      </Switch>

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      {/* <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={[4, 4]}>
          <Col span={8}>
            <Ramp price={price} address={address} networks={NETWORKS} />
          </Col>

          <Col span={8} style={{ textAlign: "center", opacity: 0.8 }}>
            <GasGauge gasPrice={gasPrice} />
          </Col>
          <Col span={8} style={{ textAlign: "center", opacity: 1 }}>
            <Button
              onClick={() => {
                window.open("https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA");
              }}
              size="large"
              shape="round"
            >
              <span style={{ marginRight: 8 }} role="img" aria-label="support">
                💬
              </span>
              Support
            </Button>
          </Col>
        </Row>

        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {faucetAvailable ? (
              <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
            ) : (
              ""
            )}
          </Col>
        </Row>
      </div> */}
    </div>
  );
}

export default App;
