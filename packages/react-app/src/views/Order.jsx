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
            {/* <div className="flex flex-wrap w-2/5 mx-auto">
              <img class="shadow" className=" mb-12" src="assets/PreOrderText.png" />
            </div> */}
            <div className="flex flex-wrap w-1/3 content-center items-left mx-auto">
              <div className="max-w-md py-5 mx-auto justify-center">
                <div className="py-0 backdrop-filter rounded-lg content-center mx-auto">
                  <img alt="Book" className="w-7/8 sm:w-4/5 md:w-4/5 lg:w-2/3 mx-auto" src="assets/RasCover.png" />
                </div>
              </div>
            </div>
            <div className="w-1/2 mx-auto mt-2 rounded overflow-hidden content-center shadow-2xl px-5 py-3">
            <h5 className="font-bold mb-0 sm:mb-1 md:mb-2 text-xs sm:text-tiny md:text-lg lg:text-xl">Want a signed copy? ??????</h5>
                  <a href="https://www.boulderbookstore.net/product/proof" rel="noreferrer">
                    <button
                      className="w-full py-2 px-1 mt-2 mb-2 lg:mb-4 mx-auto md:w-3/4 lg:w-2/3 sm:py-3 sm:px-3 text-xs sm:text-xs lg:text-lg bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                      type="btn btn-primary"
                    >
                    Boulder Book Store
                    </button>
                  </a>
                  <h5 className="font-bold mb-2 text-2xs sm:text-tiny md:text-lg lg:text-xl">Other Retailers</h5>
                <div className="flex flex-wrap">
                  {buyLinks.map(item => (
                    <div className="py-1 px-2 w-1/2 justify-center">
                      <a href={item.link} className="">
                        <button
                          className="w-full sm:mt-2 mx-auto py-2 px-1 sm:py-2 md:py-2 text-2xs sm:text-tiny lg:text-lg bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
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
          
          {/* <img src="assets/pre-order.svg" /> */}
              
            
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
