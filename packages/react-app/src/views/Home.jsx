import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useContractReader } from "eth-hooks";
import { Spin, Menu, Button, Dropdown, Space, message } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { ethers, utils } from "ethers";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 */
function Home({ yourLocalBalance, writeContracts, readContracts, purpose, tx }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const [image, setImage] = useState();

  function handleButtonClick(e) {
    message.info("Confirm Tx to Mint 1");
    console.log("click left button", e);
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

  /* if (_numToMint == 1) {
    return 0.02 ether;
} else if (_numToMint == 3) {
    return 0.05 ether;
} else if (_numToMint == 5) {
    return 0.07 ether;
} else if (_numToMint == 10) {
    return 0.10 ether; */

  useEffect(() => {
    if (purpose) {
      const json = atob(purpose.substring(29));
      const result = JSON.parse(json);
      setImage(result.image);
    }
  }, [purpose]);

  return (
    <div style={{ width: "auto", margin: "auto", paddingTop: 60, minHeight: 800 }}>
      <h3>CryptoChunks: Phunks On-Chained</h3>
      {image == undefined ? (
        <Spin style={{ margion: "auto" }} />
      ) : (
        <div style={{ width: "auto", margin: "auto", paddingBottom: 10, paddingTop: 10 }}>
          <img src={image} height={300} />
        </div>
      )}
      <Space align="center" />
      <Dropdown.Button onClick={handleButtonClick} overlay={menu}>
        Mint
      </Dropdown.Button>
    </div>
  );
}

export default Home;
