import styled from "styled-components";
import { Select, Spin, Space, Table, Input, List } from "antd";
import React, { useState, useEffect } from "react";
import { Address, BottomLinks, Address2 } from "../components";
import { ethers } from "ethers";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, get, child } from "firebase/database";
import { Footer, Quotes, AboutTheBook, GitcoinBar } from "../components";

import { Link } from "react-router-dom";

export default function Waitlist({ yourLocalBalance, mainnetProvider, price, address, firebaseConfig, events }) {
  // Get a list of tokens from a tokenlist -> see tokenlists.org!

  const [ready, setReady] = useState(false);
  const [list, setList] = useState();
  const [value2, setValue2] = useState("");

  const [dataSource2, setDataSource2] = useState(events);

  /* // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  let dbList = [];

  let objectList = [];

  let eventList = [];

  let toSign = []; */

  useEffect(async () => {
    setDataSource2(events);
    setReady(true);
  }, [events]);

  const FilterByNameInput2 = (
    <Input
      placeholder="Filter ENS or 0x.."
      value={value2}
      onChange={e => {
        console.log("curr", e.target.value);

        const currValue = e.target.value;
        setValue2(currValue);
        const filteredData = events.filter(entry => entry.args[0].includes(currValue));
        setDataSource2(filteredData);

        // Check if an input ENS resolves
        if (e.target.value.startsWith("0")) {
        } else {
          mainnetProvider.resolveName(e.target.value).then(function (address2) {
            console.log("Address: " + address2);
            if (address2 == null) {
              console.log("No record for this ENS");
              setDataSource2(events);
            } else {
              const filteredData2 = events.filter(entry => entry.args[0].includes(address2));
              setDataSource2(filteredData2);
            }
          });
          /* console.log("ensName", ensName) */
        }
      }}
    />
  );

  const columns2 = [
    {
      title: FilterByNameInput2,
      dataIndex: "args",
      render: record =>
        record != undefined ? <Address2 value={record[0]} fontSize={14} ensProvider={mainnetProvider} /> : <Spin />,
      key: "1",
    },

    {
      title: "Donation",
      dataIndex: "args",
      key: "donation",
      render: value => {
        return ethers.utils.formatEther(ethers.BigNumber.from(value[1]));
      },
      sorter: (a, b) => a.args[1] - b.args[1],
      sortDirections: ["ascend", "descend"],
      defaultSortOrder: "descend",

      /* render: record => (record != undefined ? ethers.utils.formatEther(ethers.BigNumber.from(record[1])) : <Spin />),
      key: "2", */
    },
  ];

  return (
    <div className="bg-headerBackground bg-contain bg-top-right bg-no-repeat">
      {ready ? (
        <div className="mx-auto mr-1 ml-1">
          {/* <h6 className="text-yellow-pos font-bold text-3xl mt-5">Top Donors</h6> */}
          <br />
          <Table pagination={{ pageSize: 10 }} columns={columns2} dataSource={dataSource2} />
          <Footer />
        </div>
      ) : (
        <div>
          <Spin className="mt-5" />
        </div>
      )}
    </div>
  );
}
