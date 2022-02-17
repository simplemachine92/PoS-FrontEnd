import styled from "styled-components";
import React, { useState } from "react";
import { Button, InputNumber } from "antd";
import { Footer, Quotes } from "../components";

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
  const [uValue, setU] = useState("0.0001337");

  return (
    <>
      <div>
        {/* <h3 class="title">Take the Green Pill:</h3>
          <h3 class="title">Regenerative CryptoEconomics</h3> */}

        <div className="hero-container">
          <img src="assets/Header_pledge.svg" />
          {/* Fix button redirect */}

          <button class="btn">Pledge below 👇</button>
        </div>

        <footer className="footer-container">
          <section className="green-pill-form-section">
            <div>
              <h5>Make a Pledge</h5>

              <h3 className="text-2xl p-10">
                Receive a digitally signed book plate (with your full digital copy upon release) and an optional to mint
                "Soulbound" NFT 👀
              </h3>

              <InputNumber
                className="form"
                style={{ width: "80%", margin: "auto" }}
                bordered={false}
                controls={false}
                onChange={e => {
                  const currValue = String(e);
                  setU(currValue);
                  console.log("changin", uValue);
                }}
                step={0.1}
                defaultValue={0.1337}
                onPressEnter={async () => {
                  try {
                    const txCur = await tx(
                      writeContracts.ProofOfStake_Pages.pledge({ value: utils.parseEther(uValue) }),
                    );
                    await txCur.wait();
                  } catch {
                    console.log("pledge failed");
                  }
                }}
              />
              {address ? (
                <StyledButton
                  type="buttons-green-pill"
                  className=""
                  style={{ marginTop: 40, width: "30%" }}
                  onClick={async () => {
                    try {
                      const txCur = await tx(
                        writeContracts.ProofOfStake_Pages.pledge({ value: utils.parseEther(uValue) }),
                      );
                      await txCur.wait();
                    } catch {
                      console.log("button pledge failed");
                    }
                  }}
                >
                  Submit
                </StyledButton>
              ) : (
                <StyledButton style={{ marginTop: 40, width: "30%" }} onClick={loadWeb3Modal}>
                  Connect
                </StyledButton>
              )}
            </div>
          </section>

          <div>
            <h3 className="p-10 auto-mx text-white italic text-xs">
              For pledges made here, 90% of funds go to the Gitcoin Grants matching pool and 10% to our publishing
              partner, Seven Stories Press, for supporting public goods in independent publishing. For book copies
              purchased here or anywhere, Vitalik has committed all of his proceeds to Gitcoin Grants.
            </h3>
          </div>
          <Quotes />
          <Footer />
        </footer>
      </div>
    </>
  );
}

export default Pledge;
