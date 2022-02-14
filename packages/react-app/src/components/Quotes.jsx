import React from "react";

export default function Quotes() {
  return (
    <section class="text-gray-600 body-font">
      <div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div class="w-1/4 mb-10 md:mb-0"></div>
        <div class="lg:flex-grow w-3/4 lg:pl-24 md:pl-16 flex flex-row md:items-start md:text-left items-center text-center">
          <img alt="Chat Text" className="mb-8 -mt-2 inline-block mt-24" src="assets/ChatText.svg" />
          <h1 class="title-font font-spacemono font-bold text-yellow-pos sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
            "Thank you for supporting public goods!"
          </h1>
        </div>
      </div>
    </section>
  );
}
