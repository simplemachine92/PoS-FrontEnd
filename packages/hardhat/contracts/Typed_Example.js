//placeholder for v control, this will be updated to an Autograph scheme next

const eip712Example = {
  types: {
    set: [
      { name: "sender", type: "address" },
      { name: "x", type: "uint" },
      { name: "deadline", type: "uint" },
    ],
  },
  //make sure to replace verifyingContract with address of deployed contract
  primaryType: "set",
  domain: {
    name: "SetTest",
    version: "1",
    chainId: 4,
    verifyingContract: "0x35b6093edF572B85C76FA818B0b00ad5C024a5eb",
  },
  message: {
    sender: "0xb010ca9Be09C382A9f31b79493bb232bCC319f01",
    x: "1",
    deadline: "1",
  },
};
