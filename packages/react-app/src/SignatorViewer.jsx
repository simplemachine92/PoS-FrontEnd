import { CheckCircleTwoTone, CloseCircleTwoTone, QrcodeOutlined, InfoOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Input,
  List,
  Modal,
  notification,
  Typography,
  Popover,
  Space,
  Switch,
  Tooltip,
  Row,
  Collapse,
  Col,
  Spin,
  Image,
} from "antd";
import { ethers } from "ethers";
import QR from "qrcode.react";
import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, get, child } from "firebase/database";
import styled from "styled-components";
import { PDFDocument } from "pdf-lib";
import { useHistory, useLocation } from "react-router-dom";
import { create, urlSource } from "ipfs-http-client";
import { Address } from "./components";

const codec = require("json-url")("lzw");

const { Text } = Typography;
/*
    Welcome to the Signator Viewer!
*/

const auth =
  "Basic " + Buffer.from("24yc2yN47pWEYp2zgXxC60wNzO2" + ":" + "112e132550e4bbf77c70ebd817eb3c10").toString("base64");

const ipfs = create({
  host: "https://ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const checkEip1271 = async (provider, address, message, signature) => {
  try {
    const eip1271Spec = {
      magicValue: "0x1626ba7e",
      abi: [
        {
          constant: true,
          inputs: [
            {
              name: "_hash",
              type: "bytes32",
            },
            {
              name: "_sig",
              type: "bytes",
            },
          ],
          name: "isValidSignature",
          outputs: [
            {
              name: "magicValue",
              type: "bytes4",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
      ],
    };

    const _addressCode = provider.getCode(address);
    if (_addressCode === "0x") {
      return "MISMATCH";
    }
    const contract = new ethers.Contract(address, eip1271Spec.abi, provider);
    const returnValue = await contract.isValidSignature(message, signature);
    return returnValue === eip1271Spec.magicValue ? "MATCH" : "MISMATCH";
  } catch (e) {
    console.log(e);
    return "MISMATCH";
  }
};

function SignatorViewer({
  injectedProvider,
  mainnetProvider,
  address,
  loadWeb3Modal,
  chainList,
  writeContracts,
  tx,
  firebaseConfig,
}) {
  function useSearchParams() {
    const _params = new URLSearchParams(useLocation().search);
    return _params;
  }

  const location = useLocation();
  const searchParams = useSearchParams();
  const history = useHistory();

  const [message] = useState(searchParams.get("message"));
  const [compressedTypedData] = useState(searchParams.get("typedData"));
  const [loading, setLoading] = useState({
    loading: false,
    buttonText: "View Book",
    isDisabled: false,
  });
  const [sData, setData] = useState();
  const [pblob, setBlob] = useState();
  const [sigLink, setLink] = useState();
  const [dataImage, setImage] = useState();
  const [typedData, setTypedData] = useState();
  const [signatures, setSignatures] = useState(
    searchParams.get("signatures") ? searchParams.get("signatures").split(",") : [],
  );
  const [addresses, setAddresses] = useState(
    searchParams.get("addresses") ? searchParams.get("addresses").split(",") : [],
  );
  const [addressChecks, setAddressChecks] = useState([]);

  const [signing, setSigning] = useState(false);

  const [showAll, setShowAll] = useState(false);

  let messageToCheck;

  const app = initializeApp(firebaseConfig);

  if (message) {
    messageToCheck = ethers.utils.isBytesLike(message) ? ethers.utils.arrayify(message) : message;
  }

  if (!message && !compressedTypedData) {
    console.log(searchParams.get("message"), searchParams.get("typedData"));
    history.push(`/`);
  }

  const getBook = async () => {
    console.log(sData);
    setLoading({
      loading: true,
      buttonText: "Loading ( Large File )",
      isDisabled: false,
    });
    let b64png = await base64SvgToBase64Png(sData.imageData, 762.233, 1016.63);

    //let svgBlob = new Blob([svgBoiler], { type: "image/svg+xml" });

    let fetched = await insertPage(b64png);

    console.log("fetched", fetched);
    window.open(fetched);
    setLoading({
      loading: false,
      buttonText: "View Book",
      isDisabled: false,
    });
  };

  const openInNewTab = url => {
    const newWindow = window.open(url);
    if (newWindow) newWindow.opener = null;
  };

  const onClickUrl = url => {
    return () => openInNewTab(url);
  };

  const clickUpload = async () => {
    console.log("file data", sData);
    //upload here

    let ipfile = {
      // The contents of the file (see below for definition)
      content: pblob,
    };

    //const url = "https://ipfs.infura.io";
    //const ipfs = create({ url });

    const file = await ipfs.add(ipfile);
    console.log("file", file);
  };

  const onClickBook = async url => {
    return () => openInNewTab(url);
  };

  async function insertPage(png) {
    // These should be Uint8Arrays or ArrayBuffers
    // This data can be obtained in a number of different ways
    // If your running in a Node environment, you could use fs.readFile()
    // In the browser, you could make a fetch() call and use res.arrayBuffer()
    const pngImageBytes = png;

    // url: replace with full pdf URL for final version. This is only the 2nd page..
    const url = process.env.REACT_APP_GREEN_PILL;
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Create a new PDFDocument
    //const pdfDoc = await PDFDocument.create();

    // Embed the JPG image bytes and PNG image bytes
    const pngImage = await pdfDoc.embedPng(pngImageBytes);

    // Get the width/height of the JPG image scaled down to 25% of its original size

    // Get the width/height of the PNG image scaled down to 50% of its original size
    const pngDims = pngImage.scale(0.5);

    // Add a blank page to the document
    const page = pdfDoc.getPage(1);

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
    setBlob(blob);
    var link = URL.createObjectURL(blob);

    return link;
  }

  /**
   * converts a base64 encoded data url SVG image to a PNG image
   * @param originalBase64 data url of svg image
   * @param width target width in pixel of PNG image
   * @return {Promise<String>} resolves to png data url of the image
   */
  async function base64SvgToBase64Png(originalBase64, width, height) {
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

  let myData = [];

  useEffect(async () => {
    const dbRef = ref(getDatabase(app));
    const typedData2 = await codec.decompress(compressedTypedData);
    console.log("ftype", typedData2.domain.verifyingContract);
    get(child(dbRef, `PoS/`))
      .then(snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(sig => {
            let message = sig.val().message;
            console.log("message", message);

            let sigMsg = message.msg;
            let sigRecipient = message.recipient;
            let sigSigner = message.sender;
            let pledgeValue = message.pledge;
            let sigTime = message.timestamp;
            message.signature = sig.val().signature;
            message.typedData = sig.val().typedData;

            let svgBoiler = `<svg xmlns="http://www.w3.org/2000/svg" width="606.2" height="819.4" viewBox="0 0 606.2 819.4"><defs><style>.a{fill:#fff;}.b{fill:none;stroke:#d9c8db;stroke-miterlimit:10;stroke-width:2px;}.c,.d,.e,.f,.g,.h,.i,.j,.k,.l,.m,.n,.o{isolation:isolate;}.c,.d,.e,.f,.g,.i,.j,.k{font-size:55px;}.c,.e{fill:#e96b5d;}.c,.d,.e,.f,.g,.k{font-family:LustDisplay-Didone, Lust Didone;}.d,.f{fill:#9b4a8d;}.e{letter-spacing:0.02em;}.f{letter-spacing:0.02em;}.g{fill:#9b4a8c;}.h{font-size:45px;fill:#0cb6ea;font-family:Lust-Italic, Lust;font-style:italic;}.i,.k{fill:#50ae58;}.i,.j{font-family:Lust-Regular, Lust;letter-spacing:0.05em;}.j{fill:#ef8916;}.l,.m{font-size:29.99px;}.l,.n{font-family:Arial-BoldMT, Arial;font-weight:700;}.m,.o{font-family:ArialMT, Arial; margin-left: auto; margin-right: auto; width: 40%;}.n{font-size:20px;}.o{font-size:18px;}</style></defs><rect class="a" width="606.2" height="819.4"/><text class="n"><tspan class="n" text-anchor="middle" x="50%" y="42%">${sigRecipient}</tspan></text><text transform="translate(75 352.85)" font-size="18" font-family="ArialMT, Arial"><tspan text-anchor="middle" x="37.5%" y="200">${sigTime}</tspan><tspan text-anchor="middle" x="37.5%" y="260">${pledgeValue}</tspan><tspan text-anchor="middle" x="37.5%" y="320">${typedData2.domain.verifyingContract}</tspan><tspan text-anchor="middle" x="37.5%" y="120">"${sigMsg}"</tspan><tspan text-anchor="middle" x="37.5%" y="220">signature timestamp</tspan><tspan text-anchor="middle" x="37.5%" y="340">contract</tspan><tspan text-anchor="middle" x="37.5%" y="280">value</tspan><tspan text-anchor="middle" x="37.5%" y="140">message</tspan></text><rect class="b" x="21.9" y="169.5" width="562.4" height="562.4"/><g style="isolation:isolate"><path d="M46.66,98.93v-.28h4.89V60.71H46.66v-.28H65.91c12,0,18.42,3.19,18.42,11.17,0,9.4-11.77,11.27-19.85,11.27h-1.6V98.65h5.83v.28ZM62.88,82.6h1.6c5.83,0,7.75-3.47,7.75-11s-1.92-10.89-7.75-10.89h-1.6Z" style="fill:#e96b5d"/></g><g style="isolation:isolate"><path d="M135,91.84c0,5.16-2.26,7.53-9.21,7.53-6.74,0-9.43-2.28-11.55-8.63C113,87,112.44,79.52,107.52,79.52h-1.6V98.65h5.28v.28H89.7v-.28h4.89V60.71H89.7v-.28H109c5.66,0,18.47.22,18.47,9.46,0,7.54-10.77,9.27-17.32,9.54v.09c10.75,0,13.94,3.52,16.58,9.15,3.33,7.12,4.13,8.17,5.53,8.17,2.2,0,2.47-3.35,2.47-5Zm-29-12.6h1.6c5.44,0,7.81-2.86,7.81-9.35,0-5.11-1.82-9.18-7.79-9.18h-1.62Z" style="fill:#9b4a8d"/></g><g style="isolation:isolate"><path d="M178.65,79.68c0,12.54-8.85,19.69-19.71,19.69s-19.72-7.15-19.72-19.69S148.07,60,158.94,60,178.65,67.14,178.65,79.68Zm-11.8,0c0-8.41-.52-19.41-7.91-19.41S151,71.27,151,79.68s.52,19.41,7.92,19.41S166.85,88.1,166.85,79.68Z" style="fill:#e96b5d"/></g><g style="isolation:isolate"><path d="M226.68,79.68c0,12.54-8.9,19.69-19.83,19.69S187,92.22,187,79.68,195.92,60,206.85,60,226.68,67.14,226.68,79.68Zm-11.87,0c0-8.41-.52-19.41-8-19.41s-8,11-8,19.41.52,19.41,8,19.41S214.81,88.1,214.81,79.68Z" style="fill:#9b4a8d"/></g><g style="isolation:isolate"><path d="M236.69,98.93v-.28h4.89V60.71h-4.89v-.28h33.93L272,73.69h-.27l-.11-1c-.8-7.56-6.82-12-14.3-12h-4.4V79.13h.61c6.18,0,10.2-2.58,10.5-7.72l.05-1h.28l-.93,17.77h-.28l.05-1c.28-5.12-3.49-7.81-9.67-7.81h-.61V98.65h5.83v.28Z" style="fill:#9b4a8c"/></g><g style="isolation:isolate"><path d="M307.71,87.38c0,7.47-6.75,14.17-14.76,14.17-6.43,0-10.89-4.27-10.89-10.21,0-7.7,6.62-14.18,14.72-14.18C303.26,77.16,307.71,81.44,307.71,87.38Zm-8.23-4.64c0-2.65-.5-5.22-2.75-5.22-5,0-6.43,13.86-6.43,18.54,0,2.66.49,5.13,2.7,5.13C298,101.19,299.48,88.05,299.48,82.74Z" style="fill:#0cb6ea"/></g><g style="isolation:isolate"><path d="M300.13,105.46a4.61,4.61,0,0,1,4.68-4.77,3.93,3.93,0,0,1,4.09,4.18,3.26,3.26,0,0,0-2.7,3.29c0,1.08.45,1.93,1.71,1.93,2.12,0,4-2.34,4-5.76,0-2.07-.67-4.32-4-5.49l3.37-22H307.6l0-.36h3.65c.31-6.7,2.52-11.88,9.18-11.88,4.5,0,6.57,2.48,6.57,5.27a4.75,4.75,0,0,1-4.82,5c-2.2,0-4-1.44-4-4.27a3.09,3.09,0,0,0,2.88-3.2c0-1.35-.58-2.29-2.07-2.29-5.31,0-6.84,11.38,1.44,11.38h3.2l0,.36h-4.27L316,98.75c-.86,5.4-3.47,12-9.77,12C302.29,110.72,300.13,108.2,300.13,105.46Z" style="fill:#0cb6ea"/></g><g style="isolation:isolate"><path d="M345.85,98.1l-4.07,1.16-.88-16h.44c.88,6.44,4.45,15.62,14.35,15.62,5,0,9-1.76,9-5.83,0-9.24-24-8.41-24-21.72C340.68,64,347.77,60,356.57,60a39.37,39.37,0,0,1,8.75,1.26l4.18-1.16.71,13.53h-.44c-.88-6.21-4.34-13.19-13.2-13.19-4.4,0-7.42,2.08-7.42,5.66,0,8.41,24,7.09,24,20.79,0,7.75-8.13,12.48-17.43,12.48A41.65,41.65,0,0,1,345.85,98.1Z" style="fill:#50ae58"/><path d="M384.62,98.93v-.44c5.72,0,6.27-3,6.27-9.46V60.88c-8.91,0-12.87,5.33-13.8,13.63h-.44l1.48-14.07H415l1.48,14.07H416c-.93-8.3-4.89-13.63-13.8-13.63V89c0,6.44.55,9.46,6.27,9.46v.44Z" style="fill:#50ae58"/></g><g style="isolation:isolate"><path d="M455.54,88.43c3.46,7.2,5.11,10.06,9.07,10.06v.44H442.18v-.44c5.22,0,4.18-4.18,1.48-9.95l-1.39-3H429.18c-4,8.38-2.59,12.92,3.43,12.92v.44H417.1v-.44c4,0,7.42-4.67,11.71-13.36l12.71-25.79ZM429.45,85H442l-6.11-13.08Z" style="fill:#ef8916"/><path d="M504.71,87.66c4.29,9.51,5.5,10.39,8.14,10.11v.45a36.94,36.94,0,0,1-8.75,1.26c-6.76,0-9.4-2.58-11.43-8.74-1.76-5.34-3.25-11.44-6.77-11.44a4.07,4.07,0,0,0-1.81.46V89c0,6.44.49,9.46,4.56,9.46v.44H467.26v-.44c5.5,0,5.5-3,5.5-9.46V70.33c0-6.65,0-9.46-5.5-9.46v-.43h21.39v.43c-4.07,0-4.56,3-4.56,9.46V79.1l7-7.67c2.36-2.53,5.39-6.16,5.39-8.41,0-1.49-1-2.15-3.63-2.15v-.43h16.66v.43c-7,0-14.68,7.32-18,10.95l-6.48,7a18,18,0,0,1,8.24-2c5.56,0,8.19,3.3,11.44,10.84Z" style="fill:#ef8916"/></g><g style="isolation:isolate"><path d="M552.2,73.69h-.28l-.11-1c-.8-7.56-6.82-12-14.3-12H532V79.13h.61c6.18,0,10.2-2.58,10.5-7.72l.06-1h.27l-.93,17.77h-.28l.06-1c.27-5.12-3.5-7.81-9.68-7.81H532V92c0,5.33.61,6.7,4.4,6.7,9.87,0,16-6.15,17.35-15l.2-1.24h.27l-2.64,16.5h-35.8v-.28h4.89V60.71h-4.89v-.27h35Z" style="fill:#50ae58"/></g><text class="l" transform="translate(235.15 265)">vitalik.eth</text> <text class="m" transform="translate(263.48 295)">signer</text> <text class="m" transform="translate(245.64 373)">recipient</text><path class="a" d="M305.5,811.7H275.7V740.8h52.4v70.9H305.7a19.66,19.66,0,0,1,1.6-4c-1,.8-2.1.6-3.2.6a1.62,1.62,0,0,1-1.4-1.6c-.1-1.2.3-1.9,1.1-2.2h2.6V806h-1.9a.55.55,0,0,0-.5.3c-.1.3.2.3.5.4a2.31,2.31,0,0,0,2.2-.7,3.92,3.92,0,0,1,1-.8c1-.5,1-1.5,1.3-2.4h-6.2v-3.2h1.5v1.6h2.2v-1.5h1.4v1.5c1.3.2,1.3.2,1.7-1,0-.1.1-.3.1-.4.2-.7.5-1.5.8-2.3l-7.7.9v-1.6l6.5-.7-6.5-.6V794h.4l7.9.9c.1,0,.4,0,.4-.1.3-.7.5-1.4.8-2.2H303v-3.2h1.4v1.7h2.2v-1.5H308v1.5h3.1v-1.6h1.4v2.6h.1l9.6-27.4-9.7-3.1c0,.5-.4.5-.7.5-1,0-2,.1-3.1.1-.4,0-.7.1-.6.6h4.3v1.6h-8.2a.76.76,0,0,0-.5.2c-.3.7-.5,1.4-.8,2.1a2.1,2.1,0,0,1,1.4-.7h6.8a1.5,1.5,0,0,1,1.4,1,4.3,4.3,0,0,1,0,1.6,1.36,1.36,0,0,1-1.5,1.2h-6.8a1.51,1.51,0,0,1-1.5-1.2,5.28,5.28,0,0,1-.1-1.3l-14,38.2.6.2,12,4.4ZM280.1,759h43.5V744.8H280.1Zm27.6,9.2h3.2c.1,0,.3-.2.4-.3-.1-.1-.3-.2-.4-.3h-6.5a.22.22,0,0,0-.2.2.37.37,0,0,0,.1.3.75.75,0,0,0,.5.1Zm1.7-7.8-4-1.2-.4,1.3c.9,0,1.9-.2,2.4,1,.4-1.1,1.2-.9,2-1.1Zm-5.1,2.3h2.5c0-.4-.1-.6-.5-.6h-1.4c-.5,0-.7.1-.6.6Z"/> <path d="M305.5,811.7l-4.2-1.6-12-4.3-.6-.2,14-38.2a6.15,6.15,0,0,0,.1,1.3,1.42,1.42,0,0,0,1.5,1.2h6.8a1.42,1.42,0,0,0,1.5-1.2,4.3,4.3,0,0,0,0-1.6,1.5,1.5,0,0,0-1.4-1h-6.8a2.1,2.1,0,0,0-1.4.7,18,18,0,0,1,.8-2.1.76.76,0,0,1,.5-.2h8.2v-1.7h-4.3c0-.5.2-.6.6-.6,1,0,2,0,3.1-.1.3,0,.7,0,.7-.5l9.7,3.1c-3.2,9.2-6.4,18.3-9.6,27.4h-.1v-2.7h-1.4V791h-3.1v-1.6h-1.5V791h-2.2v-1.7H303v3.2h9.5c-.3.8-.5,1.5-.8,2.2,0,.1-.3.1-.4.1l-7.9-.9H303v1.6l6.5.6-6.5.7v1.6l7.7-.9c-.3.8-.5,1.6-.8,2.3,0,.1-.1.3-.1.4-.4,1.2-.4,1.2-1.7,1v-1.5h-1.4v1.6h-2.3v-1.6h-1.5v3.2h6.2c-.4.9-.4,1.9-1.3,2.4a3.92,3.92,0,0,0-1,.8,2.58,2.58,0,0,1-2.2.7c-.2,0-.5,0-.5-.4a.55.55,0,0,1,.5-.3h2v-1.5H304c-.8.2-1.2,1-1.1,2.1a1.53,1.53,0,0,0,1.3,1.6c1.1.1,2.3.3,3.2-.6a19.66,19.66,0,0,0-1.6,4Zm3.9-27.3-6.2.9a.76.76,0,0,0-.4.2v2.1h9.5v-1.3h-7c.4-.1.9-.1,1.3-.2,1.8-.2,3.6-.5,5.4-.7q.15,0,.3-.3v-2h-9.6v1.3Zm-3-8.9H304a1.19,1.19,0,0,0-1.2,1,4.84,4.84,0,0,0,0,1.7,1.16,1.16,0,0,0,1.1,1,4.14,4.14,0,0,0,3.7-.9c.2-.2.4-.3.6-.5a2.86,2.86,0,0,1,2.3-.8c.3,0,.7-.2.7.3s-.5.3-.7.3h-1.9v1.6a22.55,22.55,0,0,0,2.6,0,1.49,1.49,0,0,0,1.3-1.4,1.9,1.9,0,0,0-.9-2.2,1.27,1.27,0,0,0-.6-.1,4.44,4.44,0,0,0-4,1.2c-.1.1-.2.2-.3.2a2.6,2.6,0,0,1-2.4.7.85.85,0,0,1-.5-.3c-.1-.3.2-.3.5-.3h1.9Zm-3.4-4.7v4h1.4v-1.2h8.1V772h-8.1v-1.2Z"/> <path d="M280.1,759V744.8h43.5V759Zm26.4-11v-1.6h-2.1a1.45,1.45,0,0,0-1.5,1.4c-.2,1.2.2,2.2,1,2.3a4.24,4.24,0,0,0,3.6-.6l1.4-1.1a3.1,3.1,0,0,1,2.3-.4c.2,0,.3.2.2.4a.22.22,0,0,1-.2.2h-2.3v1.5a24.32,24.32,0,0,0,2.7,0c.9-.1,1.2-.8,1.2-1.9s-.4-1.7-1.2-1.8h-.2a4.73,4.73,0,0,0-4.1,1.2c-.1.1-.3.2-.4.3a2.69,2.69,0,0,1-2.3.7c-.2,0-.5,0-.5-.3,0-.1.3-.3.5-.3Zm4.6,5.2H308v-1.6h-1.5v1.6h-2.1v-1.7H303v3.2h9.5v-3.3h-1.4Zm1.4,3.3H303V758h9.5Z"/> <path d="M307.7,768.2h-3.1a.9.9,0,0,1-.5-.1.37.37,0,0,1-.1-.3.22.22,0,0,1,.2-.2h6.6c.1.1.3.2.4.3-.1.1-.3.3-.4.3Z"/> <path d="M309.4,760.4c-.8.1-1.6,0-2,1-.5-1.2-1.5-.9-2.4-1l.4-1.3Z"/> <path d="M304.3,762.7c0-.5.1-.6.6-.6h1.4c.5,0,.6.2.5.6Z"/> <path class="a" d="M309.4,784.4h-6.5v-1.3h9.6v2q0,.15-.3.3c-1.8.2-3.6.5-5.4.7a5.85,5.85,0,0,0-1.3.2h7v1.3H303v-2.1c0-.1.2-.2.4-.2Z"/> <path class="a" d="M306.5,775.5v1.6h-1.9c-.2,0-.5,0-.5.3,0,.1.3.3.5.3a2.6,2.6,0,0,0,2.4-.7c.1-.1.2-.2.3-.2a4.19,4.19,0,0,1,4-1.2,1.42,1.42,0,0,1,.6.2,2,2,0,0,1,.9,2.2,1.49,1.49,0,0,1-1.3,1.4,22.53,22.53,0,0,1-2.6,0v-1.5h1.9c.3,0,.7.2.7-.3s-.4-.3-.7-.3a2.74,2.74,0,0,0-2.3.8c-.2.2-.4.3-.6.5a4.14,4.14,0,0,1-3.7.9,1.09,1.09,0,0,1-1.1-1,4.84,4.84,0,0,1,0-1.7,1.19,1.19,0,0,1,1.2-1A5.11,5.11,0,0,1,306.5,775.5Z"/> <path class="a" d="M303,770.8h1.4V772h8.1v1.6h-8.1v1.2H303Z"/> <path class="a" d="M306.5,748h-1.9a.55.55,0,0,0-.5.3c-.1.3.2.3.5.3a2.49,2.49,0,0,0,2.3-.7c.1-.1.3-.2.4-.3a4.45,4.45,0,0,1,4.1-1.2h.2a1.61,1.61,0,0,1,1.2,1.8c0,1-.4,1.8-1.2,1.9a24.3,24.3,0,0,1-2.7,0v-1.5h2.3c.2,0,.3-.2.2-.4a.22.22,0,0,0-.2-.2,3.1,3.1,0,0,0-2.3.4l-1.4,1.1c-1.1,1-2.4.8-3.6.6-.8-.1-1.2-1.1-1-2.3a1.45,1.45,0,0,1,1.5-1.4h2.1Z"/>
            <path class="a" d="M311.1,753.2v-1.7h1.4v3.3H303v-3.2h1.4v1.7h2.2v-1.6H308v1.6Z"/> <path class="a" d="M312.5,756.5V758H303v-1.5Z"/></svg>`;

            var encodedData = btoa(svgBoiler);

            var dataURI = "data:image/svg+xml;base64," + encodedData;

            message.imageData = dataURI;

            console.log(dataURI);
            myData.push(message);
            console.log(myData);
          });

          const decompressTypedData = async () => {
            if (compressedTypedData) {
              const _typedData = await codec.decompress(compressedTypedData);
              console.log("typed", _typedData);
              console.log("sig", signatures[0]);
              let newData = _typedData;
              setTypedData(_typedData);
              myData.forEach(async data => {
                console.log("my typed", newData);
                console.log("my data", data);

                //for (let x = 0; x < myData.length; x++)
                if (data.recipient == newData.message.recipient) {
                  //`url("data:image/svg+xml,${svgString}")`;
                  setImage(data.imageData);
                  setData(data);
                }
              });
            }
          };

          decompressTypedData();
        } else {
          console.log("No data available");
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, [compressedTypedData]);

  /*  useEffect(() => {
    decompressTypedData();
  }, [compressedTypedData]); */

  useEffect(() => {
    const _signatures = searchParams.get("signatures") ? searchParams.get("signatures").split(",") : [];
    const _addresses = searchParams.get("addresses") ? searchParams.get("addresses").split(",") : [];

    setSignatures(_signatures);
    setAddresses(_addresses);
  }, [location]);

  useEffect(() => {
    const checkAddresses = async () => {
      const _addressChecks = await signatures.map((sig, i) => {
        if (i + 1 > addresses.length) {
          return "INVALID";
        }
        if (!ethers.utils.isAddress(addresses[i])) {
          return "INVALID";
        }
        try {
          let _signingAddress;

          if (message) _signingAddress = ethers.utils.verifyMessage(messageToCheck, sig);
          if (typedData)
            _signingAddress = ethers.utils.verifyTypedData(typedData.domain, typedData.types, typedData.message, sig);

          if (_signingAddress === addresses[i]) {
            return "MATCH";
          }

          try {
            let _message;
            if (message)
              _message = ethers.utils.arrayify(
                ethers.utils.hashMessage(ethers.utils.isBytesLike(message) ? ethers.utils.arrayify(message) : message),
              );
            if (typedData)
              _message = ethers.utils._TypedDataEncoder.hash(typedData.domain, typedData.types, typedData.message);

            const _eip1271Check = checkEip1271(mainnetProvider, addresses[i], _message, sig);
            return _eip1271Check;
          } catch (e) {
            console.log(e);
            return "MISMATCH";
          }
        } catch (e) {
          console.log(`signature ${sig} failed: ${e}`);
          return "INVALID";
        }
      });

      return Promise.all(_addressChecks);
    };

    if ((message || typedData) && signatures) {
      checkAddresses().then(data => {
        setAddressChecks(data);
      });
    }
  }, [signatures, message, typedData, addresses]);

  const signMessage = async () => {
    try {
      setSigning(true);
      console.log(`Signing: ${message}`);
      const injectedSigner = injectedProvider.getSigner();

      // const _messageToSign = ethers.utils.isBytesLike(message) ? ethers.utils.arrayify(message) : message;
      let _signature;

      if (typedData) {
        _signature = await injectedSigner._signTypedData(typedData.domain, typedData.types, typedData.message);
      } else if (message) {
        _signature = await injectedProvider.send("personal_sign", [message, address]);
        /*
        if (injectedProvider.provider.wc) {
          _signature = await injectedProvider.send("personal_sign", [_messageToSign, address]);
        } else {
          _signature = await injectedSigner.signMessage(_messageToSign);
        }
        */
      }
      console.log(`Success! ${_signature}`);

      const _signatures = [...signatures];
      _signatures.indexOf(_signature) === -1
        ? _signatures.push(_signature)
        : console.log("This signature already exists");
      setSignatures(_signatures);
      const _addresses = [...addresses];
      _addresses.indexOf(address) === -1 ? _addresses.push(address) : console.log("This address already signed");
      setAddresses(_addresses);

      searchParams.set("signatures", _signatures.join());
      searchParams.set("addresses", _addresses.join());

      history.push(`${location.pathname}?${searchParams.toString()}`);
      setSigning(false);
    } catch (e) {
      console.log(e);
      setSigning(false);

      if (e.message.indexOf("Provided chainId") !== -1) {
        notification.open({
          message: "Incorrect network selected in Metamask",
          description: `${
            typedData &&
            typedData.domain &&
            typedData.domain.chainId &&
            chainList &&
            chainList.length > 0 &&
            `Select ${chainList.find(element => element.chainId === typedData.domain.chainId).name}`
          }. Error: ${e.message}`,
        });
      }
    }
  };

  const [qrModalVisible, setQrModalVisible] = useState(false);

  const showModal = () => {
    setQrModalVisible(true);
  };

  const closeModal = () => {
    setQrModalVisible(false);
  };

  //prettier-ignore
  return (
    <>
      <div className="bg-headerBackground bg-cover bg-center bg-no-repeat">
        
        
          {/* signed by
          <List
            locale={{ emptyText: "No signatures" }}
            dataSource={signatures}
            renderItem={(item, index) => {
              let _indicator;
              if (addressChecks[index] === "MATCH") {
                _indicator = <CheckCircleTwoTone style={{ fontSize: 18, marginLeft: 5 }} twoToneColor="#52c41a" />;
              } else if (addressChecks[index] === "MISMATCH") {
                _indicator = <CloseCircleTwoTone style={{ fontSize: 18 }} twoToneColor="#ff4d4f" />;
              } else {
                _indicator = <Alert message="Invalid" type="error" />;
              }

              return (
                <List.Item className="h3" key={item} style={{}}>
                  <div>
                    {addresses[index] && ethers.utils.isAddress(addresses[index]) && (
                      <Address address={addresses[index]} ensProvider={mainnetProvider} fontSize={24} />
                    )}

                    <Tooltip title={addressChecks[index]}>
                      {_indicator}
                    </Tooltip>
                  </div>
                </List.Item>
              );
            }}
          /> */}
        
        <br />
        {dataImage != undefined ? (
          <div class="flex items-center justify-center">
            <img className="px-2 py-2 mb-10 ml-4 w-2/3 sm:w-1/2 lg:w-5/12 xl:w-3/12 md:py-2 md:px-2 bg-gradient-to-r from-blue-100 to-yellow-pos hover:from-blue-100 hover:to-yellow-poslight rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out" src={dataImage} />
            

            
            {/* Enable when book releases and we have full pdf */}
            {/* <Button style={{ padding: "4px 15px" }} type="primary" onClick={getBook} loading={loading.loading}>
              {loading.buttonText}
            </Button> */}
          </div>
        ) : (
          <div>
            <Spin />
          </div>
        )}
        <Space direction="vertical" style={{ width: "auto" }}></Space>
        <Collapse ghost></Collapse>
      </div>
      <Modal title="Scan Signatorio" visible={qrModalVisible} onOk={closeModal} onCancel={closeModal}>
        <QR
          value={window.location.href}
          size="400"
          level="H"
          includeMargin
          renderAs="svg"
          imageSettings={{ excavate: false }}
        />
      </Modal>
      <div>
        <Card className="" style={{ paddingTop: 10, background: "#2bcfd9" }}>
        {address ? (
              <button
              className="w-1/4 ml-8 mr-4 mb-4 py-2 px-2 sm:py-4 text-sm sm:text-xl bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
              type="btn btn-primary"
              onClick={async () => {
                try {
                  console.log("pledge", typedData);
                  console.log("link", sigLink);
                  /* const result = tx(
                    writeContracts &&
                    writeContracts.ProofOfStake_Pages.pledge({ value: utils.parseEther(uValue) }),
                    async (update) => { */
                  const txCur = tx(
                    writeContracts &&
                    writeContracts.ProofOfStake_Pages.updateIfSigned(
                      signatures[0],
                      typedData.message.pledge,
                      typedData.message.timestamp,
                      typedData.message.msg,
                    ),
                  );
                  await txCur.wait();
                } catch (e) {
                  console.log("mint failed", e);
                }
              }}
            >
              Update Token
            </button>
              
            ) : (
              <Button type="primary" style={{ marginBottom: 20, padding: "4px 15px" }} onClick={loadWeb3Modal}>
                Connect to Mint
              </Button>
            )}
          {message ? (
            <Text style={{ fontSize: 18, marginBottom: "0px" }}>{`${message}`}</Text>
          ) : (
            <div style={{ textAlign: "left" }}>
              Signed Message Details
              <Input.TextArea
                size="large"
                autoSize={{ minRows: 2 }}
                value={typedData && JSON.stringify(showAll === true ? typedData : typedData.message, null, "\t")}
                style={{ marginBottom: 10, background: "#96f9ff" }}
              />
              <Space>
                
                <Switch
                  checkedChildren="all"
                  unCheckedChildren="msg"
                  onChange={checked => {
                    setShowAll(checked);
                  }}
                />
              </Space>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

export default SignatorViewer;
