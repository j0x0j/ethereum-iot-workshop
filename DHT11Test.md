# Simple Test of Adafruit DHT11

Do SSH to the RPI and type this

- sudo apt-get update
- sudo apt-get install build-essential python-dev
- wget https://github.com/adafruit/Adafruit_Python_DHT/archive/master.zip
- unzip master.zip
- cd Adafruit_Python_DHT-master/
- sudo python setup.py install

touch simpletest.py

# Create a simple test file

nano simpletest.py


[SNIPET]
import Adafruit_DHT
sensor = Adafruit_DHT.DHT11
pin = 4
humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)

if humidity is not None and temperature is not None:
    print('Temp={0:0.1f}*C  Humidity={1:0.1f}%'.format(temperature, humidity))
else:
    print('failed to get reading')

[/SNIPET]    

Save it with Ctrl+O an then Ctrl-X to go out
    
execute it with
    
python simpletest.py

This is the output
Temp=21.0*C  Humidity=60.0%  
