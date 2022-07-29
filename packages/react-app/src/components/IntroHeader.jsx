import React, { useState } from "react";

import { Modal } from "antd";

export default function IntroHeader() {
  const [isModal1Visible, setisModal1Visible] = useState(false);
  const [isModal2Visible, setisModal2Visible] = useState(false);
  const [path, sPath] = useState("");

  const [loaded, setLoaded] = useState(false);

  const showModal = () => {
    setisModal1Visible(true);
  };

  const handleNext = () => {
    setisModal1Visible(false);
    setisModal2Visible(true);
  };

  const handleOk = () => {
    if (path == "") {
    } else {
      window.open(path, "_self");
    }
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
  };

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
        <div className="">
          <h1 className="text-black text-2xs sm:text-xs ml-2 text-center">
            Vitalik is committed to supporting open-source public goods, he's releasing a book on September 13.
          </h1>
          <h1 className="text-black text-2xs sm:text-xs mt-4 ml-2 text-center">
            We're pre-gaming by raising funds for public goods with a truly unique NFT, where Vitalik signs a message
            directly on your token. This token is then inserted into your digital copy upon the books release! Cool,
            huh?
          </h1>
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
        <div className="block">
          {/* <span class="text-gray-700">Radio Buttons</span> */}
          <div className="">
            <div onChange={setPath.bind(this)}>
              <label className="inline-flex items-center">
                <input type="radio" className="form-radio text-pink-400" name="radio" value="pledge" />
                <span className="text-black text-xs ml-2 mt-1">Donate & Mint an NFT</span>
              </label>
            </div>
            <div onChange={setPath.bind(this)}>
              <label className="inline-flex items-center">
                <input type="radio" className="form-radio text-pink-400" name="radio" value="order" />
                <span className="text-black text-xs ml-2 mt-1">Pre-Order a Physical Copy</span>
              </label>
            </div>
            <div onChange={setPath.bind(this)}>
              <label className="inline-flex items-center">
                <input type="radio" className="form-radio text-pink-400" name="radio" value="donations" />
                <span className="text-black text-xs ml-2 mt-1">View Donation Leaderboard</span>
              </label>
            </div>
            <div onChange={setPath.bind(this)}>
              <label className="inline-flex items-center">
                <input type="radio" className="form-radio text-pink-400" name="radio" value="signatures" />
                <span className="text-black text-xs ml-2 mt-1">View Signatures from Vitalik</span>
              </label>
            </div>
          </div>
        </div>
      </Modal>
      <div className="flex flex-wrap items-center bg-smallBackground bg-auto bg-right bg-no-repeat sm:bg-ringsBackground">
        <div className="flex flex-wrap w-1/2 sm:w-1/2 justify-center bg-no-repeat">
          <div className="max-w-lg py-5">
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
              className={loaded ? "w-1/2 sm:mt-0 md:w-5/12 mx-auto" : "hidden"}
              src="assets/RasCover.png"
              onLoad={() => setLoaded(true)}
            />
            <button
              className="w-4/5 sm:w-3/5 md:w-7/12 mt-4 py-1 sm:py-4 text-2xs sm:text-xl bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
              type="btn btn-primary"
              onClick={showModal}
            >
              Get Started!
            </button>
          </div>
        </div>
        <div className="flex flex-wrap w-1/2 mx-auto 2xl:w-1/3 3xl:w-1/4 mb-4 md:mb-8">
          <div className="bg-gradient-to-b p-2 from-teal-400 rounded overflow-hidden mr-2 xs:mr-6 xs2:mr-6 lg:mr-20 shadow-xl">
            <p className="text-3xs xs:text-2xs xs2:text-xs sm:text-sm md:text-lg lg:text-xl text-right title-font text-yellow-300">
              Coming September 13, 2022
            </p>
            <p className="font-display text-right text-white text-2xl xs:text-3xl xs1:text-4xl xs2:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-snug">
              Proof of Stake
            </p>
            <h1 className="text-2xs xs2:text-xs sm:text-sm lg:text-lg text-right leading-relaxed text-base text-blue-900">
              By Vitalik Buterin
            </h1>
          </div>
          {/* <img className="object-fit px-2 sm:px-3 md:px-4 lg:px-6" src="assets/rastextneu.png" /> */}
        </div>
      </div>
    </>
  );
}
