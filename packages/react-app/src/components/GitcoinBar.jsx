import React from "react";

export default function GitcoinBar() {
  return (
    <div className="container relative mx-auto mt-10">
      <img alt="discord" className="mb-8 -mt-2 object-fill " src="assets/Gitcoinbar.svg" />
      <img
        alt="discord"
        className="absolute -bottom-0 -right-12 w-1/2 object-scale-down inline-block"
        src="assets/EthereumHand.gif"
      />
    </div>
  );
}
