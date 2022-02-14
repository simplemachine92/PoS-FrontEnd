import React from "react";
import { Divider } from "antd";
import { Socials } from ".";

export default function Footer() {
  return (
    //prettier-ignore
    <div className="container mx-auto mt-20">
      <Socials />
      <Divider style={{ backgroundColor: "black" }} />
    
      <div className="gitcoin-brand">
        <a href="https://gitcoindao.com">
          <img src="assets/socialmedia/built_by_gitcoin_community.svg" alt="gitcoinDAO" />
        </a>&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;
        <a className="align-middle">Join the Telegram</a>
      </div>
    </div>
  );
}
