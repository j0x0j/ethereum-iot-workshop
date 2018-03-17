// const Web3 = require('web3')
// const contract = require('truffle-contract')
//
// const web3 = new Web3(new Web3.providers.HttpProvider('	https://rinkeby.infura.io/npPr7wL0YRxP3ewG82AL'))
// const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/npPr7wL0YRxP3ewG82AL')
//
// var MyContract = contract({
//   abi: '',
//   address: '0xe9a6ae1086305af6ca9819daaa03ec2983a3fe18', // optional
//   // many more
// })
//
// MyContract.setProvider(provider)
//
//
const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/npPr7wL0YRxP3ewG82AL')
const artifacts = require('../build/contracts/SimpleSensorMarket.json')
const contract = require('truffle-contract')
let SimpleSensorMarket = contract(artifacts)
SimpleSensorMarket.setProvider(provider)
const SimpleSensorMarket.deployed()
  .then(function (instance) {
    console.log(instance)
  })
  .then(function (tx_id) {
    console.log(tx_id)
  })
