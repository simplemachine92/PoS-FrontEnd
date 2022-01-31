import { utils } from "ethers";
import { Select, Spin, List } from "antd";
import React, { useState, useEffect } from "react";
import { Address, AddressInput } from "../components";
import { useTokenList } from "eth-hooks/dapps/dex";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, get, child } from "firebase/database";
import { Link } from "react-router-dom";

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
        width: 600,
        margin: "20px auto",
        padding: 20,
        paddingBottom: 50,
      }}
    >
      {ready ? (
        <div style={{ marginTop: 30 }}>
          <List
            bordered
            dataSource={sData}
            renderItem={item => (
              <List.Item key={item.recipient}>
                <div
                  style={{
                    width: "110%",
                    position: "relative",
                    display: "flex",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Address
                    value={item.recipient}
                    ensProvider={mainnetProvider}
                    fontSize={18}
                    style={{ display: "flex", flex: 1, alignItems: "center" }}
                  />
                  <Link
                    to={`/view?typedData=${
                      item.typedData + "&addresses=" + item.sender + "&signatures=" + item.signature
                    }`}
                  >
                    View Signature
                  </Link>
                </div>
              </List.Item>
            )}
          />
        </div>
      ) : (
        <div style={{ marginTop: 30 }}>
          <Spin />
        </div>
      )}
    </div>
  );
}
