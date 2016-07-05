# drone-remote
## Introduction
This project is based on **Apache Corodva**.
This project is a virtual quadcopter remote embeded in smartphone.
The purpose of this remote is to pilot a quadcopter from a smartphone.

But, it doesn't control the quacopter directly. The app send instructions on the serial port on wich an Arduino must be pluged in.
This is the Arduino wich really send Instruction to an other through RF 433Mhz.

```
 _\/
   \+------------+      +---------+      +------------+
    | RF emitter |------| Arduino |------| Smartphone |
    +------------+      +---------+      +------------+
```    

Currently, works for Android smartphones.


## Requirements
- Cordova
- npm


## Installation
```
# Download sources
git clone https://github.com/lobodol/drone-remote

# Install node dependencies
cd drone-remote/gulp
npm install

# Build assets
gulp build

# Plug your smartphone to your computer, then run the app
cd ..
cordova run android
````
![Screenshot of the app]
(https://raw.githubusercontent.com/lobodol/drone-remote/master/screenshots/screenshot1.png)
