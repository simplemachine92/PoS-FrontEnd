import React from "react";
import "./Quotes.css";

export default function Quotes() {
  return (
    <div className="container gap-4 px-5 py-6 mx-auto flex flex-col md:flex-row items-center justify-center max-w-11/12">
      <div className="w-full md:w-4/12">
        <img className="w-full" src="assets/eth_circle_3.svg" alt="Eth Circle" />
      </div>
      <div className="w-full flex items-center md:w-6/12 gap-4">
        <img className="w-1/2" src="assets/ChatText.svg" alt="Chat Message" />
        <div className="w-1/2">
          <p class="font-spacemono font-bold text-yellow-pos text-md sm:text-4xl mb-4">
            "Thank you for supporting public goods!"
          </p>
        </div>
      </div>
    </div>
  );
}
