import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Button, InputNumber, Input, notification, Spin } from "antd";
import { Footer, Quotes } from "../components";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";
const codec = require("json-url")("lzw");

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
function Profile({ writeContracts, tx, address, loadWeb3Modal, readContracts, tokenId, firebaseConfig }) {
  const [image, setImage] = useState();
  const [url, setURL] = useState("placeholder");
  const [ready, setReady] = useState(false);
  const [sData, setData] = useState();
  const [typedData, setTypedData] = useState();

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const decompressTypedData = async data => {
    const _typedData = await codec.decompress(data);
    /* console.log("typed", _typedData);
    console.log("sig", signatures[0]); */
    setTypedData(_typedData);
    console.log("set data", _typedData);
  };

  let myData = [];

  useEffect(async () => {
    const dbRef = ref(getDatabase(app));
    get(child(dbRef, `PoS/`))
      .then(snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(sig => {
            let message = sig.val().message;
            console.log("message", message);

            let sigMsg = message.msg;
            let sigRecipient = message.recipient;
            let pledgeValue = message.pledge;
            let sigTime = message.timestamp;
            message.signature = sig.val().signature;
            message.typedData = sig.val().typedData;

            let svgBoiler = `<svg xmlns="http://www.w3.org/2000/svg" width="7.94in" height="10.59in" viewBox="-35 -25 571.46 762.2"><circle cx="255.76" cy="99.98" r="99.48" fill="#f6cf46" stroke="#000" stroke-miterlimit="10"/><g><path d="M233.66,179c.2,19.13,17.69,31.14,33.65,27.52,7.41-1.67,13-5.68,17.65-11.49,6.86-8.63,13.79-17.2,20.68-25.81Q317.33,154.6,329,140c4.8-6,7.36-12.8,6.57-20.46-1.26-12.29-7.75-20.74-19.65-24.61-11-3.59-22.5-.1-30.22,9.08-3.18,3.79-6.21,7.71-9.31,11.58-11.9,14.83-23.75,29.69-35.69,44.48C236.21,165.61,233.58,171.77,233.66,179Z" transform="translate(-30.92 -49.36)" fill="#fff"/><path d="M233.66,179c-.08-7.2,2.55-13.36,7-18.9,11.94-14.79,23.79-29.65,35.69-44.48,3.1-3.87,6.13-7.79,9.31-11.58,7.72-9.18,19.21-12.67,30.22-9.08,11.9,3.87,18.39,12.32,19.65,24.61.79,7.66-1.77,14.47-6.57,20.46q-11.7,14.58-23.35,29.19C298.75,177.8,291.82,186.37,285,195c-4.61,5.81-10.24,9.82-17.65,11.49C251.35,210.11,233.86,198.1,233.66,179Zm30.71-42.21c-8.09,10.36-16.3,20-23.43,30.3-5,7.2-4.35,15.43-.38,23.29a10.9,10.9,0,0,0,7.62,6c10.15,2.43,18.7-.28,25.35-8.29s13.22-16.43,19.81-24.67a25.9,25.9,0,0,0,1.41-2.28Zm33.46,20.84c7.89-10,15.69-19.11,22.6-28.86,5.31-7.48,5.08-15.89.93-24.11a10.42,10.42,0,0,0-7.17-5.82c-10.15-2.51-18.68.1-25.4,8.09-4.83,5.75-9.42,11.69-14.11,17.56-2.27,2.85-4.52,5.71-7.06,8.92Zm-37.9,44.66c8.86.25,15.8-3.18,21.19-10,6-7.65,12.13-15.22,18.19-22.84a23.88,23.88,0,0,0,1.44-2.23c-1.63-2.57-2.91-1.67-4.21-.05-5,6.22-10.15,12.31-14.93,18.69-5.59,7.46-11.94,13.71-21.39,15.88C260.13,201.69,260.08,201.93,259.93,202.26Zm69.75-86.92c0,8.65-3.87,15.58-9.24,22-5,6-9.83,12.17-14.71,18.29-1.17,1.47-2.25,3-3.25,4.37.78,1.86,1.74,2.43,3.09,1.29a17.65,17.65,0,0,0,2.25-2.47c5.41-6.71,10.83-13.42,16.18-20.18a42.38,42.38,0,0,0,4.07-5.9A21.3,21.3,0,0,0,329.68,115.34Z" transform="translate(-30.92 -49.36)"/><path d="M264.37,136.76l30.38,24.36a25.9,25.9,0,0,1-1.41,2.28c-6.59,8.24-13.08,16.56-19.81,24.67s-15.2,10.72-25.35,8.29a10.9,10.9,0,0,1-7.62-6c-4-7.86-4.6-16.09.38-23.29C248.07,156.72,256.28,147.12,264.37,136.76Z" transform="translate(-30.92 -49.36)" fill="#01e2ac"/><path d="M297.83,157.6l-30.21-24.22c2.54-3.21,4.79-6.07,7.06-8.92,4.69-5.87,9.28-11.81,14.11-17.56,6.72-8,15.25-10.6,25.4-8.09a10.42,10.42,0,0,1,7.17,5.82c4.15,8.22,4.38,16.63-.93,24.11C313.52,138.49,305.72,147.61,297.83,157.6Z" transform="translate(-30.92 -49.36)" fill="#5bf1cd"/><path d="M259.93,202.26c.15-.33.2-.57.29-.59,9.45-2.17,15.8-8.42,21.39-15.88,4.78-6.38,9.95-12.47,14.93-18.69,1.3-1.62,2.58-2.52,4.21.05a23.88,23.88,0,0,1-1.44,2.23c-6.06,7.62-12.17,15.19-18.19,22.84C275.73,199.08,268.79,202.51,259.93,202.26Z" transform="translate(-30.92 -49.36)" fill="#12c094"/><path d="M329.68,115.34a21.3,21.3,0,0,1-1.61,17.38,42.38,42.38,0,0,1-4.07,5.9c-5.35,6.76-10.77,13.47-16.18,20.18a17.65,17.65,0,0,1-2.25,2.47c-1.35,1.14-2.31.57-3.09-1.29,1-1.35,2.08-2.9,3.25-4.37,4.88-6.12,9.67-12.31,14.71-18.29C325.81,130.92,329.66,124,329.68,115.34Z" transform="translate(-30.92 -49.36)" fill="#12c094"/></g><text transform="translate(0 282.85)" font-size="18" font-family="ArialMT, Arial">{<tspan x="0" y="28.8">"signer": 0x00de4b13153673bcae2616b67bf822500d325fc3,</tspan><tspan x="0" y="57.6" xml:space="preserve">"timestamp": ${sigTime},</tspan><tspan x="0" y="86.4" xml:space="preserve">"recipient": ${sigRecipient},</tspan><tspan x="0" y="115.2">"pledge": ${pledgeValue} ETH,</tspan><tspan x="0" y="144">"version": 0,</tspan><tspan x="0" y="172.8">},</tspan><tspan x="0" y="230.4">"msg": ${sigMsg}</tspan></text></svg>`;

            var encodedData = btoa(svgBoiler);

            var dataURI = "data:image/svg+xml;base64," + encodedData;

            message.imageData = dataURI;

            console.log(dataURI);

            if (address && sigRecipient == address) {
              console.log("found", message);
              decompressTypedData(message.typedData);
              myData.push(message);
            }
            setData(myData);
            console.log("muh", myData);
          });
        } else {
          console.log("No data available");
        }
      })
      .catch(error => {
        console.error(error);
      });

    setReady(true);
  }, [address]);

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
      {address && ready ? (
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
            <h3 className="text-left text-lg md:text-3xl mx-16">
              View on <a href={url}>OpenSea</a>
            </h3>
              <br/>
              <button
              className="w-1/2 mb-4 py-2 px-2 sm:py-4 text-sm sm:text-xl bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
              type="btn btn-primary"
              onClick={async () => {
                try {
                  const txCur = tx(
                    writeContracts &&
                    writeContracts.ProofOfStake_Pages.updateIfSigned(
                      sData[0].signature,
                      typedData.message.pledge,
                      typedData.message.timestamp,
                      typedData.message.msg,
                    ),
                  );
                  await txCur.wait();
                } catch (e) {
                  console.log("mint failed", e);
                }
              }}
            >
              Update Token
            </button>
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
              <Spin />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
