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
    get(child(dbRef, `PoS/`))
      .then(snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(sig => {
            let message = sig.val().message;
            console.log("message", message);

            let sigMsg = message.msg;
            let sigRecipient = message.recipient;
            let pledgeValue = message.pledge;
            let sigTime = message.timestamp;
            message.signature = sig.val().signature;
            message.typedData = sig.val().typedData;

            let svgBoiler = `<svg xmlns="http://www.w3.org/2000/svg" width="8.42in" height="11.38in" viewBox="0 0 606.27 819.53"><defs><style>.a{fill:none;stroke:#d9c8db;stroke-miterlimit:10;stroke-width:2px;}.b{font-size:60px;fill:#e96b5d;}.b,.q{font-family:BodoniSvtyTwoOSITCTT-Bold, "Bodoni 72 Oldstyle";font-weight:700;}.c,.e,.h,.j,.k,.s,.t{letter-spacing:0.02em;}.d,.l,.q{fill:#9b4a8d;}.d{letter-spacing:0.02em;}.e{fill:#9b4a8c;}.f,.g,.h,.o{fill:#0cb6ea;}.f,.g{font-size:55px;font-family:BodoniSvtyTwoOSITCTT-BookIt, "Bodoni 72 Oldstyle";font-weight:400;font-style:italic;}.f{letter-spacing:0.02em;}.i,.k{fill:#50ae58;}.i,.r,.u,.v{letter-spacing:0.02em;}.j,.m{fill:#f18a14;}.n,.r,.t{fill:#336d36;}.p{fill:#6d302c;}.q{font-size:30px;}.s,.u{fill:#000;}</style></defs><rect width="100%" height="100%" fill="white"/><rect class="a" x="21.87" y="169.54" width="562.52" height="562.52"/><text class="b" transform="translate(74.59 50.94)"><tspan class="c">P</tspan><tspan class="d" x="35.04" y="0">R</tspan><tspan class="c" x="74.46" y="0">O</tspan><tspan class="d" x="118.26" y="0">O</tspan><tspan class="e" x="162.06" y="0">F </tspan><tspan class="f" x="207.24" y="0">o</tspan><tspan class="g" x="233.75" y="0">f</tspan><tspan class="h" x="248.54" y="0" xml:space="preserve"></tspan><tspan class="i" x="269.06" y="0">ST</tspan><tspan class="j" x="336.38" y="0">AK</tspan><tspan class="k" x="420.86" y="0">E</tspan></text><polygon class="l" points="302.87 85.41 301.8 89.02 301.8 193.94 302.87 195 351.57 166.21 302.87 85.41"/><polygon class="m" points="302.87 85.41 254.17 166.21 302.87 195 302.87 144.08 302.87 85.41"/><polygon class="n" points="302.87 204.22 302.27 204.95 302.27 242.32 302.87 244.07 351.6 175.45 302.87 204.22"/><polygon class="o" points="302.87 244.07 302.87 204.22 254.17 175.45 302.87 244.07"/><polygon class="p" points="302.87 195 351.56 166.21 302.87 144.08 302.87 195"/><polygon class="l" points="254.17 166.21 302.87 195 302.87 144.08 254.17 166.21"/><text class="q" transform="translate(184.82 767.07)">S<tspan class="j" x="14.88" y="0">e</tspan><tspan class="c" x="28.68" y="0">v</tspan><tspan class="r" x="41.64" y="0">en</tspan><tspan class="s" x="72.33" y="0"> </tspan><tspan class="c" x="77.46" y="0">S</tspan><tspan class="h" x="92.94" y="0">to</tspan><tspan class="j" x="118.86" y="0">ri</tspan><tspan class="t" x="140.76" y="0">es</tspan><tspan class="u" x="165.78" y="0"> </tspan><tspan class="c" x="170.91" y="0">P</tspan><tspan class="t" x="188.43" y="0">re</tspan><tspan class="j" x="214.79" y="0">s</tspan><tspan class="v" x="226.01" y="0">s</tspan></text><text transform="translate(75 352.85)" font-size="16" font-family="ArialMT, Arial">{<tspan x="0" y="28.8">"signer": 0xDDF369C3bf18b1B12EA295d597B943b955eF4671,</tspan><tspan x="0" y="57.6">"timestamp": ${sigTime},</tspan><tspan x="0" y="86.4" xml:space="preserve">"recipient": ${sigRecipient},</tspan><tspan x="0" y="115.2">"pledge": ${pledgeValue} ETH,</tspan><tspan x="0" y="144">"version": 0,</tspan><tspan x="0" y="172.8">},</tspan><tspan x="0" y="230.4">"msg": ${sigMsg}</tspan></text></svg>`;

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
      <div className="background-greenpill" style={{ paddingTop: 20, background: "#2bcfd9" }}>
        
        <Space direction="horizontal" style={{ width: "auto" }}>
          signed by
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
          />
        </Space>
        <br />
        {dataImage != undefined ? (
          <div>
            <Image preview={false} width={200} src={dataImage} />
            <br />

            {address ? (
              <Button
                style={{ padding: "4px 15px", marginBottom: 20 }}
                type="primary"
                onClick={async () => {
                  try {
                    console.log("pledge", typedData);
                    console.log("link", sigLink);
                    const txCur = await tx(
                      writeContracts.ProofOfStake_Pages.mintIfSigned(
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
                Mint (If Owner)
              </Button>
            ) : (
              <Button type="primary" style={{ marginBottom: 20, marginRight: 20, padding: "4px 15px" }} onClick={loadWeb3Modal}>
                Connect to Mint (If Owner)
              </Button>
            )}
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
        <Card className="" style={{ paddingTop: 20, background: "#2bcfd9" }}>
          {message ? (
            <Text style={{ fontSize: 18, marginBottom: "0px" }}>{`${message}`}</Text>
          ) : (
            <div style={{ textAlign: "left" }}>
              Signed Message Details
              <Input.TextArea
                size="large"
                autoSize={{ minRows: 2 }}
                value={typedData && JSON.stringify(showAll === true ? typedData : typedData.message, null, "\t")}
                style={{ marginBottom: 10 }}
              />
              <Space>
                <Popover
                  style={{ paddingTop: 20, background: "#2bcfd9" }}
                  content={
                    <Space direction="vertical">
                      <Typography>Domain:</Typography>
                      <Input.TextArea
                        size="xsmall"
                        autoSize={{ minRows: 2 }}
                        value={typedData && JSON.stringify(typedData.domain, null, "\t")}
                      />
                      {typedData &&
                        typedData.domain &&
                        typedData.domain.chainId &&
                        chainList &&
                        chainList.length > 0 && (
                          <Text code>
                            {chainList.find(element => element.chainId === typedData.domain.chainId).name}
                          </Text>
                        )}
                    </Space>
                  }
                >
                  <Button size="small" shape="circle" icon={<InfoOutlined />} />
                </Popover>
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
