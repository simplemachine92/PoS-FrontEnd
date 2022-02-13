import React from "react";
import { Divider } from "antd";
import { Socials } from ".";

export default function Footer() {
  return (
    <div className="container mx-auto mt-20">
      <Socials />
      <Divider style={{ backgroundColor: "black" }} />

      <div className="text-3xl font-spacemono">
        <img
          alt="discord"
          className="h-30 w-50 mb-8 object-center inline-block align-middle"
          src="assets/socialmedia/built_by_gitcoin_community.svg"
        />{" "}
        <span className="align-middle">| Join the Telegram</span>
      </div>
    </div>
  );
}
