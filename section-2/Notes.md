Section 2
=========

Circuits and GPIO

Exercise 2.1
------------

DHT11 Temperature Sensor Three Pin Wiring

Three Pin
![alt text](./images/DHT11-Three-Pin-Wiring-Diagram.png "Three Pin")

Four Pin
![alt text](./images/DHT11-Four-Pin-Wiring-Diagram.png "Four Pin")

Credit: [CircuitBasics](http://www.circuitbasics.com/how-to-set-up-the-dht11-humidity-sensor-on-the-raspberry-pi/)

Create a directory `sketches`

* `wget https://github.com/adafruit/Adafruit_Python_DHT/archive/master.zip`
* `unzip master.zip`

Reference: https://github.com/adafruit/Adafruit_Python_DHT

Contract
--------

Section 2.1 Contract
Sell sensor data

Requirements
[x] A price per ping is specified
[x] The sensor must be registered (txn to register device)
[x] The contract must set a minimum payment amount
[x] The contract must verify that msg.amount is greater than minimum
[x] The contract must have a payable method that invokes a temperatureRequest event
[x] Said method accepts a required argument for an id (it could be a random range)
[x] A sensor owner can withdraw funds in sensor's balance
[ ] A program must listen to a contract event
[ ] The program must invoke the DHT11 sensor to read the current temperature
[ ] The program must accept a dest url argument
[ ] The program must know which registered id belongs to it

Contract Methods
- Register Device (increases internal counter and maps uint to address)
- Set min payment amount onlyOwner
- Get numDevices
- Get device address (by id)
- Request Temperature (increase ids balance with mapping)
- Set min payment onlyOwner
- kill
- Withdraw funds

Contract Structures
- RemoteSensor

Contract Events
- RegisteredDevice
- TemperatureRequest

For those who finish early
http://ncase.me/trust/
