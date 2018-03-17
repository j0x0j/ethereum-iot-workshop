/* global artifacts */
/* global contract */
/* global it */
/* global assert */
/* global web3 */

const SimpleSensorMarket = artifacts.require('SimpleSensorMarket')

const { promisifyEventWatcher } = require('./utils')

contract('SimpleSensorMarket', function (accounts) {
  it('should return an instance of the registry contract', async function () {
    const contract = await SimpleSensorMarket.deployed()
    assert.isTrue(typeof contract !== 'undefined')
  })

  it('should verify the main account is the owner of the contract', async function () {
    const contract = await SimpleSensorMarket.deployed()
    const owner = await contract.getOwner.call()
    assert.equal(owner, accounts[0])
  })

  it('should set the minimum payment for sensor data', async function () {
    const contract = await SimpleSensorMarket.deployed()
    const txn = await contract.setMinPayment(web3.toWei(0.01, 'ether'), { from: accounts[0] })
    assert.equal(txn.receipt.status, '0x01')

    const fee = await contract.getMinPayment.call()
    assert.equal(fee, web3.toWei(0.01, 'ether'))
  })

  it('should create a sensor', async function () {
    const contract = await SimpleSensorMarket.deployed()
    // Create a sensor
    const events = contract.allEvents()
    const txn = await contract.registerSensor(accounts[2], { from: accounts[1] })
    assert.equal(txn.receipt.status, '0x01')

    const log = await promisifyEventWatcher(events)
    assert.equal(log.event, 'RegisteredSensor')
    assert.equal(log.args.addr, accounts[2])
    events.stopWatching()
  })

  it('should get the total number of sensors', async function () {
    const contract = await SimpleSensorMarket.deployed()
    // Create another sensor
    await contract.registerSensor(accounts[3], { from: accounts[2] })
    const numSensors = await contract.getTotalSensors.call()
    assert.equal(numSensors.valueOf(), 2)
  })

  it('should create an event if minimum payment is sent', async function () {
    const contract = await SimpleSensorMarket.deployed()
    // Create another sensor
    const events = contract.allEvents()
    const txnWei = web3.toWei(0.01, 'ether')
    const txn = await contract.requestSensorData(1, 'https://mydomain.com/temp', { from: accounts[4], value: txnWei })
    assert.equal(txn.receipt.status, '0x01')

    const log = await promisifyEventWatcher(events)
    assert.equal(log.event, 'TemperatureRequest')
    assert.equal(log.args.sensorId, 1)
    assert.equal(
      web3.toAscii(log.args.callbackUrl.valueOf()),
      'https://mydomain.com/temp'
    )
    events.stopWatching()
  })

  it('should revert txn for insufficient payment', async function () {
    const contract = await SimpleSensorMarket.deployed()
    // Create another sensor
    const txnWei = web3.toWei(0.001, 'ether')
    try {
      await contract.requestSensorData(1, 'https://mydomain.com/temp', { from: accounts[4], value: txnWei })
    } catch (err) {
      assert.equal(err.name, 'StatusError')
    }
  })

  it('should withdraw sensor funds for owned address', async function () {
    const contract = await SimpleSensorMarket.deployed()
    // Create a sensor
    const txnWei = web3.toWei(0.005, 'ether')
    const txn = await contract.withdrawSensorFunds(txnWei, { from: accounts[2] })
    assert.equal(txn.receipt.status, '0x01')

    const balance = await web3.eth.getBalance(accounts[2])
    assert.isTrue(balance.valueOf() > 0)
  })

  it('should revert txn for insufficient balance request', async function () {
    const contract = await SimpleSensorMarket.deployed()
    // Create another sensor
    const txnWei = web3.toWei(150, 'ether')
    try {
      await contract.withdrawSensorFunds(txnWei, { from: accounts[2] })
    } catch (err) {
      assert.equal(err.name, 'StatusError')
    }
  })
})
