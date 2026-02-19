import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BNOUDevModule = buildModule("BNOUDevModule", (m) => {
  const bnouDev = m.contract("BNOUDev", []);
  return { bnouDev };
});

export default BNOUDevModule;
