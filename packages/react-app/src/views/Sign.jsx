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
  Table,
} from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { Share } from "react-twitter-widgets";
import { AddressInput, Address, Footer, Quotes, SignOptions, Address2 } from "../components";
import { useLocalStorage } from "../hooks";
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
  tx,
  writeContracts,
}) {
  const [list, setList] = useState();
  const [ready, setReady] = useState(false);
  const [value2, setValue2] = useState("");

  const [dataSource2, setDataSource2] = useState(events);

  const FilterByNameInput2 = (
    <input
      placeholder="Search"
      type="table"
      className="w-full bg-green-400 sm:text-xl"
      value={value2}
      onChange={e => {
        const currValue = e.target.value;
        setValue2(currValue);
        const filteredData = events.filter(entry => entry.args[0].includes(currValue));
        setDataSource2(filteredData);

        // Check if an input ENS resolves
        if (e.target.value.startsWith("0")) {
        } else {
          mainnetProvider.resolveName(e.target.value).then(function (address2) {
            if (address2 == null) {
              setDataSource2(events);
            } else {
              const filteredData2 = events.filter(entry => entry.args[0].includes(address2));
              setDataSource2(filteredData2);
            }
          });
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
        return (
          <div className="text-2xs sm:text-sm md:text-base lg:text-lg mx-auto text-black">
            {ethers.utils.formatEther(ethers.BigNumber.from(value[1])).substring(0, 6)}
          </div>
        );
      },
      sorter: (a, b) => a.args[1] - b.args[1],
      sortDirections: ["ascend", "descend"],
    },
  ];

  // prettier-ignore
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
  const [globalText, setGlobalText] = useLocalStorage("globalText", "Global Message Here");
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
  };

  const onFinishFailed = errorInfo => {};

  const dbList = [];

  const objectList = [];

  const eventList = [];

  const toSign = [];

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
        sender: `${address}`,
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
          const message = sig.val().message;
          dbList.push(message.recipient);
        });

        if (dbList.length) {
          events.forEach(pledge => {
            eventList.push(pledge.args.pledgee);

            objectList.push(pledge);

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
  }, [events, address]);

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
      } catch (e) {}
      setTypedDataChecks(_checks);
    }
  }, [typedData]);

  const signMessage = async () => {
    try {
      setSigning(true);

      const injectedSigner = action === "sign" && injectedProvider.getSigner();

      let _signature;
      if (type === "typedData") {
        const _typedData = { ...updateValues() };
        if (!_typedData.domain && action !== "verify") _typedData.domain = {};
        if (!_typedData.domain.chainId && action !== "verify") _typedData.domain.chainId = chainId;

        if (action === "sign")
          _signature = await injectedSigner._signTypedData(_typedData.domain, _typedData.types, _typedData.message);

        /* if (ethers.utils.verifyMessage(_signature) != ) {} */

        const _compressedData = await codec.compress(_typedData);

        /* const ourSigner = ethers.utils.verifyMessage(_signature); */

        const db = database;
        set(ref(db, `PoS/` + _typedData.message.recipient), {
          signature: _signature,
          message: _typedData.message,
          typedData: _compressedData,
        });

        searchParams.set("typedData", _compressedData);
      } else if (type === "message") {
        // const _messageToSign = ethers.utils.isBytesLike(_message) ? ethers.utils.arrayify(_message) : _message;
        const _message = getMessage();

        if (action === "sign") _signature = await injectedProvider.send("personal_sign", [_message, address]);
        // _signature = await injectedSigner.signMessage(_messageToSign);

        searchParams.set("message", _message);
      }

      if (action === "sign")
        if (action === "sign") {
          searchParams.set("signatures", _signature);
          searchParams.set("addresses", address);
        } else if (action === "verify") {
          searchParams.set("signatures", manualSignature);
          searchParams.set("addresses", manualAddress);
        }

      window.location.reload(false);
      // history.push(`/view?${searchParams.toString()}`);

      setSigning(false);
    } catch (e) {
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
  const Expander = props => <span>Test expander</span>;

  const [select, setSelect] = useState({
    selectedRowKeys: [],
    loading: false,
  });

  const { selectedRowKeys, loading } = select;

  const rowSelection = {
    selectedRowKeys,
    onChange: selectedRowKeys => {
      setSelect({
        ...select,
        selectedRowKeys,
      });

      const filtered = Object.keys(events)
        .filter(key => selectedRowKeys.includes(key))
        .reduce((obj, key) => {
          obj = events[key];
          return obj;
        }, {});

      setList([filtered]);
    },
    type: "radio",
  };

  useEffect(async () => {
    Object.keys(events).forEach(key => {
      events[key].key = key;
    });
    setDataSource2(events);
    setReady(true);
  }, [list]);

  return (
    <div>
      {userReady ? (
        <>
          <div className="flex flex-wrap w-full mx-auto content-center rounded overflow-hidden shadow-2xl">
            <div className="flex flex-wrap w-1/2 mx-auto content-center rounded overflow-hidden shadow-2xl">
              {type === "message" && (
                <input
                  class="text-center mt-4 text-md md:text-lg"
                  value={messageText}
                  onChange={e => {
                    setMessageText(e.target.value);
                  }}
                />
              )}
              <h5 className="content-center w-full mt-3 mb-2 sm:mb-3 md:mb-4 font-bold text-sm sm:text-base">
                Set a Global Message
              </h5>

              {/* <div className="w-1/2">
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
                      <Address2
                        value={item.args[0]}
                        ensProvider={mainnetProvider}
                        fontSize={32}
                        style={{ display: "flex", flex: 1, alignItems: "center" }}
                      />
                    </List.Item>
                  )}
                />
              </div> */}

              <>
                {/* <h1 className="text-xs w-full sm:text-sm md:text-base lg:text-lg mt-2">Message:</h1> */}

                <textarea
                  className="text-2xs sm:text-xs md:text-base w-full mx-auto sm:mx-3 md:mx-4 lg:mx-6"
                  maxLength={60}
                  autoSize={{ minRows: 1 }}
                  value={globalText}
                  onChange={e => {
                    setGlobalText(e.target.value);
                  }}
                />
              </>

              <Collapse ghost />
              {address ? (
                <button
                  type="btn btn-primary"
                  className="w-1/2 mx-auto sm:w-1/2 mb-2 mt-2 sm:mt-4 md:mt-6 lg:mt-10 mx-auto sm:py-2 sm:px-2 text-xs md:text-lg sm:mt-5 lg:mt-8 bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                  onClick={async () => {
                    try {
                      const result = tx(
                        writeContracts && writeContracts.ProofOfStake_Pages.setMessage(globalText),
                        async update => {
                          if (update && (update.status === "confirmed" || update.status === 1)) {
                            console.log(
                              " ⛽️ " +
                                update.gasUsed +
                                "/" +
                                (update.gasLimit || update.gas) +
                                " @ " +
                                parseFloat(update.gasPrice) / 1000000000 +
                                " gwei",
                            );

                            // send notification of stream creation
                            notification.success({
                              message: "Donation Successful",
                              description: `Donation from ${address} successful`,
                              placement: "topRight",
                            });
                          }
                        },
                      );
                    } catch (err) {
                      notification.error({
                        message: "Donation Not Processed",
                        description: err,
                        placement: "topRight",
                      });
                    }
                  }}
                >
                  Send
                </button>
              ) : (
                <button
                  type="btn btn-primary"
                  className="w-1/3 sm:w-1/2 mb-2 mt-2 sm:mt-4 md:mt-6 lg:mt-10 mx-auto sm:py-2 sm:px-2 text-xs md:text-lg sm:mt-5 lg:mt-8 bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                  onClick={loadWeb3Modal}
                >
                  Connect
                </button>
              )}
              {/*  <Col span={12}>
               <Tweets
                address={address}
                mainnetProvider={mainnetProvider}
                firebaseConfig={firebaseConfig}
                events={events}
              />
            </Col> */}
            </div>
            <div className="flex flex-wrap w-1/2 mx-auto content-center rounded overflow-hidden shadow-2xl">
              {type === "message" && (
                <input
                  class="text-center mt-2 text-md md:text-lg"
                  value={messageText}
                  onChange={e => {
                    setMessageText(e.target.value);
                  }}
                />
              )}
              <h5 className="w-full mt-3 mb-2 sm:mb-3 md:mb-4 font-bold text-2xs sm:text-base md:text-lg">
                Sign directly to user:
                <br />
                (Select from list below)
              </h5>
              <div className="w-full">
                <List
                  dataSource={list}
                  split={false}
                  pagination={{
                    defaultPageSize: "1",
                    total: "1",
                    hideOnSinglePage: true,
                  }}
                  renderItem={item => (
                    <List.Item key={item}>
                      <div className="w-full">
                        <Address value={item.args[0]} ensProvider={mainnetProvider} />
                      </div>
                    </List.Item>
                  )}
                />
              </div>
              {type === "typedData" && (
                <>
                  {/* <h1 className="w-full text-xs sm:text-sm md:text-base lg:text-lg mt-2">Message:</h1> */}
                  <textarea
                    className="text-2xs sm:text-xs md:text-base w-full mx-auto sm:mx-3 md:mx-4 lg:mx-6"
                    maxLength={60}
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
                  {!invalidJson && !typedDataChecks.hash && <Alert message="Invalid EIP-712 input data" type="error" />}
                </>
              )}
              <Collapse ghost />

              <button
                type="btn btn-primary"
                className="w-1/2 mx-auto sm:w-1/2 mb-2 mt-2 sm:mt-4 md:mt-6 lg:mt-10 mx-auto sm:py-2 sm:px-2 text-xs md:text-lg sm:mt-5 lg:mt-8 bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                onClick={action !== "sign" ? signMessage : injectedProvider ? signMessage : loadWeb3Modal}
                disabled={
                  (type === "typedData" && (!typedDataChecks.hash || invalidJson)) ||
                  address != process.env.REACT_APP_SIGNER
                }
                loading={signing}
                style={{ marginTop: 10 }}
              >
                {action !== "sign" ? action : injectedProvider ? action : "Connect"}
              </button>
              {signing && (
                <button
                  className="w-1/3 mt-4 px-2 py-1 sm:py-4 text-2xs sm:text-xl bg-gradient-to-r from-yellow-300 to-yellow-pos hover:from-yellow-pos hover:to-yellow-poslight text-gray-900 font-bold rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                  size="large"
                  onClick={() => {
                    setSigning(false);
                  }}
                  style={{ marginTop: 10 }}
                >
                  Cancel
                </button>
              )}

              {/*  <Col span={12}>
               <Tweets
                address={address}
                mainnetProvider={mainnetProvider}
                firebaseConfig={firebaseConfig}
                events={events}
              />
            </Col> */}
            </div>
          </div>
          <div className="">
            {ready ? (
              <div className="mx-auto mr-1 ml-1 px-5">
                {/* <h5 className="font-bold text-sm sm:text-base md:text-lg lg:text-4xl">Select a User</h5> */}
                <br />
                <Table
                  pagination={{ pageSize: 5 }}
                  columns={columns2}
                  dataSource={dataSource2}
                  rowSelection={rowSelection}
                />
                <Footer />
              </div>
            ) : (
              <div>
                <Spin className="mt-5" />
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{ margintop: 50, padding: 12 }}>
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
