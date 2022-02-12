import React from "react";
import { Divider } from "antd";
import { Socials } from ".";

export default function Footer() {
  return (
    <div className="container mx-auto bg-green-skyblue">
      <Socials />
      <Divider />
      <div>
        <img
          alt="discord"
          className="h-30 w-50 mb-8 object-center inline-block"
          src="assets/socialmedia/built_by_gitcoin_community.svg"
        />{" "}
        | <a>Join the Telegram</a>
      </div>
    </div>
  );
}
