import { utils, ethers } from "ethers";
import React, { useState, useEffect } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { Spin } from "antd";

export default function Book({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [newPurpose, setNewPurpose] = useState("loading...");
  const [hodler, setHodler] = useState();
  const [sData, setData] = useState();
  const [ulink, setuLink] = useState();

  /**
   * converts a base64 encoded data url SVG image to a PNG image
   * @param originalBase64 data url of svg image
   * @param width target width in pixel of PNG image
   * @return {Promise<String>} resolves to png data url of the image
   */
  function base64SvgToBase64Png(originalBase64, width, height) {
    return new Promise(resolve => {
      let img = document.createElement("img");
      img.onload = function () {
        document.body.appendChild(img);
        let canvas = document.createElement("canvas");
        let ratio = img.clientWidth / img.clientHeight || 1;
        document.body.removeChild(img);
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        try {
          let data = canvas.toDataURL("image/png");
          resolve(data);
        } catch (e) {
          resolve(null);
        }
      };
      img.src = originalBase64;
    });
  }

  async function insertPage(png) {
    // These should be Uint8Arrays or ArrayBuffers
    // This data can be obtained in a number of different ways
    // If your running in a Node environment, you could use fs.readFile()
    // In the browser, you could make a fetch() call and use res.arrayBuffer()
    const pngImageBytes = png;

    // url: replace with full pdf URL for final version. This is only the 2nd page..
    const url =
      "https://link.storjshare.io/s/jxzmsxrmyg7i5mpemm5by6lfxrla/demo-bucket/Buterin_ProofOfStake_screen.pdf?download=1";
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Create a new PDFDocument
    //const pdfDoc = await PDFDocument.create();

    // Embed the JPG image bytes and PNG image bytes
    const pngImage = await pdfDoc.embedPng(pngImageBytes);

    // Get the width/height of the PNG image scaled down to 50% of its original size
    const pngDims = pngImage.scale(0.5);

    // Add a blank page to the document
    const page = pdfDoc.getPage(3);

    // Draw the PNG image near the lower right corner of the JPG image
    page.drawImage(pngImage, {
      x: page.getWidth() / 2 - pngDims.width / 2,
      y: page.getHeight() / 2 - pngDims.height / 2,
      width: pngDims.width,
      height: pngDims.height,
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    var blob = new Blob([pdfBytes], { type: "application/pdf" });
    var link = window.URL.createObjectURL(blob);

    setuLink(link);
    /* window.open(link);
    console.log(pdfBytes); */
  }

  useEffect(async () => {
    if (address) {
      let balance = await readContracts.ProofOfStake_Pages.balanceOf(address);
      console.log(balance);
      if (balance > 0) {
        setHodler(true);
        let tokenByIndex = await readContracts.ProofOfStake_Pages.tokenOfOwnerByIndex(address, 0);
        let id = ethers.BigNumber.from(tokenByIndex._hex).toNumber();
        let tokenURI = await readContracts.ProofOfStake_Pages.tokenURI(id);
        console.log(tokenURI);

        let cleaned = tokenURI.replace("data:application/json;base64,", "");

        let decoded = atob(cleaned);
        let json = JSON.parse(decoded);
        console.log(json.image);

        let b64png = await base64SvgToBase64Png(json.image, 762.233, 1016.63);

        insertPage(b64png);
      }
    }
  }, [readContracts]);

  return (
    <>
      {hodler == true && ulink ? (
        <a href={ulink}>
          <button
            className="w-1/2 mb-4 py-2 mx-2 px-2 sm:py-4 text-xs sm:text-xl bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
            type="btn btn-primary"
          >
            View Copy
          </button>
        </a>
      ) : (
        <Spin className="w-1/5 mb-2 sm:mb-1 py-2 mx-2 px-2" />
      )}
    </>
  );
}
