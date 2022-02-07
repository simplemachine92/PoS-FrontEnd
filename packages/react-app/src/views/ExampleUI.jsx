import { SyncOutlined } from "@ant-design/icons";
import { utils, ethers } from "ethers";
import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
import React, { useState, useEffect } from "react";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { Address, Balance, Events } from "../components";
import { PDFDocument, degrees } from "pdf-lib";

export default function ExampleUI({
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
        ctx.drawImage(img, -20, 0, canvas.width, canvas.height);
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
    const url = "https://ipfs.io/ipfs/QmYPtjsQ5nAUFbdNeqZUsmmHLCPtdjbX7NMLjjvJFcitJk";
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Create a new PDFDocument
    //const pdfDoc = await PDFDocument.create();

    // Embed the JPG image bytes and PNG image bytes
    const pngImage = await pdfDoc.embedPng(pngImageBytes);

    // Get the width/height of the JPG image scaled down to 25% of its original size

    // Get the width/height of the PNG image scaled down to 50% of its original size
    const pngDims = pngImage.scale(0.4);

    // Add a blank page to the document
    const page = pdfDoc.getPage(0);

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
      let balance = await readContracts.GreenPill_Pages.balanceOf(address);
      console.log(balance);
      if (balance > 0) {
        setHodler(true);
        let tokenByIndex = await readContracts.GreenPill_Pages.tokenOfOwnerByIndex(address, 0);
        let id = ethers.BigNumber.from(tokenByIndex._hex).toNumber();
        let tokenURI = await readContracts.GreenPill_Pages.tokenURI(id);
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
    <div
      style={{
        width: 600,
        margin: "20px auto",
        padding: 20,
        paddingBottom: 50,
      }}
    >
      {hodler == true ? (
        <div style={{ marginTop: 30 }}>
          <h2>(This is a token gate)</h2>
          <h1>Thanks for hodling a greenPill</h1>
          <a href={ulink}>View Your Copy</a>
        </div>
      ) : (
        <div style={{ marginTop: 30 }}>
          <h2>(This is a token gate)</h2>
          <h1>If this persists, you aren't hodling.</h1>
          <br />
          <h3>If you have been signed to, navigate to /signatures, click view signature</h3>
          <h3>Then navigate to /debug, and enter your signature attributes into "Mintifsignedto"</h3>
        </div>
      )}
    </div>
  );
}
