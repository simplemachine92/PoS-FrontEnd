import React from "react";

export default function BottomLinks() {
  return (
    <div>
      <div className="container px-5 py-6 mx-auto flex items-center justify-center">
        <a
          href="https://gitcoindao.com"
          className="flex title-font font-medium items-center justify-center text-gray-900"
        >
          <img src="/image/gitcoindao_sign.svg" alt="gitcoinDAO" />
        </a>
        <p className="text-3xl text-gray-500 sm:ml-6 sm:mt-4 mt-2 text-white font-spacemono">
          <span className="text-white">|</span>{" "}
          <a href="https://t.me/+g9TM8i7GpxAzMGUx" className="text-white">
            Join the Telegram
          </a>
        </p>
      </div>
    </div>
  );
}
