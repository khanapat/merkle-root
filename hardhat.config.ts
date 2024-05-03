import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomiclabs/hardhat-solhint";
import "@typechain/hardhat";
import "hardhat-deploy";

dotenv.config();

const defaultNetwork = "hardhat";

const REPORT_GAS = process.env.REPORT_GAS !== undefined;
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const POLYSCAN_API_KEY = process.env.POLYSCAN_API_KEY || "";
const MNEMONIC = process.env.MNEMONIC || "";
const ALCHEMY_RPC_KEY = process.env.ALCHEMY_RPC_KEY || "";

const config: HardhatUserConfig = {
    defaultNetwork,
    solidity: {
        compilers: [
            {
                version: "0.8.19",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 99999,
                    }
                }
            }
        ]
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
    namedAccounts: {
        deployer: {
            default: 0,
            1: 0,
        },
        feeCollector: {
            default: 1,
        },
    },
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 1337,
            accounts: [`0x${PRIVATE_KEY}`],
            tags: ["local"],
        },
        mumbai: {
            url: "https://rpc-mumbai.maticvigil.com",
            chainId: 80001,
            accounts: {
                mnemonic: MNEMONIC,
            },
            tags: ["mumbai"],
        },
        sepolia: {
            url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_RPC_KEY}`,
            chainId: 11155111,
            accounts: {
                mnemonic: MNEMONIC,
            },
            tags: ["sepo"], // (hre.network.tags to check tags) https://www.npmjs.com/package/hardhat-deploy#tags
        }
    },
    gasReporter: {
        enabled: REPORT_GAS,
        currency: "USD",
    },
    etherscan: { // verify contract - based explorers
        apiKey: {
            mainnet: ETHERSCAN_API_KEY,
            sepolia: ETHERSCAN_API_KEY,
            polygonMumbai: POLYSCAN_API_KEY,
        }
    },
    sourcify: { // verify contract - explorers compatible with its API
        enabled: true
    },
};

export default config;
