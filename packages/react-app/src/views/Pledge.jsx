import styled from "styled-components";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { Button, InputNumber, Input, notification } from "antd";
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
function Pledge({ writeContracts, tx, address, loadWeb3Modal }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const [uValue, setU] = useState("0.01337");
  const [eValue, setE] = useState();

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
  //firebase.initializeApp({}, "your app name here");

  // Get a reference to the database service
  const database = getDatabase(app);

  const history = useHistory();

  /* function getString() {
    console.log("kms", );
    return String(eValue);
  } */

  return (
    <>
      <div>
        <div className="">
          {/* dev-note This header needs to be split into elements, so loading isn't as clunky */}
          {/* prettier-ignore */}
          <div className="flex flex-wrap bg-headerBackground bg-contain bg-top-right bg-no-repeat">
            <div className="flex flex-wrap w-2/5 mx-auto">
              <img class="shadow" className="" src="assets/DonationText.png" />
            </div>
            <div className="flex flex-wrap w-1/2 justify-center items-center mx-auto">
              <div className="max-w-md py-10 mx-auto">
                <div className="py-0 backdrop-filter rounded-lg content-center mx-auto">
                  <img alt="Book" className="w-3/5 mb-4 md:w-3/4 mx-auto" src="assets/RasCover.png" />
                  
                    <p
                    >
                      
                    </p>
                  
                </div>
              </div>
            </div>

        <footer className="">
          
            <div className="bg-circle bg-left-bottom bg-fit bg-no-repeat">
              <h5 className="font-bold mt-12 md:mb-20">Make a Donation</h5>

              <h3 className="text-sm p-10 md:text-2xl">
              Pledge any amount of ETH below to request a digitally signed book plate from Vitalik. 
              </h3>

<label>Enter ETH Amount</label>
              <InputNumber
                className="form w-3/4 mx-auto my-auto"
                bordered={false}
                onChange={e => {
                  const currValue = String(e);
                  setU(currValue);
                }}
                step={0.1}
                defaultValue={0.01337}
                
              />
              <br/>
              {/* "Pledge any amount of ETH to request a digitally signed book plate from Vitalik. Watch the profile page to see your token and your digital book when it is available." */}
              <h3 className="text-sm mt-10 md:text-2xl mx-2" >Optionally, Enter your email to be notified when the digital book is available.</h3>
                <StyledInput
                className="w-3/4 mt-5 mx-auto"
                maxLength={160}
                placeholder="email"
                onChange={f => {
                  const currValue2 = f;
                  setE(currValue2);
                }}

              />
              
              {address ? (
                <button
                type="btn btn-primary"
                  className="w-3/4 py-2 px-2 mt-4 mx-auto sm:py-4 sm:px-3 text-sm md:text-lg bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                  style={{ marginTop: 40, width: "30%" }}
                  onClick={async () => {
                    try {

                      const db = database;
                      set(ref(db, `PoS/` + address), {
                       email: eValue.target.value
                      });

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

                      /* const txCur = await tx(
                        writeContracts.ProofOfStake_Pages.pledge({ value: utils.parseEther(uValue) }),
                      ); */
                      /* await txCur.wait(); */
                      // We need a redirect to /complete, this isnt working.

                      //return <Redirect to="/complete" />;
                    } catch {
                      notification.error({
                        message: "Donation Not Processed",
                        description: `An error has occured, or you may have already donated.`,
                        placement: "topRight",
                      })
                    }
                  }}
                >
                  Submit
                </button>
              ) : (
                
                <button
                type="btn btn-primary"
                  className="w-3/4 py-2 px-2 mt-4 mx-auto sm:py-4 sm:px-3 text-sm md:text-2xl bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                  style={{ marginTop: 40, width: "30%" }}
                  onClick={loadWeb3Modal}
                >
                  Connect
                </button>
              )}
            </div>
          

          <div className="">
            <br />
            <h3 className="text-left text-sm md:text-xl mx-8">
          For pledges made here, funds will go 90% to the Gitcoin Grants matching pool and 10% to our publishing
          partner, <a href="https://www.sevenstories.com/books/4443-proof-of-stake">Seven Stories Press</a>, for
          supporting public goods in independent publishing. For book copies purchased here or anywhere, Vitalik has
          committed all of his proceeds to Gitcoin Grants.
        </h3>
          </div>
          {/* Removing this component until sizing is fixed */}
          {/* <Quotes /> */}
          <Footer />
        </footer>
      </div>
        </div>
      </div>
    </>
  );
}

export default Pledge;
