import React from "react";
import { Footer, Quotes, AboutTheBook, GitcoinBar, IntroHeader } from "../components";

export default function AfterPledge() {
  return (
    <>
      <div className="container px-5 mx-auto mt-10 font-spacemono">
        <br />
        <h6 className="text-yellow-pos font-bold text-3xl">❤️✍️ Thanks for donating! What now?! 🤖❤️</h6>
        <br />
        <h3 className="text-2xl">
          You've been minted an NFT which can be updated if Vitalik signs a message to you! Check your{" "}
          <a href="/profile" target="_blank" rel="noreferrer">
            Profile
          </a>{" "}
          page for updates{" "}
        </h3>
      </div>

      <Footer />
    </>
  );
}
