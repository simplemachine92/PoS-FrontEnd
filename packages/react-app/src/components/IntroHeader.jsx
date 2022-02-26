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
      <div className="flex flex-wrap w-1/2 justify-center bg-no-repeat items-center">
        <div className="max-w-md py-10">
          <div className="">
            <img alt="Book" className="object-scale-down" src="assets/book_and_shadow.svg" />
            <form action="/order">
              <button
                className="w-3/4 mr-8 mt-2 py-2 md:mr-12 md:py-4 text-base md:text-xl bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                type="btn btn-primary"
              >
                Pre-Order
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap w-1/2 md:w-1/3 pr-4 md:pr-2">
        <img className="book and shadow" className="mb-8 object-fit" src="assets/name.svg" />
      </div>
    </div>
  );
}
