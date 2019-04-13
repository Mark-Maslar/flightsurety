// var HDWalletProvider = require("truffle-hdwallet-provider");
// var mnemonic = "spirit supply whale amount human item harsh scare congress discover talent hamster";
// var NonceTrackerSubprovider = require("web3-provider-engine/subproviders/nonce-tracker")

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    }
  },
//   development2: {
//     provider: function() {
//       var wallet = new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/", 0, 50);
//       var nonceTracker = new NonceTrackerSubprovider()
//       wallet.engine._providers.unshift(nonceTracker)
//       nonceTracker.setEngine(wallet.engine)
//       return wallet      
//     },
//     network_id: '*',
//     gas: 4612388
//   }
// },  
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