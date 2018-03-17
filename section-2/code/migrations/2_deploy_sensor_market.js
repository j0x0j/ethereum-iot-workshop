/* global artifacts */

const SimpleSensorMarket = artifacts.require('SimpleSensorMarket')

module.exports = function (deployer) {
  // deployment steps
  deployer.deploy(SimpleSensorMarket)
}
