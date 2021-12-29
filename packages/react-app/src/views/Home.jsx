import { React, useState, useEffect } from "react";
import { useContractReader, usePoller } from "eth-hooks";
import { Spin, Menu, Button, Dropdown, Space, message } from "antd";
import { DownOutlined, UserOutlined, BarsOutlined } from "@ant-design/icons";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { ethers, utils } from "ethers";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 */
function Home({ yourLocalBalance, writeContracts, readContracts, tx, localProvider }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract

  const [image, setImage] = useState();
  const [chunk, setChunk] = useState([1]);

  const purpose = useContractReader(readContracts, "CryptoChunks", "tokenURI", [chunk]);

  const events = useEventListener(readContracts, "CryptoChunks", "Transfer", localProvider, 13864307);

  async function handleButtonClick(e) {
    message.info("Confirm Tx to Mint 1");
    try {
      const mint1Tx = await tx(
        writeContracts.CryptoChunks.mintItem(utils.parseEther("1"), {
          value: utils.parseEther("0.02"),
        }),
      );
      await mint1Tx.wait();
    } catch (e) {
      console.log("Error:", e);
    }
  }

  async function handleMenuClick(e) {
    if (e.key == 1) {
      message.info("Confirm Tx to Mint 3");
      try {
        const mint3Tx = await tx(
          writeContracts.CryptoChunks.mintItem(utils.parseEther("3"), {
            value: utils.parseEther("0.05"),
          }),
        );
        await mint3Tx.wait();
      } catch (e) {
        console.log("Error:", e);
      }
    }
    if (e.key == 2) {
      message.info("Confirm Tx to Mint 5");
      try {
        const mint5Tx = await tx(
          writeContracts.CryptoChunks.mintItem(utils.parseEther("5"), {
            value: utils.parseEther("0.07"),
          }),
        );
        await mint5Tx.wait();
      } catch (e) {
        console.log("Error:", e);
      }
    }
    if (e.key == 3) {
      message.info("Confirm Tx to Mint 10");
      try {
        const mint10Tx = await tx(
          writeContracts.CryptoChunks.mintItem(utils.parseEther("10"), {
            value: utils.parseEther("0.10"),
          }),
        );
        await mint10Tx.wait();
      } catch (e) {
        console.log("Error:", e);
      }
    }
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Mint 3 for Ξ.05</Menu.Item>
      <Menu.Item key="2">Mint 5 for Ξ.07</Menu.Item>
      <Menu.Item key="3">Mint 10 for Ξ.1</Menu.Item>
    </Menu>
  );

  useEffect(() => {
    if (purpose) {
      const json = atob(purpose.substring(29));
      const result = JSON.parse(json);
      setImage(result.image);
    }
  }, [purpose]);

  /* async function getTransfers() {
    setChunk(events[events.length - 1].args.tokenId);
    console.log(chunk);
    //gg
  } */

  usePoller(async () => {
    if (events && events.length !== 0) {
      setChunk(events[events.length - 1].args.tokenId);
      const json = atob(purpose.substring(29));
      const result = JSON.parse(json);
      setImage(result.image);
      //console.log(events);
    }
  }, 1500);

  return (
    <div style={{ width: "auto", margin: "auto", paddingTop: 20, minHeight: 800 }}>
      <h1>CryptoChunks: Phunks On-Chained</h1>
      <h3>Latest Chunk: Chunk #{events == undefined ? null : chunk.toString()}</h3>

      {events == undefined ? (
        <Spin style={{ margion: "auto" }} />
      ) : (
        <div style={{ width: "auto", margin: "auto", paddingBottom: 15, paddingTop: 10 }}>
          <img src={image} height={300} />
        </div>
      )}
      <Space align="center" />
      <Dropdown.Button onClick={handleButtonClick} overlay={menu} icon={<BarsOutlined />}>
        Mint 1
      </Dropdown.Button>
    </div>
  );
}

export default Home;
