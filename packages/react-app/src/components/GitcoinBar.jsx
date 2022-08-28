import React from "react";

export default function GitcoinBar() {
  return (
    // Bar should be fitting screen, hand may need to be repositioned but heres a start.
    <div className="flex w-full max-w-full relative">
      <img alt="Gitcoin Message" className="hidden sm:flex object-fill w-full" src="assets/Content.svg" />
      <img alt="Gitcoin Message" className="object-fill w-full sm:hidden" src="assets/Content-mobile.svg" />
      <img
        alt="Ethereum Hand"
        className="absolute right-4 bottom-0 h-24 w-24 sm:w-32 sm:h-32 md:w-56 md:h-56 lg:h-64 lg:w-64 xl:w-96 xl:h-96 xl:right-32 object-fill"
        src="assets/hand-animation.gif"
      />
    </div>
  );
}
