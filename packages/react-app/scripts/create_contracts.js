const fs = require("fs");

if (!fs.existsSync("./src/contracts/hardhat_contracts.json")) {
  try {
    fs.writeFileSync("./src/contracts/hardhat_contracts.json", JSON.stringify({}));
  } catch (error) {}
}
