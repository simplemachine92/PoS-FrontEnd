import React from "react";

export default function AboutTheBook() {
  return (
    <>
      <div className="container px-5 mx-auto mt-10">
        <h6>Get Your Copy</h6>

        <h3>
          Proof of Stake will be available in September 2022. Until then, make a Gitcoin Pledge to fund public goods,
          receiving a digital copy signed by Vitalik (and an optional NFT). Or, order the physical book (includes a
          signed bookplate)
        </h3>
      </div>
      <div className="container px-5 mx-auto mt-20">
        <div className="flex flex-wrap -m-4">
          <div className="w-1/3 lg:mb-0 ">
            <div className="h-3/4 text-center">
              <a href="" target="_blank" rel="noreferrer">
                <img
                  alt="twitter"
                  className="h-3/4 w-50 mb-8 object-center inline-block"
                  src="assets/Physical_copy.svg"
                />
              </a>
            </div>
          </div>
          <div className="w-1/3 lg:mb-0 ">
            <div className="h-full text-center">
              <a href="" target="_blank" rel="noreferrer">
                <img
                  alt="discord"
                  className="h-3/4 w-50 mb-8 -mt-2 object-center inline-block"
                  src="assets/Pledge.svg"
                />
              </a>
            </div>
          </div>
          <div className="w-1/3 lg:mb-0 ">
            <div className="h-3/4 text-center">
              <a href="" target="_blank" rel="noreferrer">
                <img alt="discord" className="h-3/4 w-50 mb-8 object-center inline-block" src="assets/Download.svg" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="container px-5 mx-auto">
        <h6>About the book</h6>
        <h3>
          These writings, collected from his essays before and during the rise of Ethereum, reveal Buterin to be a vivid
          and imaginative writer, with context from media studies scholar Nathan Schneider.
        </h3>
        <br />
        <h3>
          While many around him were focused on seeing the value of their tokens rise, he was working through the
          problems and possibilities of crafting an Internet-native world.
        </h3>
      </div>
    </>
  );
}
