import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-gas-reporter";
import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-waffle';
import "solidity-coverage";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: process.env.ETHEREUM_SEPOLIA_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  },
  // Comentamos etherscan temporalmente
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY || "",
  // },
};

export default config;
