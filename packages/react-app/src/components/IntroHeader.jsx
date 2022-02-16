import React from "react";

// displays a page header

export default function IntroHeader() {
  return (
    // We need proper resizing on book image, button, and fix the "Coming Soon" styling
    <div className="flex flex-wrap bg-headerBackground bg-no-repeat">
      <div className="flex flex-wrap w-1/2 justify-center items-center">
        <div className="max-w-md py-10 px-10">
          <div className="py-10 px-10 backdrop-filter backdrop-blur-xl rounded-lg">
            <div class="text-center mt-4 backdrop-blur-md">
              <img alt="Book" className="mb-8 -mt-2 object-scale-down " src="assets/book.svg" />
              <a
                href="https://www.google.com"
                target="_blank"
                rel="noreferrer"
                className="mt-10 font-spacemono bg-yellow-300 px-20 py-4 text-lg text-gray-900 font-semibold rounded hover:text-white"
              >
                Pre-order
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap w-1/2 pl-16">
        <div class="md:w-1/2 md:pr-12 md:py-8">
          <img alt="Title" className="mb-8" src="assets/proof_of_stake_home_title.svg" />
          <p class="leading-relaxed text-base text-gray-700 font-spacemono float-right">By Vitalik Buterin</p>
        </div>
      </div>
    </div>
  );
}
