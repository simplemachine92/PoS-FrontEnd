import React from "react";
import { Link } from "react-router-dom";
import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 */
function Home({ yourLocalBalance, readContracts, writeContracts, tx, localProvider }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const purpose = useContractReader(readContracts, "YourContract", "purpose");

  return (
    <div>
      <main>
        <h2>GREENPILLED:</h2>
        <h2>Regen CryptoEconomics</h2>
        <section className="coordination-hero background-bubble">
          <div className="hero-container">
            <div className="green-pill">
              <img src="image/greenpill-socialimage.svg" />
            </div>
          </div>
        </section>
      </main>
      <footer className="footer-container background-greenpill">
        <section className="green-pill-form-section">
          <div>
            <h2>Make a Pledge:</h2>
            <h1>Receive a digitally signed copy of Green Pill</h1>
            <h1>by pledging at least 0.01337 ETH to Public Goods</h1>
            <br />
            <form className="form">
              <label htmlFor="percentage">I Pledge</label>
              <input type="text" id="percentage" name="percentage" placeholder="25%" defaultValue="25%" />
              <label htmlFor="percentage">of my Wealth Above </label>
              <input type="number" min="0.01337" id="amount" name="amount" defaultValue="0.01337" step="0.1" />
              <label htmlFor="cause">to the cause of</label>
              <input
                type="text"
                id="cause"
                name="cause"
                placeholder="Public Goods Funding"
                defaultValue="Public Goods Funding"
              />
              <div className="buttons-green-pill">
                <button type="button">
                  <img src="image/arrow-green-pill.svg" alt="arrow" />
                  <a href="javascript:alert('This is a simple tool created by the Gitcoin community to facilitate pledges to support a more Solarpunk world.');">
                    What’s this?
                  </a>
                </button>
                <button id="target" type="button">
                  <img src="image/tweet-icon.svg" alt="tweet" />
                  <p>Tweet</p>
                </button>
              </div>
            </form>
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
  );
}

export default Home;
