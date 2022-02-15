import React from "react";

export default function GitcoinBar() {
  return (
    // Bar should be fitting screen, hand may need to be repositioned but heres a start.
    <div className="container relative mx-auto mt-10">
      <img alt="Gitcoin Message" className="mb-8 -mt-2 object-fill max-w-full" src="assets/Gitcoinbar.svg" />
      <img
        alt="Ethereum Hand"
        className="absolute -bottom-0 -right-12 w-1/2 object-scale-down inline-block"
        src="assets/EthereumHand.gif"
      />
    </div>
  );
}
