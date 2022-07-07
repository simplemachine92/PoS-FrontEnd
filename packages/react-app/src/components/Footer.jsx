import React from "react";
import { Divider } from "antd";
import { Socials, BottomLinks } from ".";
import { Share } from "react-twitter-widgets";
import { TwitterIcon, TwitterShareButton, FacebookIcon, FacebookShareButton } from "react-share";
import Quotes from "./Quotes";

export default function Footer() {
  return (
    //prettier-ignore

    <div className="container mx-auto mt-10 mb-3">
      {/* Removing socials unless we have proper links */}
      {/* <Socials /> */}
      <TwitterShareButton
      className="mr-10"
        title={"Preorder Vitalik Buterin’s PROOF OF STAKE, published by @7storiespress. You'll support @gitcoin's matching pool for public goods."}
        url={"https://proofofstake.gitcoin.co/"}
        hashtags={["ProofOfStake", "Gitcoin"]}
      >
        <img alt="twitter" src="assets/twittericon.png" />
        
        
      </TwitterShareButton>
      
      <FacebookShareButton
        url={"https://proofofstake.gitcoin.co/"}
        quote={"Preorder a copy of Vitalik Buterin’s PROOF OF STAKE, published by Seven Stories Press. You'll support Gitcoin's matching pool for public goods."}
        hashtag={"#hashtag"}
        description={"aiueo"}
        className=""
      >
        <img alt="facebook" src="assets/facebook_icon.svg" />
      </FacebookShareButton>
      <Divider style={{ backgroundColor: "black" }} />
      
      <div className="container object-left">
      <BottomLinks daoLogo="assets/socialmedia/built_by_gitcoin_community.svg" />
      </div>
    </div>
  );
}
