import { utils } from "ethers";
import { Select, Spin, List, Row, Col, Carousel, Card, Meta, Form, Input, Button } from "antd";
import React, { useState, useEffect } from "react";
import { Address, AddressInput } from "../components";
import { useTokenList } from "eth-hooks/dapps/dex";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, get, child } from "firebase/database";
import { Link } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const { Option } = Select;

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default function Hints({ yourLocalBalance, mainnetProvider, price, address }) {
  // Get a list of tokens from a tokenlist -> see tokenlists.org!
  const [ready, setReady] = useState(false);
  const [sData, setData] = useState();

  let myData = [];

  // Sample Data to test out the slider
  // const sampleData = [
  //   { recipient: "Recipient", typedData: "typedData", sender: "sender", signature: "signature" },
  //   { recipient: "Recipient1", typedData: "typedData1", sender: "sender1", signature: "signature1" },
  //   { recipient: "Recipient2", typedData: "typedData2", sender: "sender2", signature: "signature2" },
  //   { recipient: "Recipient2", typedData: "typedData2", sender: "sender2", signature: "signature2" },
  //   { recipient: "Recipient2", typedData: "typedData2", sender: "sender2", signature: "signature2" },
  //   { recipient: "Recipient2", typedData: "typedData2", sender: "sender2", signature: "signature2" },
  //   { recipient: "Recipient2", typedData: "typedData2", sender: "sender2", signature: "signature2" },
  //   { recipient: "Recipient2", typedData: "typedData2", sender: "sender2", signature: "signature2" },
  // ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(async () => {
    const dbRef = ref(getDatabase(app));
    get(child(dbRef, `gp/`))
      .then(snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(sig => {
            let message = sig.val().message;
            message.signature = sig.val().signature;
            message.typedData = sig.val().typedData;
            myData.push(message);
            console.log(myData);
          });
          setData(myData);
          setReady(true);
        } else {
          console.log("No data available");
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div
      style={{
        width: "90%",
        margin: "20px auto",
        padding: 20,
        paddingBottom: 50,
      }}
    >
      {ready ? (
        <div style={{ marginTop: 30 }}>
          <Slider {...sliderSettings}>
            {sData.map((item, index) => (
              <Card
                headStyle={{ backgroundColor: "#12032c" }}
                bodyStyle={{ backgroundColor: "#12032c" }}
                title={
                  <Address
                    value={item.recipient}
                    ensProvider={mainnetProvider}
                    fontSize={18}
                    style={{ display: "flex", flex: 1, alignItems: "center" }}
                  />
                }
              >
                <Link
                  to={`/view?typedData=${
                    item.typedData + "&addresses=" + item.sender + "&signatures=" + item.signature
                  }`}
                >
                  View Signature
                </Link>
              </Card>
            ))}
          </Slider>
          <Input.Group style={{ marginTop: 50 }} compact>
            <Button type="primary">Search</Button>
            <Input style={{ width: "calc(100% - 200px)" }} placeholder="Enter Address" />
          </Input.Group>
        </div>
      ) : (
        <div style={{ marginTop: 30 }}>
          <Spin />
        </div>
      )}
    </div>
  );
}
