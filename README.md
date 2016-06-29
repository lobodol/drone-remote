# drone-remote
## Introduction
This project is based on **Apache Corodva**.
This project is a virtual quadcopter remote embeded in smartphone.
The purpose of this remote is to pilot a quadcopter from a smartphone.

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
