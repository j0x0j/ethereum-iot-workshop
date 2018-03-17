Section 3.1 Contract
Validate the temperature

Scheme: Commit-Reveal, to eliminate collusion
Scheme: Staked Voting, to eliminate nothing at stake attack

Contract Requirements
[x] Add stake to sensor
[x] Sensor needs to submit vote
[x] Sensor need to reveal vote
[x] Sensor needs to get slashed if not within 66%
[x] Sensor needs to win a round <randomly> * stake
[x] Taker needs to request a validation game (payable)
[x] A winner should be chosen when total votes are revealed

Program Requirements
[ ] A program must listen to a validation request event
[ ] The program must invoke the DHT11 sensor to read the current temperature
[ ] The program must submit a hashed value for the reading
[ ] The program must send another txn to reveal the vote (after two blocks)

Contract Parameters
- Deviation Tolerance??

Contract Methods
- Add Stake (payable)
- Create Validation Request (payable)
- Commit Reading
- Reveal Reading
- Get Winner
- Withdraw Sensor Funds

Contract Structure
- Staked

Contract Events
- CommittedVote
- RevealedVote
- WinnerSelected

Channels
TXNs should transfer value, if not, spam

Further Reading
* https://medium.com/@AdChain/a-walkthrough-of-plcr-voting-in-solidity-92420bd5b87c
* https://github.com/ConsenSys/PLCRVoting/blob/4dc6553b25df08d0f9503d17c9ea98bcbd834ac0/contracts/PLCRVoting.sol#L316-L323
