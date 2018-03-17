const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/npPr7wL0YRxP3ewG82AL')
const artifacts = require('../build/contracts/SimpleSensorMarket.json')
const contract = require('truffle-contract')
let SimpleSensorMarket = contract(artifacts)
SimpleSensorMarket.setProvider(provider)
SimpleSensorMarket.deployed()
  .then(function (instance) {
    console.log(instance)
  })
  .then(function (txId) {
    console.log(txId)
  })
