import styled from "styled-components";
import React, { useState } from "react";
import { Button, InputNumber } from "antd";
import { Footer, Quotes } from "../components";
import { Redirect } from "react-router-dom";

const { utils, BigNumber } = require("ethers");

export const StyledButton = styled(Button)`
  height: 100%;
  background: #ffe171;
  border-width: 0px;
  &:hover {
    color: #454545;
    background: #7ee6cd;
    border-color: red;
  }
  ,
  &:focus {
    color: #000000;
    background-color: #ffe171;
  }
`;

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 */
function Claim({ writeContracts, tx, address, loadWeb3Modal }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const [uValue, setU] = useState("0.1337");

  return (
    <>
      <div>
        <div className="">
          {/* dev-note This header needs to be split into elements, so loading isn't as clunky */}
          {/* prettier-ignore */}
          {/* Bg format vvv */}
          {/* bg-headerBackground bg-contain bg-top-right bg-no-repeat */}
          <div className="flex flex-wrap">
            {/* <div className="flex flex-wrap w-1/2 mx-auto">
              <img class="shadow" className="object-scale-down" src="assets/RasText.png" />
            </div> */}
            {/* <div className="flex flex-wrap w-1/2 justify-center items-center mx-auto">
              <div className="max-w-md py-10 mx-auto">
                <div className="py-0 backdrop-filter rounded-lg content-center mx-auto">
                  <img alt="Book" className="w-1/2 mb-4 mx-auto" src="assets/RasCover.png" />
                  
                    <button
                      className="w-3/4 py-2 px-2 mt-4 mx-auto sm:py-4 sm:px-3 text-xs sm:text-lg bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                      type="btn btn-primary"
                    >
                      Donate 👇
                    </button>
                  
                </div>
              </div>
            </div> */}

            <footer className="">
              <section className="green-pill-form-section">
                <div>
                  <h5 className="text-red-pho font-bold mt-6">Claim ya birb 🐥</h5>

                  <h3 className="text-sm mt-10 ">Did you fund OSS in past Gitcoin Grants Rounds? Claim your birb</h3>

                  {address ? (
                    <button
                      type="btn btn-primary"
                      className="w-3/4 mt-8 py-2 sm:py-4 text-base sm:text-xl bg-gradient-to-r from-red-400 to-yellow-pos hover:from-red-400 hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                      style={{ marginTop: 40, width: "30%" }}
                      onClick={async () => {
                        try {
                          const txCur = await tx(
                            writeContracts.ProofOfStake_Pages.pledge({ value: utils.parseEther(uValue) }),
                          );
                          await txCur.wait();
                          // We need a redirect to /complete, this isnt working.
                          //return <Redirect to="/complete" />;
                        } catch {
                          console.log("button pledge failed");
                        }
                      }}
                    >
                      Claim
                    </button>
                  ) : (
                    <button
                      type="btn btn-primary"
                      className="w-3/4 mt-8 py-2 sm:py-4 text-base sm:text-xl bg-gradient-to-r from-red-400 to-yellow-pos hover:from-red-400 hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                      style={{ marginTop: 40, width: "30%" }}
                      onClick={loadWeb3Modal}
                    >
                      Connect
                    </button>
                  )}
                </div>
              </section>

              <div>
                <br />
                <h3 className="p-1 auto-mx text-white italic text-xs mx-10">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim id est laborum.
                </h3>
              </div>
              {/* Removing this component until sizing is fixed */}
              {/* <Quotes /> */}
              <Footer />
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}

export default Claim;
