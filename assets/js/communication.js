var Communication = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        var potText = document.getElementById('pot');
        var delta = document.getElementById('delta');
        var on = document.getElementById('on');
        var off = document.getElementById('off');
        var open = false;
        var str = '';
        var lastRead = new Date();

        var errorCallback = function(message) {
            alert('Error: ' + message);
        };
        // request permission first
        serial.requestPermission({
            vid: '2a03',
            pid: '0043',
        },
            // if user grants permission
            function(successMessage) {
                // open serial port
                serial.open(
                    {baudRate: 9600},
                    // if port is succesfuly opened
                    function(successMessage) {
                        open = true;
                        // register the read callback
                        serial.registerReadCallback(
                            function success(data){
                                // decode the received message
                                var view = new Uint8Array(data);
                                if(view.length >= 1) {
                                    for(var i=0; i < view.length; i++) {
                                        // if we received a \n, the message is complete, display it
                                        if(view[i] == 13) {
                                            // check if the read rate correspond to the arduino serial print rate
                                            var now = new Date();
                                            delta.innerText = now - lastRead;
                                            lastRead = now;
                                            // display the message
                                            var value = parseInt(str);
                                            pot.innerText = value;
                                            str = '';
                                        }
                                        // if not, concatenate with the begening of the message
                                        else {
                                            var temp_str = String.fromCharCode(view[i]);
                                            var str_esc = escape(temp_str);
                                            str += unescape(str_esc);
                                        }
                                    }
                                }
                            },
                            // error attaching the callback
                            errorCallback
                        );
                    },
                    // error opening the port
                    errorCallback
                );
            },
            // user does not grant permission
            errorCallback
        );

        on.onclick = function() {
            if (open) serial.write('1');
        };
        off.onclick = function() {
            if (open) serial.write('0');
        }
    },

    /**
     * Build message as an array of bytes and sent it to Arduino.
     *
     * @param number yaw      : yaw command [0, 360]
     * @param number pitch    : pitch command [0, 900]
     * @param number roll     : roll command [0, 900]
     * @param number throttle : throttle command [0, 100]
     */
    sendInstructions: function(yaw, pitch, roll, throttle) {
        var message = new Uint8Array(10);
        message[0] = 0x02;
        message[1] = yaw >> 8;   // Yaw MSB
        message[2] = yaw;        // Yaw LSB
        message[3] = pitch >> 8; // Pitch MSB
        message[4] = pitch;      // Pitch LSB
        message[5] = roll >> 8;  // Roll MSB
        message[6] = roll;       // Roll LSB
        message[7] = throttle;   // Throttle
        var checksum = message[0] ^ message[1] ^ message[2] ^ message[3] ^ message[4] ^ message[5] ^ message[6] ^ message[7];
        message[8] = checksum;
        message[9] = 0x03;

        for (var i = 0; i < message.length; i++) {
            serial.write(message[i]);
        }
    }
};

Communication.initialize();