// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

const sleep = (ms) =>
  new Promise((r) =>
    setTimeout(() => {
      // console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
      r();
    }, ms)
  );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("ProofOfStake_Pages", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [
      [
        "0xb010ca9Be09C382A9f31b79493bb232bCC319f01",
        "0x09E08a6c3015FA2c0DBafF4Ee2EB659Efd9fe31c",
        "0xB0CCf43adA6CBaA26dcf4907117b496d49f74242",
        "0x8913b99d5efD9e391AdE59168230F6425813D90A",
        "0x1A50a6238eb67285cCD4DF17f75CCe430BAAE2A4",
        "0xA4ca1b15fE81F57cb2d3f686c7B13309906cd37B",
        "0xBFc7CAE0Fad9B346270Ae8fde24827D2D779eF07",
        "0x69d95FfCeCe36DC3f2e9f5e42EB270a0BcD98665",
        "0x2fD39e6741b1446C51e8A120aB1D69F645e10e0E",
        "0x149986E1b481D9E026A3C4F472C0B86A7D5DF08D",
      ],
      [
        "133700000000000020",
        "133800000000000000",
        "133700200000000000",
        "133700200000000000",
        "133700200000000000",
        "133700200000000000",
        "133700000000000000",
        "133700200000000000",
        "133700000000000000",
        "133700000000000000",
      ],
    ],
    log: true,
  });

  // Getting a previously deployed contract
  const YourContract = await ethers.getContract("ProofOfStake_Pages", deployer);
  /*  await YourContract.setPurpose("Hello");
  
    To take ownership of yourContract using the ownable library uncomment next line and add the 
    address you want to be the owner. 
    // yourContract.transferOwnership(YOUR_ADDRESS_HERE);

    //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

  // Verify your contracts with Etherscan
  // You don't want to verify on localhost
  /* if (chainId !== localChainId) {
    // wait for etherscan to be ready to verify
    await sleep(15000);
    await run("verify:verify", {
      address: YourContract.address,
      contract: "contracts/YourContract.sol:YourContract",
      contractArguments: [],
    });
  } */
};
module.exports.tags = ["YourContract"];
