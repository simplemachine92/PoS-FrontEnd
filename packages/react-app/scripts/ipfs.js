const ipfsAPI = require("ipfs-http-client");
const chalk = require("chalk");
const { clearLine } = require("readline");

const { globSource } = ipfsAPI;

const infura = { host: "ipfs.infura.io", port: "5001", protocol: "https" };
// run your own ipfs daemon: https://docs.ipfs.io/how-to/command-line-quick-start/#install-ipfs
// const localhost = { host: "localhost", port: "5001", protocol: "http" };

const ipfs = ipfsAPI(infura);

const ipfsGateway = "https://ipfs.io/ipfs/";
const ipnsGateway = "https://ipfs.io/ipns/";

const addOptions = {
  pin: true,
};

const pushDirectoryToIPFS = async path => {
  try {
    const response = await ipfs.add(globSource(path, { recursive: true }), addOptions);
    return response;
  } catch (e) {
    return {};
  }
};

const publishHashToIPNS = async ipfsHash => {
  try {
    const response = await ipfs.name.publish(`/ipfs/${ipfsHash}`);
    return response;
  } catch (e) {
    return {};
  }
};

const nodeMayAllowPublish = ipfsClient => {
  // You must have your own IPFS node in order to publish an IPNS name
  // This contains a blacklist of known nodes which do not allow users to publish IPNS names.
  const nonPublishingNodes = ["ipfs.infura.io"];
  const { host } = ipfsClient.getEndpointConfig();
  return !nonPublishingNodes.some(nodeUrl => host.includes(nodeUrl));
};

const deploy = async () => {
  const { cid } = await pushDirectoryToIPFS("./build");
  if (!cid) {
    return false;
  }

  let ipnsName = "";
  if (nodeMayAllowPublish(ipfs)) {
    process.stdout.write("   Publishing to IPNS can take up to roughly two minutes.\r");
    ipnsName = (await publishHashToIPNS(cid.toString())).name;
    clearLine(process.stdout, 0);
    if (!ipnsName) {
    }
  }

  if (ipnsName) {
    console.log(
      "Each new deployment will have a unique IPFS hash while the IPNS name will always point at the most recent deployment.",
    );
    console.log(
      "It is recommended that you share the IPNS link so that people always see the newest version of your app.",
    );
  }

  return true;
};

deploy();
