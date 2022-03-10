import styled from "styled-components";
import React, { useState } from "react";
import { Button, InputNumber, Input } from "antd";
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

  const app = initializeApp(firebaseConfig);

  // Get a reference to the database service
  const database = getDatabase(app);

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
              <img class="shadow" className="object-scale-down" src="assets/RasText.png" />
            </div>
            <div className="flex flex-wrap w-1/2 justify-center items-center mx-auto">
              <div className="max-w-md py-10 mx-auto">
                <div className="py-0 backdrop-filter rounded-lg content-center mx-auto">
                  <img alt="Book" className="w-1/2 mb-4 mx-auto" src="assets/RasCover.png" />
                  
                    <p
                    >
                      
                    </p>
                  
                </div>
              </div>
            </div>

        <footer className="">
          
            <div>
              <h5 className="font-bold mt-6">Make a Donation</h5>

              <h3 className="text-sm p-10">
              Pledge any amount of ETH below to request a digitally signed book plate from Vitalik. Enter your email to be notified when the digital book is available.
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
                onPressEnter={async () => {
                  try {
                    const txCur = await tx(
                      writeContracts.ProofOfStake_Pages.pledge({ value: utils.parseEther(uValue) }),
                    );
                    await txCur.wait();
                  } catch {}
                }}
              />
              <br/>
              <label>Please Enter an Email</label><br/>
                <StyledInput
                className="w-3/4 mx-auto mt-5 mr-5 ml-5"
                maxLength={320}
                placeholder="email"
                onChange={f => {
                  const currValue2 = f;
                  setE(currValue2);
                }}
                onPressEnter={() => {const db = database;
                  set(ref(db, `PoS/` + address), {
                   email: eValue.target.value
                  });
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

                      const txCur = await tx(
                        writeContracts.ProofOfStake_Pages.pledge({ value: utils.parseEther(uValue) }),
                      );
                      await txCur.wait();
                      // We need a redirect to /complete, this isnt working.

                      //return <Redirect to="/complete" />;
                    } catch {
                      console.log("button pledge failed");
                    }
                  }}
                >
                  Submit
                </button>
              ) : (
                
                <button
                type="btn btn-primary"
                  className="w-3/4 py-2 px-2 mt-4 mx-auto sm:py-4 sm:px-3 text-sm md:text-lg bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                  style={{ marginTop: 40, width: "30%" }}
                  onClick={loadWeb3Modal}
                >
                  Connect
                </button>
              )}
            </div>
          

          <div>
            <br />
            <p className="text-center mx-5 text-white italic text-xs">
          For pledges made here, funds will go 90% to the Gitcoin Grants matching pool and 10% to our publishing
          partner, <a href="https://www.sevenstories.com/books/4443-proof-of-stake">Seven Stories Press</a>, for
          supporting public goods in independent publishing. For book copies purchased here or anywhere, Vitalik has
          committed all of his proceeds to Gitcoin Grants.
        </p>
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
