# code-me-not
code-me-not is a simple web server that allows http clients to control the esp32's hardware without requiring any programming.  
It uses Minitor to allow clients to access it over Tor, from any Tor browser without requiring a 3rd party server.  
It does require that you have an sd card and that it is connected to the same pins as in main.c  

# Installation
To install you must clone this repo and then call `git submodule update --init --recursive`, which will pull Minitor and it's wolfssl fork into the components directory.  
You must also have the esp-idf installed and setup [click here](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/index.html).  
Set your WiFi ssid and password in `components/wifi_connect/include/wifi_connect.h`  
Then call `idf.py flash monitor` to flash the esp32.  

# Using code-me-not
code-me-not was made to showcase Minitor and currently only supports 2 functions, interrupt and simple pin control.  
Simple pin control allows you to set a pin to high or low using a button on the web interface.  
Interrupt pin control allows you to trigger other events when a pin's value is changed from high to low or vice versa, currently the only event is controling simple pins.  
