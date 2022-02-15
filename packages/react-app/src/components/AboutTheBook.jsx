import React from "react";

export default function AboutTheBook() {
  return (
    <>
      <div className="container px-5 mx-auto mt-10">
        <h6>🤖 Public Goods R Good ❤️</h6>
        <br />
        <h3>
          Vitalik has committed his proceeds from sales of this book to support open-source public goods through Gitcoin
          Grants. Proof of Stake is published under a Creative Commons license for all the world to share.{" "}
        </h3>
        <br />
        <h6>❤️✍️ Get it signed, support public goods 🤖❤️</h6>

        <h3>
          Digital and print books will be available in Fall 2022—but before then, you can order a signed copy. Proceeds
          from signed digital copies go 100% to funding public goods.
        </h3>
      </div>
      <div className="container px-5 mx-auto mt-20">
        <div className="flex flex-wrap -m-4">
          <div className="w-1/3 lg:mb-0 ">
            <div className="h-3/4 text-center">
              <a href="" target="_blank" rel="noreferrer">
                <img
                  alt="twitter"
                  className="h-3/4 w-50 mb-8 object-center inline-block"
                  src="assets/Physical_copy1.svg"
                />
              </a>
            </div>
          </div>
          <div className="w-1/3 lg:mb-0 ">
            <div className="h-full text-center">
              <a href="" target="_blank" rel="noreferrer">
                <img
                  alt="discord"
                  className="h-3/4 w-50 mb-8 -mt-2 object-center inline-block"
                  src="assets/Pledge1.svg"
                />
              </a>
            </div>
          </div>
          <div className="w-1/3 lg:mb-0 ">
            <div className="h-3/4 text-center">
              <a href="" target="_blank" rel="noreferrer">
                <img alt="discord" className="h-3/4 w-50 object-center inline-block" src="assets/Download.svg" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="container px-5 mx-auto">
        <h6>About the book</h6>
        <br />
        <h3 className="text-left">
          These writings, collected from his essays before and during the rise of Ethereum, reveal Buterin to be a vivid
          and imaginative writer, with context from media studies scholar Nathan Schneider.
        </h3>
        <br />
        <h3 className="text-left">
          While many around him were focused on seeing the value of their tokens rise, he was working through the
          problems and possibilities of crafting an Internet-native world.
        </h3>
      </div>
    </>
  );
}
