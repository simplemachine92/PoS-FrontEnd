import styled from "styled-components";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { Button, InputNumber, Input, notification } from "antd";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { Footer, Quotes } from "../components";

const { utils, BigNumber } = require("ethers");

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 */
function Pledge({ writeContracts, tx, address, loadWeb3Modal }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const [uValue, setU] = useState("0.01337");
  const [eValue, setE] = useState("placeholder");

  // Initialize Firebase

  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: "https://proofofstake-91004.firebaseio.com/",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };

  const app = initializeApp(firebaseConfig, "email");
  // firebase.initializeApp({}, "your app name here");

  // Get a reference to the database service
  const database = getDatabase(app);

  const history = useHistory();

  return (
    <>
      <div>
        {/* dev-note This header needs to be split into elements, so loading isn't as clunky */}
        {/* prettier-ignore */}
        <div className="flex flex-wrap bg-headerBackground bg-contain bg-top-right bg-no-repeat">
            {/* <div className="flex flex-wrap w-2/5 mx-auto">
              <img class="shadow" className="object-scale-down mb-12" src="assets/DonationText.png" />
            </div> */}
            <div className="py-2 flex w-3/4 sm:w-1/2 mx-auto justify-center">
              <div className="mx-auto">
              <h5 className="mb-4 font-bold text-xs sm:text-tiny md:text-lg lg:text-2xl">✨ Your Personal Digital Copy & NFT ✨</h5>
                <div className="flex py-0 backdrop-filter content-center mx-auto">
                {/* <img alt="Book_Spread" className="w-full" src="assets/bind_fix.png" /> */}
                  <img alt="Book" className="w-1/2 sm:w-1/2 md:w-1/2 mx-auto" src="assets/RasCover.png" />
                  <img alt="Bookplate" className="mx-4 pt-1 w-1/2 sm:w-1/2 md:w-1/2 rounded-xl md:rounded-2xl" src="assets/plate.png" />
                </div>
                
              </div>
            </div>
            {/* <div className="mt-2 flex-wrap w-1/2 content-center mx-auto"><img alt="Book_Spread" className="w-3/4" src="assets/bind_fix.png" /></div> */}
          
            <div className="flex-wrap mt-2 px-1 py-1 sm:px-4 sm:py-4 w-3/4 sm:w-1/3 mx-auto rounded overflow-hidden shadow-2xl">
            <h5 className="font-bold pt-4 sm:pt-4 md:py-6 text-xs sm:text-lg md:text-2xl lg:text-3xl">Donate & Mint</h5>
              <label className="text-2xs sm:text-sm md:text-md lg:text-xl">Enter ETH Amount</label>
              <InputNumber
                className="form mx-auto w-full sm:w-1/2 md:w-3/4"
                bordered={false}
                onChange={e => {
                  const currValue = String(e);
                  setU(currValue);
                }}
                step={0.1}
                defaultValue={0.01337}
              />
              <h3 className="text-2xs sm:text-2xs md:text-xs mt-3 md:mt-5 mx-2">Optional: Provide an email for notifications.</h3>
              <input
              type="form"
                  maxLength="160"
                  className="mx-auto w-4/5"
                  placeholder="your@.com"
                  onChange={f => {
                    const currValue2 = f;
                    setE(currValue2);
                  }}
                />
                <h3 className="text-2xs sm:text-2xs md:text-xs md:mt-5 mx-2">Note: We will never share your email address.</h3>
              {address ? (
                <button
                type="btn btn-primary"
                  className="w-1/3 sm:w-1/2 mb-2 mt-2 sm:mt-4 md:mt-6 lg:mt-10 mx-auto sm:py-2 sm:px-2 text-xs md:text-lg sm:mt-5 lg:mt-8 bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                  onClick={async () => {
                    try {

                      const result = tx(
                        writeContracts &&
                        writeContracts.ProofOfStake_Pages.pledge({ value: utils.parseEther(uValue) }),
                        async (update) => {
                          console.log("📡 Transaction Update:", update);
                          if (update && (update.status === "confirmed" || update.status === 1)) {
                            console.log(" 🍾 Transaction " + update.hash + " finished!");
                            console.log(
                              " ⛽️ " +
                                update.gasUsed +
                                "/" +
                                (update.gasLimit || update.gas) +
                                " @ " +
                                parseFloat(update.gasPrice) / 1000000000 +
                                " gwei"
                            );
                  
                            // send notification of stream creation
                            notification.success({
                              message: "Donation Successful",
                              description: `Donation from ${address} successful`,
                              placement: "topRight",
                            }); history.push('/complete')
                          }
                        }
                      );
                      const db = database;
                      set(ref(db, `PoS/` + address), {
                       email: eValue
                      });
                    } catch(err) {
                      notification.error({
                        message: "Donation Not Processed",
                        description: err,
                        placement: "topRight",
                      })
                    }
                  }}
                >
                  Mint
                </button>
              ) : (
                <button
                type="btn btn-primary"
                className="w-1/3 sm:w-1/2 mb-2 mt-2 sm:mt-4 md:mt-6 lg:mt-10 mx-auto sm:py-2 sm:px-2 text-xs md:text-lg sm:mt-5 lg:mt-8 bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                  onClick={loadWeb3Modal}
                >
                  Connect
                </button>
              )}
            </div>

            <div className="pt-8 mx-auto font-spacemono bg-circle bg-left bg-6 sm:bg-fit bg-no-repeat">
          <h3 className="text-center text-sm md:text-xl mx-8 my-8">
              Pledge any amount of ETH above to request a digitally signed book plate from Vitalik.   You'll mint a non-transferable NFT and, when the book is available, you'll gain access to your signed digital copy.
              </h3>
            <h3 className="text-left text-sm md:text-xl mx-8">
          For pledges made here, funds will go 90% to the Gitcoin Grants matching pool and 10% to our publishing
          partner, <a href="https://www.sevenstories.com/books/4443-proof-of-stake">Seven Stories Press</a>, for
          supporting public goods in independent publishing. For book copies purchased here or anywhere, Vitalik has
          committed all of his proceeds to Gitcoin Grants.
        </h3>
          </div>
          </div>
        {/* Removing this component until sizing is fixed */}
        {/* <Quotes /> */}
        <Footer />
      </div>
    </>
  );
}

export default Pledge;
