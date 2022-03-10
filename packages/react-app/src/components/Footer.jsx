import React from "react";
import { Divider } from "antd";
import { Socials, BottomLinks } from ".";
import { Share } from "react-twitter-widgets";
import { TwitterIcon, TwitterShareButton, FacebookIcon, FacebookShareButton } from "react-share";

export default function Footer() {
  return (
    //prettier-ignore

    <div className="container mx-auto mt-20 mb-3">
      {/* Removing socials unless we have proper links */}
      {/* <Socials /> */}
      <Divider style={{ backgroundColor: "black" }} />
      <div className="object-left">
      <BottomLinks daoLogo="assets/socialmedia/built_by_gitcoin_community.svg" />
      <TwitterShareButton
        title={"Preorder Vitalik Buterin’s PROOF OF STAKE, published by @7storiespress. You'll support @gitcoin's matching pool for public goods."}
        url={"https://proofofstake.gitcoin.co/"}
        hashtags={["ProofOfStake", "Gitcoin"]}
      >
        <TwitterIcon size={48} round />
        
      </TwitterShareButton>
      <FacebookShareButton
        url={"https://proofofstake.gitcoin.co/"}
        quote={"Preorder a copy of Vitalik Buterin’s PROOF OF STAKE, published by Seven Stories Press. You'll support Gitcoin's matching pool for public goods."}
        hashtag={"#hashtag"}
        description={"aiueo"}
        className="Demo__some-network__share-button"
      >
        <FacebookIcon size={40} round /> <h3 className="text-sm text-green-100">Share</h3>
      </FacebookShareButton>
      </div>
    </div>
  );
}
