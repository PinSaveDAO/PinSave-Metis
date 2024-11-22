require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.16",
      },
      {
        version: "0.8.19",
      },
      {
        version: "0.8.20",
        settings: {
          evmVersion: "paris",
        },
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000,
      },
    },
  },
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2],
      chainId: 80001,
      gas: 8000000,
      gasPrice: 1000000000,
    },
    l16: {
      url: "https://rpc.l16.lukso.network",
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2],
      chainId: 2828,
      gas: 500000000000000,
      gasPrice: 300000000000,
    },
    l14: {
      url: "https://rpc.l14.lukso.network",
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2],
      chainId: 22,
      gas: 50000000,
      gasPrice: 1000000000000,
    },
    evmos: {
      url: "https://eth.bd.evmos.dev:8545",
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2],
      chainId: 9000,
    },
    fantom: {
      url: "https://rpc.ankr.com/fantom/",
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2],
      chainId: 250,
    },
    bsc: {
      url: "https://bscrpc.com",
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2],
      chainId: 56,
    },
    metis: {
      url: "https://andromeda.metis.io",
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2],
      chainId: 1088,
    },
    mantle: {
      url: "https://rpc.testnet.mantle.xyz/",
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2],
      chainId: 5001,
    },
    filecoin: {
      url: "https://rpc.ankr.com/filecoin",
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2],
      chainId: 314,
    },
    optimism: {
      url: "https://rpc.ankr.com/optimism",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 10,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "CHF",
    gasPrice: 21,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
