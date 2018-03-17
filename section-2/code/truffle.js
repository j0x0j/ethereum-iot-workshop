const HDWalletProvider = require('truffle-hdwallet-provider')

// Pub address: 0x25cc3f46855fa2ceaa165860681dd9071306f03b
const mnemonic =
  'payment local math advance attract region energy barely kitten model unveil armor'
const INFURA_KEY = 'npPr7wL0YRxP3ewG82AL'

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*' // Match any network id
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/' + INFURA_KEY)
      },
      gas: 4698712,
      network_id: 3
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/' + INFURA_KEY)
      },
      gas: 6.9e6,
      gasPrice: 15000000001,
      network_id: 4
    }
  }
}
