import React from "react";

// displays a page header

export default function IntroHeader() {
  return (
    // We need proper resizing on book image, button, and fix the "Coming Soon" styling

    /* This bg isn't responsive yet*/
    <div
      class="svg-container"
      className="flex flex-wrap bg-smallBackground bg-auto bg-right bg-no-repeat sm:bg-ringsBackground"
    >
      {/*  */}
      <div className="flex flex-wrap w-1/2 justify-center bg-no-repeat">
        <div className="max-w-md py-10">
          <img alt="Book" className="w-3/5 mx-auto" src="assets/RasCover.png" />
          <a href="/order" target="_blank" rel="noreferrer">
            <button
              className="w-3/4 mt-8 py-2 sm:py-4 text-base sm:text-xl bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
              type="btn btn-primary"
            >
              Pre-Order
            </button>
          </a>
        </div>
      </div>
      <div className="flex flex-wrap w-1/2 md:w-1/3 pr-4 md:pr-2">
        <img className="book and shadow" className="mb-8 object-fit" src="assets/RasText.png" />
      </div>
    </div>
  );
}
