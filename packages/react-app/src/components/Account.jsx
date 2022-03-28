import { Button } from "antd";
import React from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";

/*
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

  <Account
    useBurner={boolean}
    address={address}
    localProvider={localProvider}
    userProvider={userProvider}
    mainnetProvider={mainnetProvider}
    price={price}
    web3Modal={web3Modal}
    loadWeb3Modal={loadWeb3Modal}
    logoutOfWeb3Modal={logoutOfWeb3Modal}
    blockExplorer={blockExplorer}
    isContract={boolean}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
*/

export default function Account({
  useBurner,
  address,
  userSigner,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
  isContract,
}) {
  const { currentTheme } = useThemeSwitcher();

  function isValidAddress(address) {
    return address && address !== "0x0000000000000000000000000000000000000000";
  }

  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <button
          className="py-1 px-2 mb-1 mt-1 mx-auto sm:py-2 sm:px-3 text-xs md:text-lg bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
          type="primary"
          onClick={logoutOfWeb3Modal}
          key="logoutbutton"
        >
          logout
        </button>,
      );
    } else {
      modalButtons.push(
        <button
          className="py-1 px-2 mb-1 mt-1 mx-auto sm:py-2 sm:px-3 text-xs md:text-lg bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
          type="primary"
          onClick={loadWeb3Modal}
          key="loginbutton"
        >
          connect
        </button>,
      );
    }
  }
  const display = minimized ? (
    ""
  ) : (
    <span className="mt-0">
      {web3Modal && web3Modal.cachedProvider ? <></> : useBurner ? "" : isContract ? <></> : ""}
      {useBurner && web3Modal && !web3Modal.cachedProvider ? <></> : <></>}
    </span>
  );

  return (
    <div className="flex flex-row">
      {display}
      {modalButtons}
    </div>
  );
}
