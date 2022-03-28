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
`;

const buyLinks = [
  {
    name: "Books-A-Million",
    link: "https://www.booksamillion.com/p/9781644212486",
  },
  {
    name: "Barnes & Noble",
    link: "https://www.barnesandnoble.com/w/proof-of-stake-vitalik-buterin/1140789169?ean=9781644212486&st=AFF&2sid=Random%20House%20Inc_8373827_NA&sourceId=AFFRandom%20House%20Inc",
  },
  {
    name: "Bookshop.org",
    link: "https://bookshop.org/books/proof-of-stake-essays-on-the-making-of-ethereum-and-the-future-of-the-internet/9781644212486",
  },
  {
    name: "Indie Bound",
    link: "https://www.indiebound.org/book/9781644212486",
  },
  {
    name: "Amazon",
    link: "https://www.amazon.com/gp/product/164421248X",
  },
  {
    name: "Target",
    link: "https://www.target.com/s?searchTerm=9781644212486",
  },
  {
    name: "Hudson",
    link: "https://www.hudsonbooksellers.com/book/9781644212486",
  },
  {
    name: "Walmart",
    link: "https://www.walmart.com/ip/Proof-of-Stake-Essays-on-the-Making-of-Ethereum-and-the-Future-of-the-Internet-Paperback-9781644212486/678274718",
  },
  {
    name: "Powells",
    link: "https://www.powells.com/book/-9781644212486",
  },
  {
    name: "Seven Stories",
    link: "https://www.sevenstories.com/books/4443-proof-of-stake",
  },
];

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
        <div className="">
          {/* dev-note This header needs to be split into elements, so loading isn't as clunky */}
          {/* prettier-ignore */}
          <div className="flex flex-wrap bg-headerBackground bg-contain bg-top-right bg-no-repeat">
            <div className="flex flex-wrap w-2/5 mx-auto">
              <img class="shadow" className="object-scale-down mb-12" src="assets/PreOrderText.png" />
            </div>
            <div className="flex flex-wrap w-1/2 justify-center items-center mx-auto">
              <div className="max-w-md py-10 mx-auto">
                <div className="py-0 backdrop-filter rounded-lg content-center mx-auto">
                  <img alt="Book" className="w-3/5 mb-4 md:w-3/4 mx-auto" src="assets/RasCover.png" />
                  <a href="https://www.boulderbookstore.net/product/proof" target="_blank" rel="noreferrer">
                    <button
                      className="w-3/4 py-2 px-2 mt-2 mx-auto sm:py-4 sm:px-3 text-xs md:text-lg bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                      type="btn btn-primary"
                    >
                      Signed Pre-Order: Boulder Book Store
                    </button>
                  </a>
                </div>
              </div>
            </div>
          
          {/* <img src="assets/pre-order.svg" /> */}
              <div className="w-screen bg-circle bg-contain bg-no-repeat px-5 py-6 mx-auto">
              <h5 className="font-bold">Retailers</h5>
              <br />
                <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 ">
                  {buyLinks.map(item => (
                    <div className="p-2 sm:w-1/2 w-1/2">
                      <a href={item.link} className="">
                        {/* <svg
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        className="text-yellow-pos w-6 h-6 flex-shrink-0 mr-4"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                        <path d="M22 4L12 14.01l-3-3"></path>
                      </svg> */}
                        <button
                          className="w-3/4 mt-3 py-2 px-1 mx-auto sm:py-4 text-sm md:text-sm bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                          type="btn btn-primary"
                        >
                          {item.name}
                        </button>
                        {/* <h1 className="font-bold font-spacemono text-xl">{item.name}</h1> */}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            
            {/* Removing this component until its sizing is fixed */}
            {/* <Quotes /> */}
            <Footer />
          
        </div>
        </div>
      </div>
    </>
  );
}

export default Order;
