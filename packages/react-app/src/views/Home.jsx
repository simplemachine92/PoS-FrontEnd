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
    <body>
      <main>
        <section class="coordination-hero background-bubble">
          <div class="hero-container">
            <div class="coordination-party-hero-description">
              <h2>GREENPILLED:</h2>
              <h1>Regenerative CryptoEconomics</h1>
            </div>
            <div class="green-pill">
              <img src="image/greenpill-socialimage.svg" />
            </div>
          </div>
        </section>
      </main>
      <footer class="footer-container background-greenpill">
        <section class="green-pill-form-section">
          <div>
            <h1>Make a Pledge:</h1>
            <form class="form">
              <label for="percentage">I've been GreenPilled! </label>
              <label for="percentage">I Pledge</label>
              <input type="text" id="percentage" name="percentage" placeholder="25%" value="25%" />
              <label for="percentage">of my Wealth Above </label>
              <input type="text" id="amount" name="amount" placeholder="$10mm" value="$10mm" />
              <label for="cause">to the cause of</label>
              <input
                type="text"
                id="cause"
                name="cause"
                placeholder="Public Goods Funding"
                value="Public Goods Funding"
              />

              <div class="buttons-green-pill">
                <button type="button">
                  <img src="image/arrow-green-pill.svg" alt="arrow" />
                  <a href="javascript:alert('This is a simple tool created by the Gitcoin community to facilitate pledges to support a more Solarpunk world.');">
                    What’s this?
                  </a>
                </button>

                <button
                  id="target"
                  type="button"
                  data-kinetics-attraction=""
                  data-kinetics-attraction-chance=".99"
                  data-kinetics-attraction-grow="20"
                  data-kinetics-attraction-type="drone"
                  data-kinetics-attraction-radius="1.7"
                >
                  <img src="image/tweet-icon.svg" alt="tweet" />
                  <p>Tweet</p>
                </button>
              </div>
            </form>
          </div>
        </section>
        <div class="gitcoin-brand">
          <a href="https://gitcoindao.com">
            <img src="/image/gitcoindao_sign.svg" alt="gitcoinDAO" />
          </a>{" "}
          &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; <a href="https://t.me/+g9TM8i7GpxAzMGUx">Join the Telegram</a>
        </div>
      </footer>
    </body>
  );
}

export default Home;
