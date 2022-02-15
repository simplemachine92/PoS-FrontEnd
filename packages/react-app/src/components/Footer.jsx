import React from "react";
import { Divider } from "antd";
import { Socials } from ".";

export default function Footer() {
  return (
    //prettier-ignore
    <div className="container mx-auto mt-20 mb-3">
      <Socials />
      <Divider style={{ backgroundColor: "black" }} />
    
      <div className="gitcoin-brand">
        <a href="https://gitcoindao.com">
          <img src="assets/socialmedia/built_by_gitcoin_community.svg" alt="gitcoinDAO" />
        </a>{" "} | {" "}
        <a className="align-middle font-spacemono">Join the Telegram</a>
      </div>
    </div>
  );
}
