pragma solidity ^0.4.18;

/**
 * @title SimpleSensorMarket
 * @dev A contract to sell remote sensor data
 */
contract SimpleSensorMarket {
  address public owner;       // The contract creator
  uint256 public minPayment;  // Total number of claims

  struct RemoteSensor {
    uint id;          // Internal contract id
    address addr;     // Sensor owner account
    uint256 balance;  // Earned ETH for sensor
  }

  uint numSensors;  // Incremental id for sensors

  mapping (address => RemoteSensor) sensors;  // Registered sensors
  mapping (uint => address) sensorsById;      // Registered sensors by numeric id

  event RegisteredSensor(address addr, uint index);            // Emitted when sensor is registered
  event TemperatureRequest(uint sensorId, bytes callbackUrl);  // Emitted when an account paid for temp data

  modifier onlyOwner() {
    if (msg.sender == owner) _;
  }

  modifier onlyRemoteSensor() {
    if (sensors[msg.sender].addr != address(0x0)) _; // Sensor exists
  }

  /**
  @dev constructor sets the owner
  */
  function SimpleSensorMarket() public {
    owner = msg.sender;
  }

  /**
  @dev registers a remote sensor with the contract
  @param addr the address of sensor owner
  */
  function registerSensor(address addr) public {
    uint sensorId = numSensors + 1;
    sensors[addr] = RemoteSensor(sensorId, addr, 0);
    sensorsById[sensorId] = addr;
    numSensors++;
    RegisteredSensor(addr, sensorId);
  }

  /**
  @dev requests actual data from a remote sensor
  @param sensorId the internal id for the sensor
  @param callbackUrl the destination url for the sensor data
  */
  function requestSensorData(uint sensorId, bytes callbackUrl) payable public {
    // chk value is greater than or equal to minPayment
    require(msg.value >= minPayment);
    // Create event to start off-chain procedures
    sensors[sensorsById[sensorId]].balance += msg.value;
    TemperatureRequest(sensorId, callbackUrl);
  }

  /**
  @dev returns the total number of registered sensors
  */
  function getTotalSensors() public view returns(uint) {
    return numSensors;
  }

  /**
  @dev withdraws any balance held by the sensor
  @param value the amount of balance to transfer
  */
  function withdrawSensorFunds(uint256 value) onlyRemoteSensor public {
    // should check if there is enough balance
    if (sensors[msg.sender].balance >= value) {
      msg.sender.transfer(value);
    } else {
      revert();
    }
  }

  /**
  @dev sets minimum payment amount
  @param value the minimum amount of eth to pay for a sensor data
  */
  function setMinPayment(uint256 value) onlyOwner public {
    minPayment = value;
  }

  /**
  @dev returns the minimum payment amount
  */
  function getMinPayment() public view returns(uint256) {
    return minPayment;
  }

  /**
  @dev returns current owner's address
  */
  function getOwner() public view returns(address) {
    return owner;
  }

  /**
  @dev withdraws any balance held by the contract
  @param to the address to receive funds
  @param value the amount of balance to transfer
  */
  function withdraw(address to, uint256 value) onlyOwner public {
    // should check if there is enough balance
    if (!to.send(value)) revert();
  }

  /**
  @dev sends any held funds to the owner
  */
  function kill() onlyOwner public {
    selfdestruct(owner);
  }
}
