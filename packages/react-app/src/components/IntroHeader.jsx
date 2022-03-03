import React from "react";

// displays a page header

export default function IntroHeader() {
  return (
    // We need proper resizing on book image, button, and fix the "Coming Soon" styling

    /* This bg isn't responsive yet*/
    <div
      class="svg-container"
      /* bg-smallBackground bg-auto bg-right bg-no-repeat sm:bg-ringsBackground */
      className="flex flex-wrap "
    >
      {/*  */}
      <div className="flex flex-wrap w-1/2 justify-center bg-no-repeat">
        <div className="max-w-md py-10">
          <img alt="Book" className="w-4/5 mx-auto" src="assets/phoenix_tbg.png" />
          <a href="/order" target="_blank" rel="noreferrer">
            <button
              className="w-3/4 mt-8 py-2 sm:py-4 text-base sm:text-xl bg-gradient-to-r from-red-400 to-yellow-pos hover:from-red-400 hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
              type="btn btn-primary"
            >
              Claim Now
            </button>
          </a>
        </div>
      </div>
      <div className="flex flex-wrap w-1/2 md:w-1/3 pr-4 md:pr-2">
        <img className="book and shadow" className="mb-8" src="assets/phoenix_text2.png" />
      </div>
    </div>
  );
}
