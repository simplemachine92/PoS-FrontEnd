import React from "react";
import { Divider } from "antd";
import { Share } from "react-twitter-widgets";
import { TwitterIcon, TwitterShareButton, FacebookIcon, FacebookShareButton } from "react-share";
import LazyLoad from "react-lazy-load";
import { Socials, BottomLinks } from ".";
import Quotes from "./Quotes";

export default function Footer() {
  return (
    // prettier-ignore

    <div className="container mx-auto mt-10 mb-3">
      {/* Removing socials unless we have proper links */}
      {/* <Socials /> */}
      <TwitterShareButton
      className="mr-10"
        title={"Preorder Vitalik Buterin’s PROOF OF STAKE, published by @7storiespress. You'll support @gitcoin's matching pool for public goods."}
        url="https://proofofstake.gitcoin.co/"
        hashtags={["ProofOfStake", "Gitcoin"]}
      >
        <LazyLoad offsetVertical={300}>
        <img className="w-1/2 sm:w-3/4 md:w-full" alt="twitter" src="assets/twittericon.png" />
        </LazyLoad>
        
      </TwitterShareButton>
      
      <FacebookShareButton
        url="https://proofofstake.gitcoin.co/"
        quote={"Preorder a copy of Vitalik Buterin’s PROOF OF STAKE, published by Seven Stories Press. You'll support Gitcoin's matching pool for public goods."}
        hashtag="#hashtag"
        description="aiueo"
        className=""
      >
        <LazyLoad offsetVertical={300}>
        <img className="w-1/2 sm:w-3/4 md:w-full" alt="facebook" src="assets/facebook_icon.svg" />
        </LazyLoad>
      </FacebookShareButton>
      <Divider style={{ backgroundColor: "white", opacity: 0.5, width: "50%" }} />
      
      <div className="container object-left">
      <BottomLinks daoLogo="assets/socialmedia/built_by_gitcoin_community.svg" />
      </div>
    </div>
  );
}
