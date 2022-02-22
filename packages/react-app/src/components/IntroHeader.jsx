import React from "react";

// displays a page header

export default function IntroHeader() {
  return (
    // We need proper resizing on book image, button, and fix the "Coming Soon" styling

    /* This bg isn't responsive yet*/
    <div
      class="svg-container"
      className="flex flex-wrap bg-ringsBackground bg-contain bg-left bg-no-repeat sm:bg-auto sm:bg-right"
    >
      {/*  */}
      <div className="flex flex-wrap w-1/2 justify-center bg-no-repeat items-center">
        <div className="max-w-md py-10">
          <div className="py-0 backdrop-filter rounded-lg content-center">
            <img alt="Book" className="mb-8 ml-7" src="assets/book_and_shadow.svg" />
            <form action="/order">
              <button
                class="px-14 ml-6 py-2 bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                type="btn btn-primary"
              >
                Pre-Order
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap w-1/3">
        <img class="shadow" className="mb-8 object-fit" src="assets/name.svg" />
      </div>
    </div>
  );
}
