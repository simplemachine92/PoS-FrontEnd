import React from "react";
import { Footer, Quotes, AboutTheBook, GitcoinBar, IntroHeader } from ".";

export default function AfterPledge() {
  return (
    <>
      <div className="bg-headerBackground bg-contain bg-top-right bg-no-repeat px-5 mx-auto mt-10 font-spacemono">
        <br />
        <h6 className="text-yellow-pos font-bold text-3xl">❤️✍️ Thanks for donating! What now, you ask? 🤖❤️</h6>
        <br />
        <h3 className="text-2xl">
          You've minted a non-transferable NFT which you may update as Vitalik signs these digital bookplates. Check for
          message updates on your{" "}
          <a href="/profile" rel="_self noreferrer">
            Profile
          </a>
        </h3>
      </div>

      <Footer />
    </>
  );
}
