import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Button, InputNumber, Input, notification, Spin } from "antd";
import { Footer, Quotes } from "../components";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";

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

export const StyledInput = styled(Input)`
  width: 100%;
  height: 80px;
  margin-top: 5px;
  background: #31dbe5;
  border: 1px solid #207191;
  border-radius: 8px;
  outline: none;
  text-align: center;
  font-size: 30px;
  font-size: 2.5vw;
  font-family: Space Mono, sans-serif;
  color: #ffffff;
  background: #31dbe5;

  &::placeholder {
    margin-top: 100px;
    color: #ffffff;
    font-family: Space Mono, sans-serif;
    font-style: normal;
    font-size: 20px;
    text-align: center;
  },
`;

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 */
function Profile({ writeContracts, tx, address, loadWeb3Modal, readContracts, tokenId }) {
  const [image, setImage] = useState();
  const [url, setURL] = useState("placeholder");

  useEffect(async () => {
    if (readContracts.ProofOfStake_Pages && address) {
      let nId = await readContracts.ProofOfStake_Pages.tokenOfOwnerByIndex(address, "0");
      let token = await readContracts.ProofOfStake_Pages.tokenURI(nId);
      console.log("c address", readContracts.ProofOfStake_Pages.address);
      setURL(`https://opensea.io/assets/${readContracts.ProofOfStake_Pages.address}/${nId}`);
      const json = atob(token.substring(29));
      const result = JSON.parse(json);
      /* console.log("res2", result); */
      setImage(result.image);
      /* setImage(token); */
    }
  }, [tokenId, address, readContracts]);

  return (
    /* Need conditional rendering here, but token getter works */
    <>
      {address ? (
        <div>
          <div className="bg-headerBackground bg-cover bg-center bg-no-repeat">
            {/* dev-note This header needs to be split into elements, so loading isn't as clunky */}
            {/* prettier-ignore */}
            <div class="flex items-center justify-center mt-10">
          {/* <h5 className="text-xl font-bold">Your Token</h5> */}

          {image ? (
            <img className="px-2 py-2 mb-10 ml-4 w-2/3 sm:w-1/2 lg:w-5/12 xl:w-3/12 md:py-2 md:px-2 bg-gradient-to-r from-blue-100 to-yellow-pos hover:from-blue-100 hover:to-yellow-poslight rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out" src={image} />
          ) : (
            <Spin/>
          )}
            <div className="">
            <br />
            <h3 className="text-left text-sm md:text-3xl mx-8">
              View on <a href={url}>OpenSea</a>
            </h3>
          </div>
            
            {/* Enable when book releases and we have full pdf */}
            {/* <Button style={{ padding: "4px 15px" }} type="primary" onClick={getBook} loading={loading.loading}>
              {loading.buttonText}
            </Button> */}
          </div>

            {/* <h3 className="text-yellow-pos mb-4 mt-4 text-sm p-10 md:text-3xl">
            Pledge any amount of ETH below to request a digitally signed book plate from Vitalik. <br /> <br /> You'll
            mint a non-transferable NFT and, when the book is available, you'll gain access to your signed digital copy.
          </h3> */}

            {/* Removing this component until sizing is fixed */}
            {/* <Quotes /> */}
            <Footer />
          </div>
        </div>
      ) : (
        <div className="bg-headerBackground h-screen w-full bg-fill bg-center overflow-hidden">
          <div className="">
            <div class="flex items-center justify-center mt-10">
              <h3 className="text-left text-sm md:text-3xl mx-8">Please Connect Your Wallet</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;