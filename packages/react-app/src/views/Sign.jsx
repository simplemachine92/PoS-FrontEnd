import {
  Alert,
  Button,
  Card,
  Checkbox,
  Input,
  notification,
  Radio,
  Space,
  Typography,
  Collapse,
  Select,
  Spin,
} from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { useLocalStorage } from "../hooks";
import { AddressInput } from "../components";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";

const { Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;
const codec = require("json-url")("lzw");

//prettier-ignore
const eip712Example = {
  types: {
    signature: [
      { name: "sender", type: "address" },
      { name: "recipient", type: "address" },
      { name: "sig_number", type: "string" },
      { name: "timestamp", type: "string" },
      { name: "msg", type: "string" }
    ],
  },
  primaryType: "signature",
  domain: {
    name: "GreenPill_Pages",
    version: "0",
    chainId: 4,
    verifyingContract: "0x0f40dee08808fbb178EE43824988148b33A0d7b8",
  },
  message: {
    sender: "0xb010ca9Be09C382A9f31b79493bb232bCC319f01",
    recipient: "0xb010ca9Be09C382A9f31b79493bb232bCC319f01",
    sig_number: "1",
    timestamp: `${Date.now()}`,
    msg: "message goes here"
  },
};

export default function Signator({
  injectedProvider,
  address,
  loadWeb3Modal,
  chainList,
  mainnetProvider,
  contracts,
  localProvider,
  firebaseConfig,
}) {
  const [messageText, setMessageText] = useLocalStorage("messageText", "hello ethereum");
  const [hashMessage, setHashMessage] = useState(false);
  const [signing, setSigning] = useState(false);
  const [typedData, setTypedData] = useLocalStorage("typedData", eip712Example);
  const [manualTypedData, setManualTypedData] = useLocalStorage(
    "manualTypedData",
    JSON.stringify(eip712Example, null, "\t"),
  );
  const [invalidJson, setInvalidJson] = useState(false);
  const [type, setType] = useLocalStorage("signingType", "message");
  const [typedDataChecks, setTypedDataChecks] = useState({});
  const [chainId, setChainId] = useState(
    typedData && typedData.domain && typedData.domain.chainId ? parseInt(typedData.domain.chainId, 10) : 1,
  );
  const [action, setAction] = useState("sign");
  const [manualSignature, setManualSignature] = useState();
  const [manualAddress, setManualAddress] = useState();
  const [ready, setReady] = useState();

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Get a reference to the database service
  const database = getDatabase(app);

  let dbList = [];

  let objectList = [];

  let eventList = [];

  let toSign = [];

  const events = useEventListener(contracts, "GreenPill_Pages", "Pledge", localProvider, "10100000");

  function useSearchParams() {
    const _params = new URLSearchParams(useLocation().search);
    return _params;
  }

  function compareLists() {
    for (let x = 0; x < eventList.length; x++) {
      if (dbList.includes(eventList[x])) {
        // do nothing
      } else if (eventList[x] != undefined) {
        // push to to-do
        toSign.push(objectList[x]);
      }
    }
    setReady(true);
    console.log("result", toSign);
  }

  const searchParams = useSearchParams();
  const history = useHistory();

  const getMessage = () => {
    const _message = messageText;

    /*
    if (metaData === "time") {
      _message = `${messageDate.toLocaleString()}: ${messageText}`;
    } else if (metaData == "block") {
      _message = `${latestBlock}: ${messageText}`;
    } else {
      _message = messageText;
    }
    */

    if (hashMessage) {
      return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(_message)); // _message//ethers.utils.hashMessage(_message)
    }
    return _message;
  };

  useEffect(async () => {
    const dbRef = ref(getDatabase(app));
    get(child(dbRef, `gp/`)).then(snapshot => {
      if (snapshot.exists()) {
        snapshot.forEach(sig => {
          let message = sig.val().message;
          dbList.push(message.recipient);
        });
        console.log("dblist", dbList);
        if (dbList.length > 0) {
          events.forEach(pledge => {
            eventList.push(pledge.args.pledgee);
            objectList.push(pledge);
            console.log("eDebug", eventList);
          });
        }
      }
      compareLists();
      console.log("result ready", ready);
    });
  }, [events.length]);

  useEffect(() => {
    if (typedData) {
      const _checks = {};
      _checks.domain = "domain" in typedData;
      _checks.types = "types" in typedData;
      _checks.message = "message" in typedData;
      let _hash;
      try {
        _hash = ethers.utils._TypedDataEncoder.hash(typedData.domain, typedData.types, typedData.message);
        _checks.hash = _hash;
      } catch (e) {
        console.log("failed to compute hash", e);
      }
      setTypedDataChecks(_checks);
    }
  }, [typedData]);

  const signMessage = async () => {
    try {
      setSigning(true);

      const injectedSigner = action === "sign" && injectedProvider.getSigner();

      let _signature;
      if (type === "typedData") {
        const _typedData = { ...typedData };
        if (!_typedData.domain && action !== "verify") _typedData.domain = {};
        if (!_typedData.domain.chainId && action !== "verify") _typedData.domain.chainId = chainId;
        console.log(`${action}: ${_typedData}`);

        if (action === "sign")
          _signature = await injectedSigner._signTypedData(_typedData.domain, _typedData.types, _typedData.message);
        const _compressedData = await codec.compress(_typedData);

        const db = database;
        set(ref(db, "gp/" + _typedData.message.recipient), {
          signature: _signature,
          message: _typedData.message,
          typedData: _compressedData,
        });

        console.log(_signature);
        console.log(_typedData);

        searchParams.set("typedData", _compressedData);
      } else if (type === "message") {
        // const _messageToSign = ethers.utils.isBytesLike(_message) ? ethers.utils.arrayify(_message) : _message;
        const _message = getMessage();
        console.log(`${action}: ${_message}`);
        if (action === "sign") _signature = await injectedProvider.send("personal_sign", [_message, address]);
        // _signature = await injectedSigner.signMessage(_messageToSign);

        searchParams.set("message", _message);
      }

      if (action === "sign") console.log(`Success! ${_signature},`);

      if (action === "sign") {
        searchParams.set("signatures", _signature);
        searchParams.set("addresses", address);
      } else if (action === "verify") {
        searchParams.set("signatures", manualSignature);
        searchParams.set("addresses", manualAddress);
      }

      history.push(`/view?${searchParams.toString()}`);

      setSigning(false);
    } catch (e) {
      console.log(e);
      setSigning(false);
      if (e.message.indexOf("Provided chainId") !== -1) {
        notification.open({
          message: "Incorrect network selected in Metamask",
          description: `${chainId && `Select ${chainList.find(element => element.chainId === chainId).name}`}. Error: ${
            e.message
          }`,
        });
      }
    }
  };

  return (
    <div className="container">
      {address == "0xb010ca9Be09C382A9f31b79493bb232bCC319f01" && ready == true ? (
        <Card>
          {type === "message" && (
            <Input.TextArea
              style={{ fontSize: 18 }}
              size="large"
              autoSize={{ minRows: 1 }}
              value={messageText}
              onChange={e => {
                setMessageText(e.target.value);
              }}
            />
          )}

          {type === "typedData" && (
            <>
              <Space direction="vertical" style={{ width: "50%" }}>
                <Input.TextArea
                  size="xsmall"
                  autoSize={{ minRows: 2 }}
                  value={manualTypedData}
                  onChange={e => {
                    try {
                      setManualTypedData(e.target.value);
                      const _newTypedData = JSON.parse(e.target.value);
                      setTypedData(_newTypedData);
                      setInvalidJson(false);
                      if (_newTypedData.domain && _newTypedData.domain.chainId) {
                        setChainId(parseInt(_newTypedData.domain.chainId, 10));
                      }
                    } catch (error) {
                      console.log(error);
                      setInvalidJson(true);
                      setTypedDataChecks({});
                    }
                  }}
                />
                {invalidJson && <Alert message="Invalid Json" type="error" />}
                {/* typedDataChecks.domain===false&&<Alert message="No domain specified" type="info" /> */}
                {typedDataChecks.types === false && <Alert message="Missing types" type="error" />}
                {typedDataChecks.message === false && <Alert message="Missing message" type="error" />}
                {!invalidJson && !typedDataChecks.hash && <Alert message="Invalid EIP-712 input data" type="error" />}
              </Space>
            </>
          )}

          <Collapse ghost>
            <Panel header="Advanced" key="1">
              <Space direction="vertical" style={{ width: "50%" }}>
                <Radio.Group
                  value={type}
                  buttonStyle="solid"
                  size="large"
                  onChange={e => {
                    setType(e.target.value);
                  }}
                >
                  <Radio.Button value="message">Message</Radio.Button>
                  <Radio.Button value="typedData">Typed Data</Radio.Button>
                </Radio.Group>

                {type === "message" && (
                  <>
                    <div>
                      <Space>
                        {/* <Radio.Group
                          value={metaData}
                          buttonStyle="solid"
                          size="large"
                          onChange={e => {
                            setMetaData(e.target.value);
                          }}
                        >
                          <Radio.Button value="time">Time</Radio.Button>
                          <Radio.Button value="block" disabled={!latestBlock}>Block</Radio.Button>
                          <Radio.Button value="none">None</Radio.Button>
                        </Radio.Group> */}

                        <Button
                          size="large"
                          onClick={() => {
                            const _date = new Date();
                            setMessageText(`${_date.toLocaleString()}: ${messageText}`);
                          }}
                        >
                          Add time
                        </Button>
                        <Checkbox
                          style={{ fontSize: 18 }}
                          checked={hashMessage}
                          onChange={e => {
                            setHashMessage(e.target.checked);
                          }}
                        >
                          Hash message
                        </Checkbox>
                      </Space>
                    </div>

                    {hashMessage && (
                      <Card className="card-border">
                        <div
                          style={{
                            fontSize: 14,
                            wordWrap: "break-word",
                            whiteSpace: "pre-line",
                          }}
                        >
                          <Text style={{ marginBottom: "0px" }}>{`${getMessage()}`}</Text>
                        </div>
                      </Card>
                    )}
                  </>
                )}

                {type === "typedData" && (
                  <>
                    <a href="https://eips.ethereum.org/EIPS/eip-712" target="_blank" rel="noopener noreferrer">
                      Learn more about signing typed data
                    </a>
                    <Space>
                      <Button
                        size="large"
                        onClick={() => {
                          setManualTypedData(JSON.stringify(typedData, null, "\t"));
                        }}
                        disabled={invalidJson}
                      >
                        {" "}
                        Prettify
                      </Button>
                      <Button
                        size="large"
                        onClick={() => {
                          setManualTypedData(JSON.stringify(eip712Example, null, "\t"));
                          setTypedData(eip712Example);
                          setInvalidJson(false);
                        }}
                      >
                        {" "}
                        Reset
                      </Button>
                    </Space>
                    <Select
                      showSearch
                      value={chainId}
                      size="large"
                      disabled={typedData && typedData.domain && typedData.domain.chainId}
                      onChange={value => {
                        console.log(`selected ${value}`);
                        setChainId(value);
                      }}
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      optionFilterProp="children"
                    >
                      {chainList.map(chain => (
                        <Option key={chain.chainId} value={chain.chainId}>{`${chain.name} (${chain.chainId})`}</Option>
                      ))}
                    </Select>
                  </>
                )}

                <Radio.Group
                  value={action}
                  onChange={e => {
                    setAction(e.target.value);
                  }}
                  style={{ marginTop: 10 }}
                >
                  <Radio value="sign">Sign</Radio>
                  <Radio value="create">Create</Radio>
                  <Radio value="verify">Verify</Radio>
                </Radio.Group>
                {action === "verify" && (
                  <>
                    <AddressInput
                      value={manualAddress}
                      onChange={v => setManualAddress(v)}
                      ensProvider={mainnetProvider}
                    />
                    <Input
                      placeholder="signature"
                      value={manualSignature}
                      onChange={e => setManualSignature(e.target.value)}
                    />
                  </>
                )}
              </Space>
            </Panel>
          </Collapse>

          <Space>
            <Button
              size="large"
              type="primary"
              onClick={action !== "sign" ? signMessage : injectedProvider ? signMessage : loadWeb3Modal}
              disabled={
                (type === "typedData" && (!typedDataChecks.hash || invalidJson)) ||
                (action === "verify" && (!ethers.utils.isAddress(manualAddress) || !manualSignature))
              }
              loading={signing}
              style={{ marginTop: 10 }}
            >
              {action !== "sign" ? action : injectedProvider ? action : "Connect account to sign"}
            </Button>

            {signing && (
              <Button
                size="large"
                onClick={() => {
                  setSigning(false);
                }}
                style={{ marginTop: 10 }}
              >
                Cancel
              </Button>
            )}
          </Space>
        </Card>
      ) : (
        <Spin />
      )}
    </div>
  );
}
