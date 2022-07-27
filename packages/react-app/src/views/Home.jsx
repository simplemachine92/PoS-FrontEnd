import styled from "styled-components";
import React, { Suspense } from "react";
import { Spin } from "antd";
import { Footer, Quotes, AboutTheBook, GitcoinBar, IntroHeader } from "../components";

const FooterLazy = React.lazy(() => import("../components/Footer"));

const AboutLazy = React.lazy(() => import("../components/AboutTheBook"));

const QuotesLazy = React.lazy(() => import("../components/Quotes"));

const GitcoinBarLazy = React.lazy(() => import("../components/GitcoinBar"));

const IntroHeaderLazy = React.lazy(() => import("../components/IntroHeader"));

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 */
function Home({ writeContracts, tx }) {
  return (
    <>
      <IntroHeader />
      <GitcoinBar />
      <AboutTheBook />
      <Footer />
    </>
  );
}

export default Home;
