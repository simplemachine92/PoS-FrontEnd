import React from "react";

export default function BottomLinks({ daoLogo }) {
  return (
    <div className="container px-5 py-6 mx-auto flex items-center justify-center">
      <a
        href="https://gitcoindao.com"
        className="flex title-font font-medium items-center justify-center text-gray-900"
      >
        <img src={daoLogo || "/image/gitcoindao_sign.svg"} className="h-16" alt="gitcoinDAO" />
        <span style={{ color: "#5bf1cd" }} className="text-white pl-5">
          &
        </span>{" "}
      </a>
      <a
        href="https://moonshotcollective.space/"
        className="flex title-font font-medium items-center justify-center text-gray-900"
      >
        <img src={"/image/logo-moon-stake.svg" || daoLogo} className="h-16 pl-5" alt="gitcoinDAO" />
      </a>
      <p className="text-xl text-gray-500 sm:ml-6 sm:mt-4 mt-2 text-white font-spacemono">
        {/* <span className="text-white">|</span>{" "}
        <a href="https://t.me/+g9TM8i7GpxAzMGUx" className="text-white">
          Join the Telegram
        </a> */}
      </p>
    </div>
  );
}
