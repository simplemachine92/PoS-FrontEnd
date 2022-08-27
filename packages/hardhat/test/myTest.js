const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("My Dapp", function () {
  let myContract;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  describe("YourContract", function () {
    it("Should deploy YourContract", async function () {
      const YourContract = await ethers.getContractFactory(
        "ProofOfStake_Pages"
      );

      myContract = await YourContract.deploy([
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
      ]);
    });

    /* describe("setPurpose()", function () {
      it("Should be able to set a new purpose", async function () {
        const newPurpose = "Test Purpose";

        await myContract.setPurpose(newPurpose);
        expect(await myContract.purpose()).to.equal(newPurpose);
      }); */

    // Uncomment the event and emit lines in YourContract.sol to make this test pass

    /*it("Should emit a SetPurpose event ", async function () {
        const [owner] = await ethers.getSigners();

        const newPurpose = "Another Test Purpose";

        expect(await myContract.setPurpose(newPurpose)).to.
          emit(myContract, "SetPurpose").
            withArgs(owner.address, newPurpose);
      });*/
  });
});
