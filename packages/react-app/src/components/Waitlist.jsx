import { Select, Spin, Space, Table, Input, List } from "antd";
import React, { useState, useEffect } from "react";
import { Address, BottomLinks } from "../components";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, get, child } from "firebase/database";

export default function Waitlist({ yourLocalBalance, mainnetProvider, price, address, firebaseConfig, events }) {
  // Get a list of tokens from a tokenlist -> see tokenlists.org!

  const [ready2, setReady2] = useState(false);
  const [list, setList] = useState();

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

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
              if (!dbList.includes(eventList[x])) {
                // do nothing
              } else {
                // push to to-do

                let toPush = JSON.parse(JSON.stringify(objectList[x]));
                console.log("to push", toPush);
                toPush.address = objectList[x].args[0];
                toSign.push(toPush);
                setList(toSign);

                console.log("list", toSign);
                setReady2(true);
              }
            }
          });
        }
      }
    });
  }, [events]);

  const [value2, setValue2] = useState("");

  const [dataSource2, setDataSource2] = useState(toSign);

  const FilterByNameInput2 = (
    <Input
      placeholder="Search by Address (Case Sensitive)"
      value={value2}
      onChange={e => {
        const currValue = e.target.value;
        setValue2(currValue);
        const filteredData = toSign.filter(entry => entry.address.includes(currValue));
        setDataSource2(filteredData);
      }}
    />
  );

  const columns2 = [
    {
      title: FilterByNameInput2,
      dataIndex: "address",
      render: record => (record != undefined ? <Address value={record} ensProvider={mainnetProvider} /> : <Spin />),
      key: "1",
    },
  ];

  return (
    <div>
      <h3 className="text-xl">🚧 Waitlist is being upgraded. Made a pledge? We will be signing soon! 🚧</h3>
    </div>
  );
}
