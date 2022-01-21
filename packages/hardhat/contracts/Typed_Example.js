// EIP712 TypedData Scheme, used on signing dashboard, here for ref.

const eip712Example = {
  types: {
    signature: [
      { name: "sender", type: "address" },
      { name: "sig_number", type: "uint" },
      { name: "timestamp", type: "uint" },
    ],
  },
  //make sure to replace verifyingContract with address of deployed contract
  primaryType: "signature",
  domain: {
    name: "GreenPill_Pages",
    version: "0",
    chainId: 4,
    verifyingContract: "0xf1d7f9bba3b842379dD65547e79f368b846A874B",
  },
  message: {
    sender: "0xb010ca9Be09C382A9f31b79493bb232bCC319f01",
    sig_number: "1",
    timestamp: "1674300858",
  },
};
