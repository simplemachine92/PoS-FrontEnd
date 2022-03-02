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
function Pledge({ writeContracts, tx, address, loadWeb3Modal }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const [uValue, setU] = useState("0.1337");

  return (
    <>
      <div>
        <div className="">
          {/* dev-note This header needs to be split into elements, so loading isn't as clunky */}
          {/* prettier-ignore */}
          <div className="flex flex-wrap bg-headerBackground bg-contain bg-top-right bg-no-repeat">
            <div className="flex flex-wrap w-1/2 mx-auto">
              <img class="shadow" className="object-scale-down" src="assets/RasText.png" />
            </div>
            <div className="flex flex-wrap w-1/2 justify-center items-center mx-auto">
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
            </div>

        <footer className="">
          <section className="green-pill-form-section">
            <div>
              <h5 className="font-bold mt-6">Make a Donation</h5>

              <h3 className="text-sm p-10">
                You could receive a digitally signed book plate from Vitalik.eth (his discretion)
              </h3>

              <InputNumber
                className="form"
                style={{ width: "80%", margin: "auto" }}
                bordered={false}
                controls={false}
                onChange={e => {
                  const currValue = String(e);
                  setU(currValue);
                }}
                step={0.1}
                defaultValue={0.1337}
                onPressEnter={async () => {
                  try {
                    const txCur = await tx(
                      writeContracts.ProofOfStake_Pages.pledge({ value: utils.parseEther(uValue) }),
                    );
                    await txCur.wait();
                  } catch {}
                }}
              />
              {address ? (
                <button
                type="btn btn-primary"
                  className="w-3/4 py-2 px-2 mt-4 mx-auto sm:py-4 sm:px-3 text-sm md:text-lg bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
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
                  Submit
                </button>
              ) : (
                <StyledButton style={{ marginTop: 40, width: "30%" }} onClick={loadWeb3Modal}>
                  Connect
                </StyledButton>
              )}
            </div>
          </section>

          <div>
            <br />
            <h3 className="p-1 auto-mx text-white italic text-xs">
              For pledges made here, 90% of funds go to the Gitcoin Grants matching pool and 10% to our publishing
              partner, Seven Stories Press, for supporting public goods in independent publishing. For book copies
              purchased here or anywhere, Vitalik has committed all of his proceeds to Gitcoin Grants.
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

export default Pledge;
