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
function Order({ writeContracts, tx }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const [uValue, setU] = useState("0.0001337");

  /*  const columns = [
    {
        title: "Retailer",
        dataIndex: "pledge",
  
        sorter: (a, b) => a.pledge - b.pledge,
        sortDirections: ["ascend"],
      },] */

  return (
    <>
      <div>
        {/* <h3 class="title">Take the Green Pill:</h3>
          <h3 class="title">Regenerative CryptoEconomics</h3> */}

        <form action="https://www.boulderbookstore.net/">
          <div className="hero-container">
            <img src="image/reee.svg" />
            {/* Fix button redirect */}

            <button class="btn">Boulder Book Store</button>
          </div>
        </form>

        <footer className="pledge-container">
          <h5>Pre-Order Now</h5>

          <br />
          {/* <a href="https://www.amazon.com/gp/product/164421248X">Amazon</a> <br />
              <a href="https://www.target.com/s?searchTerm=9781644212486">Target</a> */}

          <section className="green-pill-form-section">
            <div className="hero-container2">
              <table>
                <thead></thead>
                <tbody>
                  <tr>
                    <td>Books-A-Million</td>
                    <td>
                      <a href="https://www.booksamillion.com/p/9781644212486">Click Here</a>
                    </td>
                  </tr>
                  <tr>
                    <td>Barnes & Noble</td>
                    <td>
                      <a href="https://www.barnesandnoble.com/w/proof-of-stake-vitalik-buterin/1140789169?ean=9781644212486&st=AFF&2sid=Random%20House%20Inc_8373827_NA&sourceId=AFFRandom%20House%20Inc">
                        Click Here
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>Bookshop.org</td>
                    <td>
                      <a href="https://bookshop.org/books/proof-of-stake-essays-on-the-making-of-ethereum-and-the-future-of-the-internet/9781644212486">
                        Click Here
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>Indie Bound</td>
                    <td>
                      <a href="https://www.indiebound.org/book/9781644212486">Click Here</a>
                    </td>
                  </tr>
                  <tr>
                    <td>Amazon</td>
                    <td>
                      <a href="https://www.amazon.com/gp/product/164421248X">Click Here</a>
                    </td>
                  </tr>
                  <tr>
                    <td>Target</td>
                    <td>
                      <a href="https://www.target.com/s?searchTerm=9781644212486">Click Here</a>
                    </td>
                  </tr>

                  <tr>
                    <td>Hudson</td>
                    <td>
                      <a href="https://www.hudsonbooksellers.com/book/9781644212486">Click Here</a>
                    </td>
                  </tr>
                  <tr>
                    <td>Walmart</td>
                    <td>
                      <a href="https://www.walmart.com/ip/Proof-of-Stake-Essays-on-the-Making-of-Ethereum-and-the-Future-of-the-Internet-Paperback-9781644212486/678274718">
                        Click Here
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td>Powells</td>
                    <td>
                      <a href="https://www.powells.com/book/-9781644212486">Click Here</a>
                    </td>
                  </tr>
                </tbody>
              </table>
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

export default Order;
