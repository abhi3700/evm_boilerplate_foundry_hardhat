import {task} from "hardhat/config";

import {config as dotenvConfig} from "dotenv";
import {resolve} from "path";

import {HardhatUserConfig /* , NetworkUserConfig */} from "hardhat/types";

import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";

import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-contract-sizer";

import "@nomiclabs/hardhat-etherscan";
import "hardhat-preprocessor";
import {getRemappings} from "./helper/helper";
// import "./deployment/index";
dotenvConfig({path: resolve(__dirname, "./.env")});

// Ensure that we have all the environment variables we need.
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;
if (!DEPLOYER_PRIVATE_KEY) {
    throw new Error("Please set your private key in a .env file");
}

const INFURA_API_KEY = process.env.INFURA_API_KEY;
if (!INFURA_API_KEY) {
    throw new Error("Please set your INFURA_API_KEY in a .env file");
}
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
if (!ALCHEMY_API_KEY) {
    throw new Error("Please set your ALCHEMY_API_KEY in a .env file");
}
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
if (!ETHERSCAN_API_KEY) {
    throw new Error("Please set your ETHERSCAN_API_KEY in a .env file");
}

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(await account.getAddress());
    }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        // coverage: {
        //   url: "http://127.0.0.1:8555",
        // },
        opkovan: {
            url: `https://opt-kovan.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
            chainId: 69,
            accounts: [`0x${DEPLOYER_PRIVATE_KEY}`],
        },
        opmainnet: {
            url: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
            chainId: 10,
            accounts: [`0x${DEPLOYER_PRIVATE_KEY}`],
        },
        opgoerli: {
            url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
            chainId: 420,
            accounts: [`0x${DEPLOYER_PRIVATE_KEY}`],
        },
        arbimainnet: {
            url: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
            chainId: 42161,
            accounts: [`0x${DEPLOYER_PRIVATE_KEY}`],
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.13",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    preprocess: {
        eachLine: (hre) => ({
            transform: (line: string) => {
                if (line.match(/^\s*import /i)) {
                    getRemappings().forEach(([find, replace]) => {
                        if (line.match(find)) {
                            line = line.replace(find, replace);
                        }
                    });
                }
                return line;
            },
        }),
    },
    paths: {
        sources: "./src",
        artifacts: "./build/artifacts",
        cache: "./cache_hardhat",
        tests: "./test/perp",
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        currency: "USD",
        gasPrice: 20,
        enabled: !!process.env.REPORT_GAS,
    },
    typechain: {
        outDir: "./build/typechain/",
        target: "ethers-v5",
    },
};

export default config;
