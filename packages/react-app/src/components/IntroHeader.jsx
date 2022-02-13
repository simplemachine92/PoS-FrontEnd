import React from "react";

// displays a page header

export default function IntroHeader() {
  return (
    <div className="flex flex-wrap mt-10">
      <div className="flex flex-wrap w-1/2 justify-center items-center">
        <div className="max-w-md">
          <div className="player-wrapper">Book</div>
        </div>
      </div>
      <div className="flex flex-wrap w-1/2 pl-16">
        {/* <div className="max-w-md">
          <div className="text-lg mb-6 mt-6">
            <h1 className="float-right">Coming Soon</h1>
            <h2 className="tracking-widest mb-4 text-green-header font-spacemono underline font-bold sm:text-3xl text-2xl float-right">
              Proof of Stake
            </h2>
            <h1>By Vitalik Buterin</h1>
          </div>
        </div> */}

        <div class="md:w-1/2 md:pr-12 md:py-8">
          <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-yellow-300">Coming Soon</h1>
          <p className="mt-10 text-6xl font-normal font-bold leading-relaxed">Proof of Stake</p>
          <p class="leading-relaxed text-base text-green-skyblue">By Vitalik Buterin</p>
        </div>
      </div>
    </div>
  );
}
