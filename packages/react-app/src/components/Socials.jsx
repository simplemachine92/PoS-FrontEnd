import React from "react";

export default function Socials() {
  return (
    <div className="container px-5 mx-auto mt-10">
      <div className="flex flex-wrap -m-4">
        <div className="w-1/3 lg:mb-0 p-4">
          <div className="h-full text-center">
            <a href="" target="_blank" rel="noreferrer">
              <img
                alt="twitter"
                className="h-10 w-10 mb-8 object-center inline-block"
                src="assets/socialmedia/youtube.svg"
              />
            </a>
          </div>
        </div>
        <div className="w-1/3 lg:mb-0 p-4">
          <div className="h-full text-center">
            <a href="" target="_blank" rel="noreferrer">
              <img
                alt="discord"
                className="h-10 w-10 mb-8 -mt-2 object-center inline-block"
                src="assets/socialmedia/twitter.svg"
              />
            </a>
          </div>
        </div>
        <div className="w-1/3 lg:mb-0 p-4">
          <div className="h-full text-center">
            <a href="" target="_blank" rel="noreferrer">
              <img
                alt="discord"
                className="h-10 w-10 mb-8 object-center inline-block"
                src="assets/socialmedia/telegram.svg"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
