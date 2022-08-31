import React from "react";
import LazyLoad from "react-lazy-load";

export default function BottomLinks({ daoLogo }) {
  return (
    <>
      <div className="container px-5 md:py-2 lg:py-4 mx-auto flex items-center justify-center">
        <a
          href="https://gitcoindao.com"
          className="flex title-font font-medium items-center justify-center text-gray-900"
        >
          <LazyLoad offsetVertical={300}>
            <img src={daoLogo || "/image/gitcoindao_sign.svg"} className="h-16" alt="gitcoinDAO" />
          </LazyLoad>
          <span style={{ color: "#5bf1cd" }} className="text-white pl-5">
            &
          </span>{" "}
        </a>
        <a
          href="https://moonshotcollective.space/"
          className="flex title-font font-medium items-center justify-center text-gray-900"
        >
          <LazyLoad offsetVertical={300}>
            <img src={"/image/logo-moon-stake.svg" || daoLogo} className="h-16 pl-5" alt="gitcoinDAO" />
          </LazyLoad>
        </a>
      </div>
      <div>
        <p className="text-3xs sm:text-xs md:text-sm text-gray-500 mb-5 mt-1 text-white font-spacemono">
          <span className="text-white">Art by</span>{" "}
          <a href="https://twitter.com/g_uist" className="text-white">
            guist.eth |
          </a>{" "}
          <span className="text-white">Built By</span>{" "}
          <a href="https://twitter.com/nowonderer" className="text-white">
            0xnoWonder |
          </a>{" "}
          <span className="text-white">With</span>{" "}
          <a href="https://github.com/scaffold-eth" className="text-white">
            🏗 Scaffold-eth
          </a>
          <br />
          <a href="https://etherscan.io/address/0x5bf5bcc5362f88721167c1068b58c60cad075aac" className="text-white">
            Etherscan
          </a>
        </p>
      </div>
    </>
  );
}
