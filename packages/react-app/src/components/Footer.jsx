import React from "react";
import { Divider } from "antd";
import { Socials, BottomLinks } from ".";
import { Share } from "react-twitter-widgets";
import { TwitterIcon, TwitterShareButton, FacebookIcon, FacebookShareButton } from "react-share";
import Quotes from "./Quotes";

export default function Footer() {
  return (
    //prettier-ignore

    <div className="container mx-auto mt-20 mb-3">
      {/* Removing socials unless we have proper links */}
      {/* <Socials /> */}
      <TwitterShareButton
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
        className="Demo__some-network__share-button ml-2"
      >
        <img alt="facebook" src="assets/facebook_icon.svg" />
      </FacebookShareButton>
      <h3 className="text-sm mx-auto mb-2">Share to help spread the word!</h3>
      <Divider style={{ backgroundColor: "black" }} />
      
      <div className="object-left">
      <BottomLinks daoLogo="assets/socialmedia/built_by_gitcoin_community.svg" />
      </div>
      <div className="object-left">
      </div>
    </div>
  );
}
