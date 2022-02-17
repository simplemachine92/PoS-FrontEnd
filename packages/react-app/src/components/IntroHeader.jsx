import React from "react";

// displays a page header

export default function IntroHeader() {
  return (
    // We need proper resizing on book image, button, and fix the "Coming Soon" styling
    <div className="flex flex-wrap bg-ringsBackground bg-no-repeat bg-right bg-auto">
      <div className="flex flex-wrap w-1/2 justify-center bg-headerBackground bg-cover bg-no-repeat items-center">
        <div className="max-w-md py-10 px-10">
          <div className="py-10 px-10 backdrop-filter backdrop-blur-xl rounded-lg">
            <div className="text-center mt-4 backdrop-blur-md">
              <img alt="Book" className="mb-8 ml-1" src="assets/book_and_shadow.svg" />
              <button
                href="https://www.boulderbookstore.net/product/proof"
                class="font-spacemono px-12 py-2 mr-10 font-semibold bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                type="button"
              >
                Pre-order
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap w-1/2 pl-16">
        <div className="md:w-1/2 md:pr-12 md:py-8">
          <img alt="Title" className="mb-8" src="assets/proof_of_stake_home_title.svg" />
          <p className="leading-relaxed text-base text-gray-700 font-spacemono float-right">By Vitalik Buterin</p>
        </div>
      </div>
    </div>
  );
}
