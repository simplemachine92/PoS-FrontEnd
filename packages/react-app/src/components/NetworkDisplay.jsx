import { Alert, Button } from "antd";
import React from "react";
import { NETWORK } from "../constants";

function NetworkDisplay({
  NETWORKCHECK,
  localChainId,
  selectedChainId,
  targetNetwork,
  USE_NETWORK_SELECTOR,
  logoutOfWeb3Modal,
}) {
  let networkDisplay = "";
  if (NETWORKCHECK && localChainId && selectedChainId && localChainId !== selectedChainId) {
    const networkSelected = NETWORK(selectedChainId);
    const networkLocal = NETWORK(localChainId);
    if (selectedChainId === 1337 && localChainId === 31337) {
      networkDisplay = (
        <div
          className="bg-teal-100 w-1/2 text-xs sm:w-1/2 mx-2 rounded overflow-hidden content-center shadow-2xl px-5 py-3"
          style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}
        >
          <div>
            You have <b>chain id 1337</b> for localhost and you need to change it to <b>31337</b> to work with HardHat.
            <div>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</div>
          </div>
        </div>
      );
    } else {
      const showLogout = networkSelected && networkSelected.name !== "localhost";
      networkDisplay = (
        <div
          className="w-1/2 sm:w-1/2 bg-teal-100 text-xs sm:text-sm md:text-md mx-2 sm:mx-8 sm:my-4 rounded overflow-hidden content-center shadow-2xl px-5 py-3"
          style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}
        >
          ⚠️ Wrong Network
          <div className="mt-2">
            You have <b>{networkSelected && networkSelected.name}</b> selected and you need to be on{" "}
            <button
              className="w-1/8 text-2xs sm:text-xs md:text-sm mt-2 sm:mt-2 mx-auto py-2 px-2 sm:py-2 md:py-2 bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
              type="btn btn-primary"
              onClick={async () => {
                const ethereum = window.ethereum;
                const data = [
                  {
                    chainId: "0x" + targetNetwork.chainId.toString(16),
                    chainName: targetNetwork.name,
                    nativeCurrency: targetNetwork.nativeCurrency,
                    rpcUrls: [targetNetwork.rpcUrl],
                    blockExplorerUrls: [targetNetwork.blockExplorer],
                  },
                ];

                let switchTx;
                // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
                try {
                  switchTx = await ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: data[0].chainId }],
                  });
                } catch (switchError) {
                  // not checking specific error code, because maybe we're not using MetaMask
                  try {
                    switchTx = await ethereum.request({
                      method: "wallet_addEthereumChain",
                      params: data,
                    });
                  } catch (addError) {
                    // handle "add" error
                  }
                }

                if (switchTx) {
                }
              }}
            >
              <b>{networkLocal && networkLocal.name}</b>
            </button>
          </div>
        </div>
      );
    }
  } else {
    networkDisplay = USE_NETWORK_SELECTOR ? null : (
      <div style={{ zIndex: -1, position: "absolute", right: 154, top: 28, padding: 16, color: targetNetwork.color }} />
    );
  }

  return networkDisplay;
}

export default NetworkDisplay;
