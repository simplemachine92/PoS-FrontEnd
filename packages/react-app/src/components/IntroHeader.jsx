import React from "react";
import { useState } from "react";
import { Modal, Radio } from "antd";

export default function IntroHeader() {
  const [isModal1Visible, setisModal1Visible] = useState(false);
  const [isModal2Visible, setisModal2Visible] = useState(false);
  const [path, sPath] = useState("");

  const showModal = () => {
    setisModal1Visible(true);
  };

  const handleNext = () => {
    setisModal1Visible(false);
    setisModal2Visible(true);
  };

  const handleOk = () => {
    window.open(path);
    /* setisModal1Visible(false); */
  };

  const handleCancel = () => {
    setisModal1Visible(false);
  };

  const handleCancel2 = () => {
    setisModal2Visible(false);
    setisModal1Visible(false);
  };

  const setPath = event => {
    sPath(event.target.value);
    console.log("path", event.target.value);
  };

  /* const [selectRadio, setselectRadio] = useState("");

  const select = e => {
    // you can save the value in here
    setselectRadio(e.target.value);
    console.log(e.target.value);
  }; */

  return (
    // We need proper resizing on book image, button, and fix the "Coming Soon" styling
    <>
      <Modal
        title="✨ Whats going on?! ✨"
        closable={false}
        maskTransitionName=""
        visible={isModal1Visible}
        okText="Next"
        cancelText="Close"
        onOk={handleNext}
        onCancel={handleCancel}
        bodyStyle={{
          backgroundColor: "#e3e3e3",
        }}
      >
        <div class="">
          <p class="text-black text-2xs sm:text-xs ml-2 text-center">
            Vitalik is commited to supporting open-source public goods, he's releasing a book on September 13.
          </p>
          <p class="text-black text-2xs sm:text-xs mt-4 ml-2 text-center">
            We're pre-gaming by raising funds for public goods with a truly unique NFT, where Vitalik signs a message
            directly on your token. This token is then inserted into your digital copy upon the books release! Cool,
            huh?
          </p>
        </div>
      </Modal>
      <Modal
        transitionName=""
        closable={false}
        maskTransitionName=""
        visible={isModal2Visible}
        okText="Open"
        cancelText="Cancel"
        onOk={handleOk}
        onCancel={handleCancel2}
        title="Choose your Path 🧙‍♂️"
        bodyStyle={{
          backgroundColor: "#e3e3e3",
        }}
      >
        <div class="block">
          {/* <span class="text-gray-700">Radio Buttons</span> */}
          <div class="mt-2">
            <p className="text-2xs mb-4">
              (We'll redirect you to the right page in a new window so you can come back.)
            </p>
            <div onChange={setPath.bind(this)}>
              <label class="inline-flex items-center">
                <input type="radio" class="form-radio text-pink-400" name="radio" value="pledge" />
                <span class="text-black text-xs ml-2 mt-1">Donate & Mint an NFT</span>
              </label>
            </div>
            <div onChange={setPath.bind(this)}>
              <label class="inline-flex items-center">
                <input type="radio" class="form-radio text-pink-400" name="radio" value="order" />
                <span class="text-black text-xs ml-2 mt-1">Pre-Order a Physical Copy</span>
              </label>
            </div>
            <div onChange={setPath.bind(this)}>
              <label class="inline-flex items-center">
                <input type="radio" class="form-radio text-pink-400" name="radio" value="donations" />
                <span class="text-black text-xs ml-2 mt-1">View Donation Leaderboard</span>
              </label>
            </div>
            <div onChange={setPath.bind(this)}>
              <label class="inline-flex items-center">
                <input type="radio" class="form-radio text-pink-400" name="radio" value="signatures" />
                <span class="text-black text-xs ml-2 mt-1">View Signatures from Vitalik</span>
              </label>
            </div>
          </div>
        </div>
      </Modal>
      <div
        class="svg-container"
        className="flex flex-wrap items-center bg-smallBackground bg-auto bg-right bg-no-repeat sm:bg-ringsBackground"
      >
        <div className="flex flex-wrap w-1/3 sm:w-1/2 justify-center bg-no-repeat">
          <div className="max-w-lg py-5">
            <img alt="Book" className="w-1/2 sm:mt-0 md:w-5/12 mx-auto" src="assets/RasCover.png" />
            <button
              className="w-4/5 sm:w-3/5 md:w-7/12 mt-4 py-1 sm:py-4 text-2xs sm:text-xl bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
              type="btn btn-primary"
              onClick={showModal}
            >
              Get Started!
            </button>
          </div>
        </div>
        <div className="flex flex-wrap w-2/3 sm:w-1/2 2xl:w-1/3 mb-6 md:mb-8">
          <img className="object-fit px-2 sm:px-3 md:px-4 lg:px-6" src="assets/rastextneu.png" />
        </div>
      </div>
    </>
  );
}
