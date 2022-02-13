import styled from "styled-components";
import React, { useState } from "react";
import { Button, InputNumber } from "antd";

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
`;

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 */
function Pledge({ writeContracts, tx }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const [uValue, setU] = useState("0.0001337");

  return (
    <>
      <div>
        {/* <h3 class="title">Take the Green Pill:</h3>
          <h3 class="title">Regenerative CryptoEconomics</h3> */}

        <div className="hero-container">
          <img src="image/reee.svg" />
          <button class="btn">Pre-order</button>
        </div>

        <footer className="footer-container background-greenpill">
          <section className="green-pill-form-section">
            <div>
              <h5>Make a Pledge</h5>
              <br />
              <h4>Receive a digitally signed page!</h4>
              <br />
              <h4>pledge at least 0.01337 ETH to Public Goods</h4>
              <br />

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
                defaultValue={0.0001337}
                onPressEnter={async () => {
                  try {
                    const txCur = await tx(writeContracts.GreenPill_Pages.pledge({ value: utils.parseEther(uValue) }));
                    await txCur.wait();
                  } catch {
                    console.log("pledge failed");
                  }
                }}
              />

              <StyledButton
                type="buttons-green-pill"
                className=""
                style={{ marginTop: 40, width: "30%" }}
                onClick={async () => {
                  try {
                    const txCur = await tx(writeContracts.GreenPill_Pages.pledge({ value: utils.parseEther(uValue) }));
                    await txCur.wait();
                  } catch {
                    console.log("button pledge failed");
                  }
                }}
              >
                Submit
              </StyledButton>
            </div>
          </section>

          <div className="gitcoin-brand">
            <a href="https://gitcoindao.com">
              <img src="/image/gitcoindao_sign.svg" alt="gitcoinDAO" />
            </a>
            {""}
            {""}
            &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; <a href="https://t.me/+g9TM8i7GpxAzMGUx">Join the Telegram</a>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Pledge;
