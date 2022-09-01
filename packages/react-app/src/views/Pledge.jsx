import styled from "styled-components";
import React, { useState, Suspense } from "react";
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
  const [uValue, setU] = useState("0.1337");
  const [eValue, setE] = useState("placeholder");
  const [loaded, setLoaded] = useState(false);
  const [loaded2, setLoaded2] = useState(false);

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
        {/* prettier-ignore */}
        <div className="flex flex-wrap bg-headerBackground bg-contain bg-top-right bg-no-repeat">
            <div className="py-2 flex w-3/4 sm:w-1/2 mx-auto justify-center">
              <div className="mx-auto">
              <h5 className="mb-4 font-bold text-2xs sm:text-tiny md:text-lg lg:text-2xl">✨ Your Personal Digital Copy & NFT ✨</h5>
                <div className="flex py-0 backdrop-filter content-center mx-auto">
                {loaded ? null : (
              <svg
                className="w-1/2 sm:mt-0 md:w-5/12 mx-auto animate-pulse"
                viewBox="0 0 600 830"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="5" y="15" rx="5" ry="5" width="590" height="800" fill="gray" />
              </svg>
            )}
            <img
              className={loaded ? "w-1/2 p-2 sm:mt-0 md:w-5/12 mx-auto" : "hidden"}
              src="assets/RasCover.png"
              onLoad={() => setLoaded(true)}
            />
              {loaded2 ? null : (
              <svg
              className="px-2 py-2 ml-4 w-1/2 sm:w-1/2 md:w-1/2 md:py-2 md:px-2 animate-pulse"
              viewBox="0 0 600 830"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="5" y="15" rx="5" ry="5" width="590" height="800" fill="gray" />
            </svg>
            )}
            <img
              className={loaded2 ? "lg:mx-4 pt-1 w-1/2 sm:w-1/2 md:w-1/2 rounded-xl md:rounded-2xl" : "hidden"}
              src="assets/plate.png"
              onLoad={() => setLoaded2(true)}
            />
                </div>
              </div>
            </div>
            <div className="flex-wrap mt-2 px-1 py-1 sm:px-4 sm:py-10 md:py-12 lg:py-16 xl:py-18 w-3/4 sm:w-2/5 mx-auto content-center rounded overflow-hidden shadow-2xl">
            <h5 className="font-bold pt-4 sm:pt-4 md:py-6 text-xs sm:text-lg md:text-2xl lg:text-3xl">Donate & Mint</h5>
              <label className="text-2xs sm:text-sm md:text-md lg:text-xl">Enter ETH Amount</label>
              <InputNumber
                className="form mx-auto w-full mb-2 sm:w-1/2 md:w-3/4"
                bordered={false}
                onChange={e => {
                  const currValue = String(e);
                  setU(currValue);
                }}
                defaultValue={0.1337}
              />
              {/* <h3 className="text-2xs sm:text-2xs md:text-xs mt-3 md:mt-5 mx-2">Optional: Provide an email for notifications.</h3> */}
             {/*  <input
              type="form"
                  maxLength="160"
                  className="mx-auto w-4/5"
                  placeholder="your@.com"
                  onChange={f => {
                    const currValue2 = f;
                    setE(currValue2);
                  }}
                /> */}
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
                          
                          if (update && (update.status === "confirmed" || update.status === 1)) {
                            
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
              <h3 className="mb-2 sm:mb-0 text-2xs sm:text-2xs md:text-xs md:mt-4">New here? More info below. 👇</h3>
            </div>

            <div className="pt-8 mx-auto font-spacemono bg-circle bg-left bg-6 sm:bg-fit bg-no-repeat">
          <p className="text-white text-left text-sm md:text-xl mb-4 mx-8 sm:mb-4 md:mb-8">
              Donate any amount of ETH above to receive an NFT and digitally signed book from Vitalik.   You'll mint a non-transferable NFT and, when the book is available, you'll gain access to your signed digital copy.
              </p>
            <p className="text-white text-left text-sm md:text-xl mx-8">
          For pledges made here, funds will go 90% to the Gitcoin Grants matching pool and 10% to our publishing
          partner, <a href="https://www.sevenstories.com/books/4443-proof-of-stake">Seven Stories Press</a>, for
          supporting public goods in independent publishing. For book copies purchased here or anywhere, Vitalik has
          committed all of his proceeds to Gitcoin Grants.
        </p>
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
