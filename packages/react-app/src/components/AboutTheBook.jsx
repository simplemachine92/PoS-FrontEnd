import React from "react";

export default function AboutTheBook() {
  return (
    <>
      <div className="container px-5 mx-auto mt-10 font-spacemono">
        <br />
        <h6 className="text-yellow-pos font-bold text-2xl">❤️✍️ Get it signed, support public goods</h6>
        <br />
        <h3 className="text-lg">
          Digital and print books will be available in Fall 2022—but before then, you can order a signed copy. Proceeds
          from signed digital copies go 100% to funding public goods.
        </h3>
      </div>
      <div className="container px-5 mx-auto mt-20 sm:mb-48 md:mb-24 lg:mb-16 xl:mb-20">
        <div className="flex flex-wrap -m-4">
          <div className="w-1/3 lg:mb-0 ">
            <div className="h-3/4 text-center">
              <a href="/order" target="_blank" rel="noreferrer">
                <img className="h-3/4 mb-8 mr-1 object-center inline-block" src="assets/Physical_copy1.svg" />
              </a>
            </div>
          </div>
          <div className="w-1/3 lg:mb-0 ">
            <div className="h-full text-center">
              <a href="/pledge" target="_blank" rel="noreferrer">
                <img className="h-3/4 ml-1 -mt-2 object-center inline-block" src="assets/Pledge1.svg" />
                <br />
                {/* <p className="text-center mx-auto text-white italic text-xs">
                  For pledges made here, 90% of funds go to the Gitcoin Grants matching pool and 10% to our publishing
                  partner, Seven Stories Press.
                </p> */}
              </a>
            </div>
          </div>
          <div className="w-1/3 lg:mb-0 ">
            <div className="h-3/4 text-center">
              <a href="/signatures" target="_blank" rel="noreferrer">
                <img className="h-3/4 ml-1 object-center inline-block" src="assets/Download.svg" />
              </a>
            </div>
            <br />
          </div>
        </div>
      </div>
      <div className="container px-5 mx-auto font-spacemono">
        <h6 className="text-yellow-pos font-bold text-2xl">About the book</h6>
        <br />
        <h3 className="text-left text-lg">
          These writings, collected from his essays before and during the rise of Ethereum, reveal Buterin to be a vivid
          and imaginative writer, with context from media studies scholar Nathan Schneider.
        </h3>
        <br />
        <h3 className="text-left text-lg">
          While many around him were focused on seeing the value of their tokens rise, he was working through the
          problems and possibilities of crafting an Internet-native world.
        </h3>
      </div>
    </>
  );
}
