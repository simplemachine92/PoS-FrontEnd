import React from "react";
import "./Quotes.css";

export default function Quotes() {
  return (
    <div className="container px-5 py-6 mx-auto flex items-center justify-center">
      <img
        clasName="motion-safe:animate-spin absolute -bottom-0 -right-12"
        src="assets/eth_circle_3.svg"
        alt="Eth Circle"
      />
      <img clasName="animate-bounce items-center justify-center -mr-32" src="assets/ChatText.svg" alt="Chat Message" />
      <div className="w-1/2 sm:ml-6 mt-20">
        <h1 class="title-font font-spacemono font-bold text-yellow-pos sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
          "Thank you for supporting public goods!"
        </h1>
      </div>
    </div>
  );
}
