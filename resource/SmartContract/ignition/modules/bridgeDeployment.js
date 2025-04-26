const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeployBridgeToken", (m) => {
  // First testing account
  const owner = m.getAccount(0);

  // Deploy the BridgeToken contract
  const bridgeToken = m.contract("BridgeToken", []);

  return { bridgeToken };
});
