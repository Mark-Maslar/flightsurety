var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "spirit supply whale amount human item harsh scare congress discover talent hamster";

module.exports = {
  networks: {
    development: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/", 0, 50);
      },
      network_id: '*',
      gas: 4612388
    }
  },
  infura: {
    provider: function() { 
      return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/76ac8ac11a5e4aa4b10788976ee55439') 
    },
    network_id: 4,
    gas: 4612388,
    gasPrice: 100000000000,
  },
  compilers: {
    solc: {
      version: "^0.4.24"
    }
  }
};