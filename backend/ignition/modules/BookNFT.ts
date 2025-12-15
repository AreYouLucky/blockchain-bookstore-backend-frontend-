import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("BookModule", (m) => {
  const book = m.contract("BookNFT");
  return { book };
});
