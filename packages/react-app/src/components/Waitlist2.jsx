import React from "react";
import { useState, useEffect } from "react";
import { Footer, Quotes, AboutTheBook, GitcoinBar, IntroHeader } from ".";

export default function Waitlist2({ readContracts, address, tokenId }) {
  return (
    <>
      <div className="mx-auto px-2 sm:px-3 md:px-4 lg:px-5">
        {/* forked from <a href="https://twitter.com/ivanmolto">@ivanmolto</a> */}
        <iframe
          className="mx-auto w-full mt-5 rounded shadow-xl bg-green-200 h-screen"
          src="https://dune.com/embeds/1223834/2096259/8a52fc93-52cc-4581-957b-90826bf326f1"
          title="chart 1"
        ></iframe>
        {/* <h6 className="text-yellow-pos font-bold mt-3 text-2xs sm:text-base md:text-2xl">
          🚧 Maintenance, check back ina bit! 🚧
          <br />
          In the meantime, view the contract on{" "}
          <a className="text-white" href="https://etherscan.io/address/0x5bf5bcc5362f88721167c1068b58c60cad075aac">
            Etherscan
          </a>
        </h6> */}
        {/* <br />
        <h6 className="text-yellow-pos font-bold text-sm sm:text-base md:text-2xl">
          ❤️✍️ Thanks for donating! What now, you ask? 🤖❤️
        </h6>
        <br />
        {tokenId && image && address ? (
          <>
            <img
              className="px-2 py-2 w-1/2 mx-auto sm:w-1/3 md:w-1/5 md:mx-auto xl:w-3/12 md:py-2 md:px-2 bg-gradient-to-r from-blue-100 to-yellow-pos hover:from-blue-100 hover:to-yellow-poslight rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
              src={image}
            />
          </>
        ) : (
          <>
            <svg
              className="px-2 py-2 w-1/2 mx-auto sm:w-1/3 md:w-1/5 md:mx-auto xl:w-3/12 md:py-2 md:px-2 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out animate-pulse"
              viewBox="0 0 600 830"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="5" y="15" rx="5" ry="5" width="590" height="800" fill="gray" />
            </svg>
          </>
        )}
        <h3 className="text-left text-sm sm:text-base md:text-2xl mt-2">
          You've minted a non-transferable NFT which you may update as Vitalik signs these digital bookplates. Check for
          message updates on your{" "}
          <a href="/profile" rel="_self noreferrer">
            Profile.{" "}
          </a>
          Also, view your token on{" "}
          <a href={url} rel="_self noreferrer">
            Opensea
          </a>
        </h3> */}
      </div>

      <Footer />
    </>
  );
}
