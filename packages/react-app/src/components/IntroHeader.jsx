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
        <div className="max-w-lg py-5">
          <img alt="Book" className="w-1/2 md:w-5/12 mx-auto" src="assets/RasCover.png" />
          <a href="/order" rel="noreferrer">
            <button
              className="w-3/5 md:w-7/12 mt-4 py-2 sm:py-4 text-sm sm:text-xl bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
              type="btn btn-primary"
            >
              Get Started!
            </button>
          </a>
        </div>
      </div>
      <div className="flex flex-wrap w-1/2 2xl:w-1/3">
        <img className="mb-8 object-fit px-2 sm:px-3 md:px-4 lg:px-6" src="assets/rastextneu.png" />
      </div>
    </div>
  );
}
