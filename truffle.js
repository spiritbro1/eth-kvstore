require("dotenv").config();

const {
  INFURA_TOKEN,
  MNEMONIC,
  ETH_HOST,
  ETH_PORT,
  POLYGON_PRIVATE_KEY,
} = process.env;
const HDWalletProvider = require("truffle-hdwallet-provider");
const PrivateKeyProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: ETH_HOST || "127.0.0.1",
      port: ETH_PORT || 8545,
      network_id: "*",
    },
    live: {
      provider: () =>
        new HDWalletProvider(
          MNEMONIC,
          `https://mainnet.infura.io/${INFURA_TOKEN}`
        ),
      network_id: "1",
    },
    kovan: {
      provider: () =>
        new HDWalletProvider(
          MNEMONIC,
          `https://kovan.infura.io/${INFURA_TOKEN}`
        ),
      network_id: "2",
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          MNEMONIC,
          `https://ropsten.infura.io/${INFURA_TOKEN}`
        ),
      network_id: "3",
      gas: 4700000,
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          MNEMONIC,
          `https://rinkeby.infura.io/${INFURA_TOKEN}`
        ),
      network_id: "4",
    },
    mumbai: {
      provider: () =>
        new PrivateKeyProvider({
          privateKeys: [
            "34b7a3365f5880e9681b43d84aa77796c18503ff2505d5eb00f9a1806abca746",
          ],
          providerOrUrl: "https://matic-mumbai.chainstacklabs.com",
        }),
      network_id: 80001,
    },
  },
};
