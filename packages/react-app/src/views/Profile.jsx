import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Button, InputNumber, Input, notification, Spin } from "antd";
import { Footer, Quotes } from "../components";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";
const codec = require("json-url")("lzw");

const { utils, BigNumber } = require("ethers");

var validator = require("email-validator");

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
  const [uMessage, setMessage] = useState();
  const [typedData, setTypedData] = useState();
  const [eValue2, setE2] = useState("placeholder");

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const firebaseConfig2 = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: "https://proofofstake-91004.firebaseio.com/",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };

  const app2 = initializeApp(firebaseConfig2, "email");

  // Get a reference to the database service
  const database2 = getDatabase(app2);

  const decompressTypedData = async data => {
    const _typedData = await codec.decompress(data);
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
            message.msg = sig.val().message.msg;

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
    if (readContracts.ProofOfStake_Pages && address && tokenId) {
      let nId = await readContracts.ProofOfStake_Pages.tokenOfOwnerByIndex(address, "0");
      let token = await readContracts.ProofOfStake_Pages.tokenURI(nId);
      setURL(`https://opensea.io/assets/${readContracts.ProofOfStake_Pages.address}/${nId}`);
      const json = atob(token.substring(29));
      const result = JSON.parse(json);
      console.log("waty", result);
      setImage(result.image);
      setMessage(result.message);
    }
  }, [tokenId, address, readContracts]);

  return (
    /* Need conditional rendering here, but token getter works */
    <>
      {address && tokenId ? (
        <div>
          <div className="bg-headerBackground bg-cover bg-center bg-no-repeat">
            {/* dev-note This header needs to be split into elements, so loading isn't as clunky */}
            {/* prettier-ignore */}
            <div class="flex items-center justify-center pt-10">
              {/* <h5 className="text-xl font-bold">Your Token</h5> */}

              {image ? (
                <img
                  className="px-2 py-2 ml-4 w-4/5 sm:w-1/2 lg:w-1/4 xl:w-3/12 md:py-2 md:px-2 bg-gradient-to-r from-blue-100 to-yellow-pos hover:from-blue-100 hover:to-yellow-poslight rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                  src={image}
                  
                  
                />
              ) : (
                <Spin />
              )}

              {typedData && uMessage != typedData.message.msg ? (
              <div className="mx-4 p-5 rounded overflow-hidden shadow-xl">
                <br />
                <h3 className="text-center text-lg md:text-3xl">
                  View on <a href={url}>OpenSea</a>
                </h3>
                <br />
                <h3 className="text-center text-md md:text-3xl">You have received the message:</h3>
                <br/>
                <h3 className="text-center text-md md:text-3xl">"{typedData.message.msg}"</h3>
                
                <br />
                <button
                  className="w-2/3 mb-4 py-2 px-2 sm:py-4 text-sm sm:text-xl bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
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
                  Update
                </button>
                <br/>
                {/* <p class="text-sky-400">Click "Update" to display your personalized message on your bookplate</p> */}
                
              </div>

              ) : (
                <div className="mx-4 p-5 rounded overflow-hidden shadow-xl">
                
                <h3 className="text-center text-lg md:text-3xl">
                  View your token on <a href={url}>OpenSea</a>
                </h3>
                <br/>
                <h3 className="text-center text-md md:text-lg">Download your personalized copy starting on September 13, 2022.</h3>
                <br/>
                <h3 className="text-center text-md md:text-lg">Want to be Notified? Enter your E-mail below!</h3>
                <input
                className="text-center h-1/2 w-full sm:w-2/3 mt-4 p-2 text-md md:text-lg"
                placeholder="Your @.com"
                onChange={f => {
                  const currValue2 = f;
                  setE2(currValue2);
                }}

              />
                <button
                type="btn btn-primary"
                  className="w-3/4 py-2 px-2 mt-4 mx-auto sm:py-4 sm:px-3 text-xs sm:text-lg bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                  onClick={async () => {

                    console.log("evalue", eValue2)

                    if (eValue2 == "placeholder" || eValue2.target.value == "" || validator.validate(eValue2.target.value) == false ) {
                      notification.error({
                        message: "Please Enter a Valid Email Address",
                        placement: "topRight",
                      })
                    } else {
                      const db2 = database2;
                      set(ref(db2, `PoS/` + address), {
                       email: eValue2.target.value
                      });
                  }
                  }}
                >Subscribe</button>
              </div>
              )}

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
              <br />
              <h3 className="text-center text-md md:text-3xl">Please connect your wallet, or mint a token..</h3>
              <Spin />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
