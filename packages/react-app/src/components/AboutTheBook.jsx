import React from "react";
import LazyLoad from "react-lazy-load";

export default function AboutTheBook() {
  return (
    <>
      <div className="bg-midpage bg-right bg-contain sm:bg-fit bg-no-repeat">
        <div className="container px-5 mb-1 pt-3 md:pb-2 md:pt-5 mx-auto font-spacemono">
          <h6 className="text-yellow-pos font-bold text-xs sm:text-base md:text-2xl">
            Get it signed, support public goods
          </h6>
          <h3 className="text-xs mb-5 sm:text-md md:text-lg">
            Digital and print books will be available in Fall 2022—but before then, you can order a signed copy.
            Proceeds from signed digital copies go 100% to funding public goods.
          </h3>
        </div>
        <div className="container mb-12 px-5 mx-auto mt-10 md:mb-24 lg:mb-16 xl:mb-20">
          <div className="flex flex-wrap -m-4">
            <div className="w-1/3 lg:mb-0 ">
              <div className="h-3/4 text-center">
                <a href="/order" rel="noreferrer">
                  <button
                    className="px-1 py-1 w-4/5 md:w-3/4 md:py-4 md:px-4 bg-gradient-to-r from-blue-100 to-yellow-pos hover:from-blue-100 hover:to-yellow-poslight rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                    type="btn btn-primary"
                  >
                    <LazyLoad offsetVertical={400}>
                      <img className="h-3/4 mr-1 object-center inline-block" src="assets/physical-copy-fix.svg" />
                    </LazyLoad>
                  </button>
                </a>
              </div>
            </div>
            <div className="w-1/3 lg:mb-0 ">
              <div className="h-full text-center">
                <a href="/pledge" rel="noreferrer">
                  <button
                    className="px-1 py-1 w-4/5 md:w-3/4 md:py-4 md:px-4 bg-gradient-to-r from-blue-100 to-yellow-pos hover:from-blue-100 hover:to-yellow-poslight rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                    type="btn btn-primary"
                  >
                    <LazyLoad offsetVertical={400}>
                      <img className="h-3/4 object-center inline-block" src="assets/Pledge1.svg" />
                    </LazyLoad>
                  </button>
                </a>
              </div>
            </div>
            <div className="w-1/3 lg:mb-0 ">
              <div className="h-3/4 text-center">
                <a href="/signatures" rel="noreferrer">
                  <button
                    className="px-1 py-1 w-4/5 md:w-3/4 md:py-4 md:px-4 bg-gradient-to-r from-blue-100 to-yellow-pos hover:from-blue-100 hover:to-yellow-poslight rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                    type="btn btn-primary"
                  >
                    <LazyLoad offsetVertical={400}>
                      <img className="h-3/4 object-center inline-block" src="assets/Download.svg" />
                    </LazyLoad>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto font-spacemono bg-circle bg-left bg-6 sm:bg-contain bg-no-repeat">
        <div className="container px-5 mx-auto">
          <h3 className="text-left text-xs mb-5 sm:text-base md:text-lg">
            For pledges made here, funds will go 90% to the Gitcoin Grants matching pool and 10% to our publishing
            partner, <a href="https://www.sevenstories.com/books/4443-proof-of-stake">Seven Stories Press</a>, for
            supporting public goods in independent publishing. For book copies purchased here or anywhere, Vitalik has
            committed all of his proceeds to Gitcoin Grants.
          </h3>

          <h6 className="text-yellow-pos font-bold text-2xl mb-1">About the book</h6>

          <h3 className="text-left text-xs sm:text-base md:text-lg">
            These writings, collected from his essays before and during the rise of Ethereum, reveal Buterin to be a
            vivid and imaginative writer, with context from media studies scholar Nathan Schneider.
          </h3>

          <h3 className="text-left text-xs sm:text-md md:text-lg">
            While many around him were focused on seeing the value of their tokens rise, he was working through the
            problems and possibilities of crafting an Internet-native world.
          </h3>
        </div>
      </div>
    </>
  );
}
