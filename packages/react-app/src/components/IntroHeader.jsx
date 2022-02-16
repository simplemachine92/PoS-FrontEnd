import React from "react";

// displays a page header

export default function IntroHeader() {
  return (
    // We need proper resizing on book image, button, and fix the "Coming Soon" styling
    <div className="flex flex-wrap mt-10">
      <div className="flex flex-wrap w-1/2 justify-center items-center">
        <div className="max-w-md">
          <div class="mx-auto text-center mt-4 backdrop-blur-md">
            <img alt="discord" className="mb-8 -mt-2 object-scale-down " src="assets/book.svg" />
            <div className="mt-10">
              <a
                href="/order"
                target="_blank"
                rel="noreferrer"
                className="mt-10 font-spacemono bg-yellow-300 px-8 py-4 text-3xl text-gray-900 font-semibold rounded hover:text-white text-base"
              >
                Pre-order
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap w-1/2 pl-16">
        <div class="md:w-1/2 md:pr-12 md:py-8">
          <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-yellow-300">Coming Soon</h1>
          <p className="mt-10 text-6xl font-normal font-bold leading-relaxed">Proof of Stake</p>
          <p class="leading-relaxed text-base text-green-skyblue">By Vitalik Buterin</p>
        </div>
      </div>
    </div>
  );
}
