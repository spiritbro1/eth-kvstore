require("dotenv").config();

const {
  INFURA_TOKEN,
  MNEMONIC,
  ETH_HOST,
  ETH_PORT,
  POLYGON_PRIVATE_KEY,
} = process.env;
const HDWalletProvider = require("@truffle/hdwallet-provider");
module.exports = {
  networks: {
    development: {
      host: ETH_HOST || "127.0.0.1",
      port: ETH_PORT || 7545,
      network_id: "*",
    },
    live: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: MNEMONIC,
          providerOrUrl: `https://mainnet.infura.io/${INFURA_TOKEN}`,
        }),
      network_id: "1",
    },
    kovan: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: MNEMONIC,
          providerOrUrl: `https://kovan.infura.io/${INFURA_TOKEN}`,
        }),
      network_id: "2",
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: MNEMONIC,
          providerOrUrl: `https://ropsten.infura.io/${INFURA_TOKEN}`,
        }),
      network_id: "3",
      gas: 4700000,
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: MNEMONIC,
          providerOrUrl: `https://rinkeby.infura.io/${INFURA_TOKEN}`,
        }),
      network_id: "4",
    },
    mumbai: {
      provider: () =>
        new HDWalletProvider({
          privateKeys: [POLYGON_PRIVATE_KEY],
          providerOrUrl: "https://matic-mumbai.chainstacklabs.com",
        }),
      network_id: 80001,
    },
  },
};
