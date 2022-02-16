import styled from "styled-components";
import { Select, Spin, Space, Table, Input, List } from "antd";
import React, { useState, useEffect } from "react";
import { Address, BottomLinks } from "../components";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, get, child } from "firebase/database";
import { Footer, Quotes, AboutTheBook, GitcoinBar } from "../components";

import { Link } from "react-router-dom";

const { Option } = Select;

export default function Hints({ yourLocalBalance, mainnetProvider, price, address, firebaseConfig, events }) {
  // Get a list of tokens from a tokenlist -> see tokenlists.org!
  const [ready, setReady] = useState(false);
  const [list, setList] = useState();
  const [sData, setData] = useState();

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  let myData = [];

  // We'll need a separate db for vitaliks signings - dont forget
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

            let svgBoiler = `<svg xmlns="http://www.w3.org/2000/svg" width="7.94in" height="10.59in" viewBox="-35 -25 571.46 762.2"><circle cx="255.76" cy="99.98" r="99.48" fill="#f6cf46" stroke="#000" stroke-miterlimit="10"/><g><path d="M233.66,179c.2,19.13,17.69,31.14,33.65,27.52,7.41-1.67,13-5.68,17.65-11.49,6.86-8.63,13.79-17.2,20.68-25.81Q317.33,154.6,329,140c4.8-6,7.36-12.8,6.57-20.46-1.26-12.29-7.75-20.74-19.65-24.61-11-3.59-22.5-.1-30.22,9.08-3.18,3.79-6.21,7.71-9.31,11.58-11.9,14.83-23.75,29.69-35.69,44.48C236.21,165.61,233.58,171.77,233.66,179Z" transform="translate(-30.92 -49.36)" fill="#fff"/><path d="M233.66,179c-.08-7.2,2.55-13.36,7-18.9,11.94-14.79,23.79-29.65,35.69-44.48,3.1-3.87,6.13-7.79,9.31-11.58,7.72-9.18,19.21-12.67,30.22-9.08,11.9,3.87,18.39,12.32,19.65,24.61.79,7.66-1.77,14.47-6.57,20.46q-11.7,14.58-23.35,29.19C298.75,177.8,291.82,186.37,285,195c-4.61,5.81-10.24,9.82-17.65,11.49C251.35,210.11,233.86,198.1,233.66,179Zm30.71-42.21c-8.09,10.36-16.3,20-23.43,30.3-5,7.2-4.35,15.43-.38,23.29a10.9,10.9,0,0,0,7.62,6c10.15,2.43,18.7-.28,25.35-8.29s13.22-16.43,19.81-24.67a25.9,25.9,0,0,0,1.41-2.28Zm33.46,20.84c7.89-10,15.69-19.11,22.6-28.86,5.31-7.48,5.08-15.89.93-24.11a10.42,10.42,0,0,0-7.17-5.82c-10.15-2.51-18.68.1-25.4,8.09-4.83,5.75-9.42,11.69-14.11,17.56-2.27,2.85-4.52,5.71-7.06,8.92Zm-37.9,44.66c8.86.25,15.8-3.18,21.19-10,6-7.65,12.13-15.22,18.19-22.84a23.88,23.88,0,0,0,1.44-2.23c-1.63-2.57-2.91-1.67-4.21-.05-5,6.22-10.15,12.31-14.93,18.69-5.59,7.46-11.94,13.71-21.39,15.88C260.13,201.69,260.08,201.93,259.93,202.26Zm69.75-86.92c0,8.65-3.87,15.58-9.24,22-5,6-9.83,12.17-14.71,18.29-1.17,1.47-2.25,3-3.25,4.37.78,1.86,1.74,2.43,3.09,1.29a17.65,17.65,0,0,0,2.25-2.47c5.41-6.71,10.83-13.42,16.18-20.18a42.38,42.38,0,0,0,4.07-5.9A21.3,21.3,0,0,0,329.68,115.34Z" transform="translate(-30.92 -49.36)"/><path d="M264.37,136.76l30.38,24.36a25.9,25.9,0,0,1-1.41,2.28c-6.59,8.24-13.08,16.56-19.81,24.67s-15.2,10.72-25.35,8.29a10.9,10.9,0,0,1-7.62-6c-4-7.86-4.6-16.09.38-23.29C248.07,156.72,256.28,147.12,264.37,136.76Z" transform="translate(-30.92 -49.36)" fill="#01e2ac"/><path d="M297.83,157.6l-30.21-24.22c2.54-3.21,4.79-6.07,7.06-8.92,4.69-5.87,9.28-11.81,14.11-17.56,6.72-8,15.25-10.6,25.4-8.09a10.42,10.42,0,0,1,7.17,5.82c4.15,8.22,4.38,16.63-.93,24.11C313.52,138.49,305.72,147.61,297.83,157.6Z" transform="translate(-30.92 -49.36)" fill="#5bf1cd"/><path d="M259.93,202.26c.15-.33.2-.57.29-.59,9.45-2.17,15.8-8.42,21.39-15.88,4.78-6.38,9.95-12.47,14.93-18.69,1.3-1.62,2.58-2.52,4.21.05a23.88,23.88,0,0,1-1.44,2.23c-6.06,7.62-12.17,15.19-18.19,22.84C275.73,199.08,268.79,202.51,259.93,202.26Z" transform="translate(-30.92 -49.36)" fill="#12c094"/><path d="M329.68,115.34a21.3,21.3,0,0,1-1.61,17.38,42.38,42.38,0,0,1-4.07,5.9c-5.35,6.76-10.77,13.47-16.18,20.18a17.65,17.65,0,0,1-2.25,2.47c-1.35,1.14-2.31.57-3.09-1.29,1-1.35,2.08-2.9,3.25-4.37,4.88-6.12,9.67-12.31,14.71-18.29C325.81,130.92,329.66,124,329.68,115.34Z" transform="translate(-30.92 -49.36)" fill="#12c094"/></g><text transform="translate(0 282.85)" font-size="18" font-family="ArialMT, Arial">{<tspan x="0" y="28.8">"signer": 0x00de4b13153673bcae2616b67bf822500d325fc3,</tspan><tspan x="0" y="57.6" xml:space="preserve">"timestamp": ${sigTime},</tspan><tspan x="0" y="86.4" xml:space="preserve">"recipient": ${sigRecipient},</tspan><tspan x="0" y="115.2">"pledge": ${pledgeValue} ETH,</tspan><tspan x="0" y="144">"version": 0,</tspan><tspan x="0" y="172.8">},</tspan><tspan x="0" y="230.4">"msg": ${sigMsg}</tspan></text></svg>`;

            var encodedData = btoa(svgBoiler);

            var dataURI = "data:image/svg+xml;base64," + encodedData;

            message.imageData = dataURI;

            console.log(dataURI);
            myData.push(message);
            console.log(myData);
          });
          /* myData.forEach(async data => {
            console.log("my data", myData);
            let b64png = await base64SvgToBase64Png(data.imageData, 762.233, 1016.63);

            data.link = await insertPage(b64png);
            console.log(data);
            setReady(true);
          }); */
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

  let dbList = [];

  let objectList = [];

  let eventList = [];

  let toSign = [];

  useEffect(async () => {
    const dbRef = ref(getDatabase(app));
    get(child(dbRef, `PoS/`)).then(snapshot => {
      if (snapshot.exists()) {
        snapshot.forEach(sig => {
          let message = sig.val().message;
          dbList.push(message.recipient);
        });
        console.log("dblist", dbList);
        if (dbList.length) {
          events.forEach(pledge => {
            eventList.push(pledge.args.pledgee);
            console.log("event list", eventList);
            objectList.push(pledge);
            console.log("object list", objectList);
            for (let x = 0; x < eventList.length; x++) {
              if (dbList.includes(eventList[x])) {
                // do nothing
              } else if (eventList[x] != undefined) {
                // push to to-do

                let toPush = JSON.parse(JSON.stringify(objectList[x]));
                console.log("to push", toPush);
                toPush.address = objectList[x].args[0];
                toSign.push(toPush);
                setList(toSign);
                console.log("list", toSign);
              }
            }
          });
        }
      }
    });
  }, [events]);

  const [value, setValue] = useState("");

  const [dataSource, setDataSource] = useState(myData);

  const FilterByNameInput = (
    <Input
      placeholder="Search by Address (Case Sensitive)"
      value={value}
      onChange={e => {
        const currValue = e.target.value;
        setValue(currValue);
        const filteredData = sData.filter(entry => entry.recipient.includes(currValue));
        setDataSource(filteredData);
      }}
    />
  );

  const columns = [
    {
      title: FilterByNameInput,
      dataIndex: "recipient",
      render: record => (record != undefined ? <Address value={record} ensProvider={mainnetProvider} /> : <Spin />),
      key: "1",
    },
    {
      title: "Pledge",
      dataIndex: "pledge",

      sorter: (a, b) => a.pledge - b.pledge,
      sortDirections: ["ascend"],
    },
    {
      title: "Signature",
      dataIndex: "",
      render: record =>
        record != undefined ? (
          <Link
            class="text-black mx-auto"
            to={`/view?typedData=${
              record.typedData + "&addresses=" + record.sender + "&signatures=" + record.signature
            }`}
          >
            View
          </Link>
        ) : (
          <Spin />
        ),
    },
  ];

  const columns2 = [
    {
      title: FilterByNameInput,
      dataIndex: "address",
      render: record => (record != undefined ? <Address value={record} ensProvider={mainnetProvider} /> : <Spin />),
      key: "1",
    },
    {
      title: "Pledge",
      dataIndex: "pledge",

      sorter: (a, b) => a.pledge - b.pledge,
      sortDirections: ["ascend"],
    },
  ];

  return (
    <div className="" style={{ height: "auto", width: "auto", marginTop: 20 }}>
      <div className="">
        {ready ? (
          <div className="container mx-auto">
            <h6 className="text-yellow-pos font-bold text-3xl">Signed Pledges</h6>
            <br />

            <Table columns={columns} dataSource={dataSource} />

            <h6 className="text-yellow-pos font-bold text-3xl">Awaiting Signature</h6>
            <br />
            <Table columns={columns2} dataSource={list} />
          </div>
        ) : (
          <div>
            <Spin />
          </div>
        )}
      </div>
      <br />
      <Quotes />
      <Footer />
    </div>
  );
}
