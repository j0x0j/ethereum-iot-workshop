pragma solidity ^0.4.18;

/**
 * @title Simplified Validation Game
 * @dev know the true temperature for a particular area in a specific moment
 */
contract TemperatureValidationGame {
  address public owner;         // The contract creator
  address public tempLimit;     // Example parameter for game condition
  /* uint256 totalSlashedBalance;  // The amount of eth slashed from all sensors */

  struct ValidationGame {
    uint result;           // 0 = condition not met, 1 = condition met
    uint status;           // 0 = idle, 1 = commited, 2 = revealed
    uint sensors;          // The amount of participants in the game
    uint conditionMet;     // Amount of votes who affirm condition
    uint conditionNotMet;  // Amount of votes who affirm condition is not met
    uint256 bounty;        // Amount of ETH for winner
    address[] met;         // Addresses who committed the condition was met
    address[] notMet;      // Addresses who committed the condition was NOT met
  }

  uint numGames;  // Incremental id for games

  mapping (uint => ValidationGame) games;       // Registered sensors
  mapping (address => uint256) stakedSensors;   // Staked sensors
  mapping (address => uint256) winnerBalances;  // Winner balances
  mapping (address => bytes32) sensorCommits;   // The committed reading for the sensors

  event ValidationRequest(uint256 bounty, uint gameId);                 // Emitted when a validation game is requested
  event ValidationGameEnded(uint gameId, uint result, address winner);  // Emitted when game is finished
  event WinnerSelected(address winner);                                 // Emitted when winner is selected

  modifier onlyOwner() {
    if (msg.sender == owner) _;
  }

  /**
  @dev constructor sets the owner
  */
  function TemperatureValidationGame() public {
    owner = msg.sender;
    tempLimit = 30;
  }

  /**
  @dev adds stake (ETH) to a sensor address
  anyone can be a sensor, in reality this should be
  matched against a registry or another contract
  @param sensor the address of the sensor or owner
  */
  function addStake(address sensor) payable public {
    // should add to balance not just overwrite
    stakedSensors[sensor] = msg.value;
  }

  /**
  @dev creates a validation request to start a game,
  in the real-world we would specify a location or place of interest
  */
  function validationRequest() payable public {
    uint gameId = numGames + 1;
    address[] memory met;
    address[] memory notMet;
    games[gameId] = ValidationGame(0, 0, 0, 0, 0, msg.value, met, notMet);
    numGames++;
    ValidationRequest(msg.value, gameId);
  }

  /**
  @dev commit temperature reading for a game,
  @param gameId the game to commit to
  @param tempSecret as a hash
  */
  function commitTemperature(uint gameId, bytes32 tempSecret) public {
    // game already claimed
    require(games[gameId].status != 2);

    if (games[gameId].status == 0) {
      // switch committed flag
      games[gameId].status = 1;
    }
    // sensor can play one game at a time
    sensorCommits[msg.sender] = tempSecret;
    games[gameId].sensors += 1;
  }


  /**
  @notice should have a min block span to allow a reveal
  @dev reveal temperature reading for a game,
  @param gameId the game for which to to reveal vote
  @param temp as a uint
  @param salt used to create the hash
  */
  function revealTemperature(uint gameId, uint temp, uint salt) public {
    // check against commit
    require(keccak256(temp, salt) == sensorCommits[msg.sender]);

    // aggregate for or against condition
    // for our example we'll check for above 70deg
    if (uint(temp) >= uint(tempLimit)) {
      games[gameId].conditionMet += 1;
      games[gameId].met.push(msg.sender);
    } else {
      games[gameId].conditionNotMet += 1;
      games[gameId].notMet.push(msg.sender);
    }
    // subtract the revealing sensor
    games[gameId].sensors -= 1;
    if (games[gameId].sensors == 0) {
      // game ended, every sensor revealed
      games[gameId].status = 2;
      // need to pick a winner and slash the others
      selectWinner(gameId);
    }
  }

  /**
  @dev selects the winner according to stake
  @param gameId the game id
  */
  function selectWinner(uint gameId) internal returns(address) {
    // Loop throught winning condition addresses
    address leader;
    uint256 leaderBalance = 0;
    uint result;
    if (games[gameId].conditionMet > games[gameId].conditionNotMet) {
      for (uint i=0;i<games[gameId].met.length;++i) {
        // check stake amount
        leaderBalance = stakedSensors[games[gameId].met[i]];
        if (stakedSensors[games[gameId].met[i]] > leaderBalance) {
          leader = games[gameId].met[i];
        }
      }
      slashPlayers(games[gameId].notMet);
    } else {
      for (uint j=0;j<games[gameId].notMet.length;++j) {
        // check stake amount
        leaderBalance = stakedSensors[games[gameId].notMet[j]];
        if (stakedSensors[games[gameId].notMet[j]] > leaderBalance) {
          leader = games[gameId].notMet[j];
        }
      }
      slashPlayers(games[gameId].met);
    }
    // Add balance to winner
    winnerBalances[leader] += games[gameId].bounty;
    // St result for game
    games[gameId].result = result;
    ValidationGameEnded(gameId, result, leader);
    return leader;
  }

  /**
  @dev slashes losing player balances
  @param losers addresses
  */
  function slashPlayers(address[] losers) internal {
    for (uint i=0;i<losers.length;++i) {
      // slash the whole balance
      stakedSensors[losers[i]] = 0;
    }
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
