/* global artifacts */

const TemperatureValidationGame = artifacts.require('TemperatureValidationGame')

module.exports = function (deployer) {
  // deployment steps
  deployer.deploy(TemperatureValidationGame)
}
