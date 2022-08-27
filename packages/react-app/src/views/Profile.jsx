import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Button, InputNumber, Input, notification, Spin } from "antd";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { Footer, Quotes } from "../components";

const codec = require("json-url")("lzw");

const { utils, BigNumber } = require("ethers");

const validator = require("email-validator");

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
  const [uEmails, setEmails] = useState();
  const [userReady, setUser] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userAlert, setAlert] = useState(false);

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);
  if (isSignInWithEmailLink(auth, window.location.href)) {
    // Additional state parameters can also be passed via URL.
    // This can be used to continue the user's intended action before triggering
    // the sign-in operation.
    // Get the email if available. This should be available if the user completes
    // the flow on the same device where they started it.
    const email = window.localStorage.getItem("emailForSignIn");
    /* if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt("Please provide your email for confirmation");
    } */
    // The client SDK will parse the code from the link for you.
    signInWithEmailLink(auth, email, window.location.href)
      .then(result => {
        // Clear email from storage.
        /* window.localStorage.removeItem("emailForSignIn"); */
        /* console.log("email cleared, user:", result.user); */
        setAlert(false);
        // You can access the new user via result.user
        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
      })
      .catch(error => {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
      });
  }

  onAuthStateChanged(auth, user => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      setUserEmail(user.reloadUserInfo.email);
      setUser(uid);
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  const decompressTypedData = async data => {
    const _typedData = await codec.decompress(data);
    setTypedData(_typedData);
  };

  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: "https://proofofstake.gitcoin.co/profile",
    // This must be true.
    handleCodeInApp: true,
  };

  const myData = [];

  useEffect(async () => {
    const dbRef = ref(getDatabase(app));
    get(child(dbRef, `PoS/`))
      .then(snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(sig => {
            const message = sig.val().message;

            const sigMsg = message.msg;
            const sigRecipient = message.recipient;
            const pledgeValue = message.pledge;
            const sigTime = message.timestamp;
            message.signature = sig.val().signature;
            message.typedData = sig.val().typedData;
            message.msg = sig.val().message.msg;

            if (address && sigRecipient == address) {
              decompressTypedData(message.typedData);
              myData.push(message);
            }
            setData(myData);
          });
        } else {
        }
      })
      .catch(error => {
        console.error(error);
      });
    setReady(true);
  }, [address]);

  useEffect(async () => {
    if (readContracts.ProofOfStake_Pages && address && tokenId) {
      const nId = await readContracts.ProofOfStake_Pages.tokenOfOwnerByIndex(address, "0");
      const token = await readContracts.ProofOfStake_Pages.tokenURI(nId);
      /* "https://opensea.io/assets/ethereum/0x5bf5bcc5362f88721167c1068b58c60cad075aac/1" */
      setURL(`https://opensea.io/assets/ethereum/${readContracts.ProofOfStake_Pages.address}/${nId}`);
      const json = atob(token.substring(29));
      const result = JSON.parse(json);

      setImage(result.image);
      setMessage(result.message);
    }
  }, [tokenId, address, readContracts]);

  const eData = [];

  return (
    /* Need conditional rendering here, but token getter works */
    <>
      {address && tokenId ? (
        <div>
          <div className="bg-headerBackground bg-cover bg-center bg-no-repeat">
            <h5 className="mt-3 mb-2 font-bold text-sm sm:text-base md:text-lg lg:text-4xl">✨ Profile ✨</h5>
            {/* dev-note This header needs to be split into elements, so loading isn't as clunky */}
            {/* prettier-ignore */}
            <div className="flex flex-wrap items-center justify-center pt-5 mx-auto">
              {/* <h5 className="text-xl font-bold">Your Token</h5> */}
              {image ? (
                <>
                <img
                  className="px-2 py-2 w-1/2 sm:w-1/3 md:w-1/4 md:mx-auto xl:w-3/12 md:py-2 md:px-2 bg-gradient-to-r from-blue-100 to-yellow-pos hover:from-blue-100 hover:to-yellow-poslight rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                  src={image}
                />
                </>
              ) : (
                <>
                <svg
                  className="px-2 py-2 ml-4 w-1/2 sm:w-1/3 lg:w-1/4 xl:w-3/12 md:py-2 md:px-2 animate-pulse"
                  viewBox="0 0 600 830"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="5" y="15" rx="5" ry="5" width="590" height="800" fill="gray" />
                </svg>
              </>
              )}

              {typedData && uMessage != typedData.message.msg ? (
              <div className="w-full md:w-1/2 mx-4 py-4 sm:p-3 md:p-4 lg:p-5 rounded overflow-hidden shadow-xl">
                <h3 className="w-full text-sm text-center text-md md:text-3xl mt-4 mb-4">
              View it on <a href={url}>OpenSea</a>
            </h3>
                <h3 className="text-xs text-center text-md md:text-2xl">You received a personal message!</h3>
                <h3 className="text-2xs text-center text-md md:text-xl mt-4">"{typedData.message.msg}"</h3>
                <br />
                <button
                  className="w- mb-4 py-2 px-2 sm:py-4 text-xs sm:text-xl bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
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
                      
                    }
                  }}
                >
                  Update Token
                </button>
                <br/>
              </div>

              ) : (
                <div className="w-full sm:w-1/2 mx-2 my-2 sm:my-0 sm:mx-auto sm:p-2 rounded overflow-hidden shadow-xl">
                
                <p className="text-white text-center text-lg md:text-3xl">
                  View on <a href={url}>OpenSea</a>
                </p>
                <br/>
                <p className="text-white text-center text-sm md:text-lg">Download your personalized copy starting on September 13, 2022.</p>
                <br/>
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
            {!userReady ? (
              <div className="mx-4 p-5 rounded overflow-hidden shadow-xl">
                <h3 className="text-gray-500 text-center text-md md:text-lg">
                  Want notifications? Enter your E-mail below!
                </h3>
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
                  className="w-1/2 py-2 px-2 mt-4 mx-auto sm:py-4 sm:px-3 text-xs sm:text-lg bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                  onClick={async () => {
                    if (
                      eValue2 == "placeholder" ||
                      eValue2.target.value == "" ||
                      validator.validate(eValue2.target.value) == false
                    ) {
                      notification.error({
                        message: "Please Enter a Valid Email Address",
                        placement: "topRight",
                      });
                    } else {
                      sendSignInLinkToEmail(auth, eValue2.target.value, actionCodeSettings)
                        .then(() => {
                          // The link was successfully sent. Inform the user.
                          // Save the email locally so you don't need to ask the user for it again
                          // if they open the link on the same device.
                          window.localStorage.setItem("emailForSignIn", eValue2.target.value);
                          setAlert(true);
                          // ...
                        })
                        .catch(error => {
                          const errorCode = error.code;
                          const errorMessage = error.message;
                          // ...
                        });
                    }
                  }}
                >
                  Subscribe
                </button>
                {userAlert == true ? (
                  <h3 className="text-red-400 text-center text-md md:text-lg">
                    <br /> We have sent a confirmation link to your email address. <br />
                    Please follow the link to continue.
                  </h3>
                ) : null}
              </div>
            ) : (
              <div className="mx-4 p-5 rounded overflow-hidden shadow-xl">
                <h3 className="text-gray-600 text-center text-sm md:text-lg">Thank you for Registering!</h3>
                {userEmail ? <h3 className="text-gray-500 mt-2 text-center text-sm md:text-md">{userEmail}</h3> : null}
                <h3 className="text-gray-500 mt-6 text-center text-2xs md:text-base">
                  👇 Need to update your email? 👇
                </h3>
                <input
                  className="text-center h-1/2 w-full sm:w-2/3 mt-4 p-2 text-md md:text-lg"
                  placeholder="New @.com"
                  onChange={f => {
                    const currValue2 = f;
                    setE2(currValue2);
                  }}
                />
                <button
                  type="btn btn-primary"
                  className="w-1/2 py-2 px-2 mt-4 mx-auto sm:py-4 sm:px-3 text-xs sm:text-lg bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                  onClick={async () => {
                    if (
                      eValue2 == "placeholder" ||
                      eValue2.target.value == "" ||
                      validator.validate(eValue2.target.value) == false
                    ) {
                      notification.error({
                        message: "Please Enter a Valid Email Address",
                        placement: "topRight",
                      });
                    } else {
                      sendSignInLinkToEmail(auth, eValue2.target.value, actionCodeSettings)
                        .then(() => {
                          // The link was successfully sent. Inform the user.
                          // Save the email locally so you don't need to ask the user for it again
                          // if they open the link on the same device.
                          window.localStorage.setItem("emailForSignIn", eValue2.target.value);
                          setAlert(true);
                          // ...
                        })
                        .catch(error => {
                          const errorCode = error.code;
                          const errorMessage = error.message;
                          // ...
                        });
                    }
                  }}
                >
                  Update
                </button>
              </div>
            )}
            <Footer />
          </div>
        </div>
      ) : (
        <div className="bg-headerBackground h-screen w-full bg-fill bg-center overflow-hidden">
          <div className="">
            <div className="flex items-center justify-center mt-10">
              <h3 className="text-center text-md md:text-3xl"> Please connect your wallet, or mint a token.. </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
