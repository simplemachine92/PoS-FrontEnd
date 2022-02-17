import React from "react";

// displays a page header

export default function IntroHeader() {
  return (
    // We need proper resizing on book image, button, and fix the "Coming Soon" styling
    <div className="flex flex-wrap bg-ringsBackground bg-no-repeat bg-right bg-auto">
      <div className="flex flex-wrap w-1/2 justify-center bg-no-repeat items-center">
        <div className="max-w-md py-10 px-10">
          <div className="py-10 px-10 backdrop-filter rounded-lg">
            <div className="text-center">
              <img alt="Book" className="mb-8 ml-1" src="assets/book_and_shadow.svg" />
              <button
                href="https://www.boulderbookstore.net/product/proof"
                class="font-spacemono px-12 py-2 mr-10 bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                type="button"
              >
                Pre-order
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap w-1/3">
        <img class="shadow" className="mb-8 object-fit" src="assets/name.svg" />
      </div>
    </div>
  );
}
