/* global artifacts */
/* global contract */
/* global it */
/* global assert */
/* global web3 */
const web3Utils = require('web3-utils')
const { soliditySha3 } = web3Utils

const TemperatureValidationGame = artifacts.require('TemperatureValidationGame')

const { promisifyEventWatcher } = require('./utils')

const salts = ['123', '456', '789']

contract('TemperatureValidationGame', function (accounts) {
  it('should return an instance of the registry contract', async function () {
    const contract = await TemperatureValidationGame.deployed()
    assert.isTrue(typeof contract !== 'undefined')
  })

  it('should verify the main account is the owner of the contract', async function () {
    const contract = await TemperatureValidationGame.deployed()
    const owner = await contract.getOwner.call()
    assert.equal(owner, accounts[0])
  })

  it('should add stake to an address', async function () {
    const contract = await TemperatureValidationGame.deployed()

    const txnWei = web3.toWei(0.01, 'ether')
    const txn = await contract.addStake(accounts[3], { from: accounts[2], value: txnWei })

    const txn2Wei = web3.toWei(0.015, 'ether')
    const txn2 = await contract.addStake(accounts[4], { from: accounts[0], value: txn2Wei })

    const txn3Wei = web3.toWei(0.025, 'ether')
    const txn3 = await contract.addStake(accounts[5], { from: accounts[6], value: txn3Wei })

    assert.equal(txn.receipt.status, '0x01')
    assert.equal(txn2.receipt.status, '0x01')
    assert.equal(txn3.receipt.status, '0x01')
  })

  it('should create a validation game request', async function () {
    const contract = await TemperatureValidationGame.deployed()
    const txnWei = web3.toWei(0.01, 'ether')
    const txn = await contract.validationRequest({ from: accounts[2], value: txnWei })
    assert.equal(txn.receipt.status, '0x01')
  })

  it('should create a validation game request', async function () {
    const contract = await TemperatureValidationGame.deployed()
    const txnWei = web3.toWei(0.01, 'ether')
    const txn = await contract.validationRequest({ from: accounts[1], value: txnWei })
    assert.equal(txn.receipt.status, '0x01')
  })

  it('should commit a hashed version of the temperature data', async function () {
    const contract = await TemperatureValidationGame.deployed()
    const txn = await contract.commitTemperature(1, soliditySha3('29', salts[0]), { from: accounts[3] })
    const txn2 = await contract.commitTemperature(1, soliditySha3('26', salts[1]), { from: accounts[4] })
    const txn3 = await contract.commitTemperature(1, soliditySha3('33', salts[2]), { from: accounts[5] })

    assert.equal(txn.receipt.status, '0x01')
    assert.equal(txn2.receipt.status, '0x01')
    assert.equal(txn3.receipt.status, '0x01')
  })

  it('should reveal committed vote for validation game', async function () {
    const contract = await TemperatureValidationGame.deployed()
    const events = contract.allEvents()

    const txn = await contract.revealTemperature(1, 29, +salts[0], { from: accounts[3] })
    const txn2 = await contract.revealTemperature(1, 26, +salts[1], { from: accounts[4] })
    const txn3 = await contract.revealTemperature(1, 33, +salts[2], { from: accounts[5] })

    assert.equal(txn.receipt.status, '0x01')
    assert.equal(txn2.receipt.status, '0x01')
    assert.equal(txn3.receipt.status, '0x01')

    const log = await promisifyEventWatcher(events)
    assert.equal(log.event, 'ValidationGameEnded')
    assert.equal(log.args.gameId, 1)
    assert.equal(log.args.result, 0)
    console.log('MARK', log.args)
    // assert.equal(log.args.winner, accounts[4])
    events.stopWatching()
  })
})
