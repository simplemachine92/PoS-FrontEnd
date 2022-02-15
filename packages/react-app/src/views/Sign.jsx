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
  Row,
  Col,
  Spin,
  Form,
  List,
  Pagination,
} from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useLocalStorage } from "../hooks";
import { AddressInput, Address } from "../components";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { Share } from "react-twitter-widgets";
import Tweets from "./Tweets";

const { Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;
const codec = require("json-url")("lzw");

export default function Signator({
  injectedProvider,
  address,
  loadWeb3Modal,
  chainList,
  mainnetProvider,
  contracts,
  localProvider,
  firebaseConfig,
  events,
}) {
  const [list, setList] = useState();
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
    name: "ProofOfStake_Pages",
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

  const [messageText, setMessageText] = useLocalStorage("messageText", "Type Your Message Here");
  const [hashMessage, setHashMessage] = useState(false);
  const [signing, setSigning] = useState(false);
  const [typedData, setTypedData] = useLocalStorage("typedData", eip712Example);
  const [invalidJson, setInvalidJson] = useState(false);
  const [type, setType] = useLocalStorage("signingType", "typedData");
  const [typedDataChecks, setTypedDataChecks] = useState({});
  const [chainId, setChainId] = useState(
    typedData && typedData.domain && typedData.domain.chainId ? parseInt(typedData.domain.chainId, 10) : 1,
  );
  const [action, setAction] = useState("sign");
  const [manualSignature, setManualSignature] = useState();
  const [manualAddress, setManualAddress] = useState();
  const [userReady, setUser] = useState();

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Get a reference to the database service
  const database = getDatabase(app);

  const auth = getAuth();

  onAuthStateChanged(auth, user => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      setUser(uid);
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  const onFinish = values => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    console.log("Success:", values);
  };

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  let dbList = [];

  let objectList = [];

  let eventList = [];

  let toSign = [];

  function useSearchParams() {
    const _params = new URLSearchParams(useLocation().search);
    return _params;
  }

  function updateValues() {
    const pledgeValue = ethers.utils.formatEther(ethers.BigNumber.from(list[0].args.pledgeValue));

    const updatedData = {
      types: {
        signature: [
          { name: "sender", type: "address" },
          { name: "recipient", type: "address" },
          { name: "pledge", type: "string" },
          { name: "timestamp", type: "string" },
          { name: "msg", type: "string" },
        ],
      },
      primaryType: "signature",
      domain: {
        name: "ProofOfStake_Pages",
        version: "0",
        chainId: 4,
        verifyingContract: contracts.ProofOfStake_Pages.address,
      },
      message: {
        sender: "0xb010ca9Be09C382A9f31b79493bb232bCC319f01",
        recipient: `${list[0].args[0]}`,
        pledge: `${pledgeValue}`,
        timestamp: String(Date.now()),
        msg: messageText,
      },
    };
    return updatedData;
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
                toSign.push(objectList[x]);
                setList(toSign);
              }
            }
          });
        }
      }
    });
  }, [events]);

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
      console.log("signer", injectedProvider.getSigner);

      let _signature;
      if (type === "typedData") {
        const _typedData = { ...updateValues() };
        if (!_typedData.domain && action !== "verify") _typedData.domain = {};
        if (!_typedData.domain.chainId && action !== "verify") _typedData.domain.chainId = chainId;
        console.log(`${action}: ${_typedData}`);
        console.log(_typedData);

        if (action === "sign")
          _signature = await injectedSigner._signTypedData(_typedData.domain, _typedData.types, _typedData.message);
        const _compressedData = await codec.compress(_typedData);

        const db = database;
        set(ref(db, `PoS/` + _typedData.message.recipient), {
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

      window.location.reload(false);
      //history.push(`/view?${searchParams.toString()}`);

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
    <div
      style={{
        width: "10px auto",
        margin: "10px auto",
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
      }}
    >
      {userReady ? (
        <Row>
          <Col span={12}>
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
              <h1>Signing to:</h1>
              <Space direction="vertical" style={{ width: "auto" }}>
                <div
                  style={{
                    width: "10px auto",
                    margin: "10px auto",
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingBottom: 20,
                  }}
                >
                  <List
                    bordered
                    dataSource={list}
                    split={false}
                    pagination={{
                      defaultPageSize: "1",
                      total: "1",
                      hideOnSinglePage: true,
                    }}
                    renderItem={item => (
                      <List.Item key={item}>
                        <Address
                          value={item.args[0]}
                          ensProvider={mainnetProvider}
                          fontSize={32}
                          style={{ display: "flex", flex: 1, alignItems: "center" }}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </Space>
              {type === "typedData" && (
                <>
                  <h1>Message:</h1>
                  <Space direction="vertical" style={{ width: "50%" }}>
                    <Input.TextArea
                      style={{ fontSize: 18 }}
                      size="large"
                      autoSize={{ minRows: 1 }}
                      value={messageText}
                      onChange={e => {
                        setMessageText(e.target.value);
                      }}
                    />
                    {invalidJson && <Alert message="Invalid Json" type="error" />}
                    {/* typedDataChecks.domain===false&&<Alert message="No domain specified" type="info" /> */}
                    {typedDataChecks.types === false && <Alert message="Missing types" type="error" />}
                    {typedDataChecks.message === false && <Alert message="Missing message" type="error" />}
                    {!invalidJson && !typedDataChecks.hash && (
                      <Alert message="Invalid EIP-712 input data" type="error" />
                    )}
                  </Space>
                </>
              )}
              <Collapse ghost></Collapse>
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
          </Col>

          <Col span={12}>
            <Tweets
              address={address}
              mainnetProvider={mainnetProvider}
              firebaseConfig={firebaseConfig}
              events={events}
            />
          </Col>
        </Row>
      ) : (
        <div style={{ margintop: 50 }}>
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 8,
              margintop: 10,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{
                offset: 8,
                span: 8,
              }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 8,
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
}
