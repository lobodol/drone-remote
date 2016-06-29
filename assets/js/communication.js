var Communication = {
    /**
     * Hex value for STOP byte
     * @var string
     */
    STX: '02',

    /**
     * Hex value for STOP byte
     * @var string
     */
    ETX: '03',

    /**
     * Initialize object
     */
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
        // Convert values to hexadecimal
        var yaw_hex      = Communication.format_byte(yaw.toString(16), 2);
        var pitch_hex    = Communication.format_byte(pitch.toString(16), 2);
        var roll_hex     = Communication.format_byte(roll.toString(16), 2);
        var throttle_hex = Communication.format_byte(throttle.toString(16), 1);

        // Message sent to the Arduino
        var message      = [];

        message[0] = Communication.STX;      // START byte
        message[1] = yaw_hex.substr(0, 2);   // Yaw MSB
        message[2] = yaw_hex.substr(2, 2);   // Yaw LSB
        message[3] = pitch_hex.substr(0, 2); // Pitch MSB
        message[4] = pitch_hex.substr(2, 2); // Pitch LSB
        message[5] = roll_hex.substr(0, 2);  // Roll MSB
        message[6] = roll_hex.substr(2, 2);  // Roll LSB
        message[7] = throttle_hex;           // Throttle
        message[8] = '00';                   // Checksum : calculated by the Arduino, not here
        message[9] = Communication.ETX;      // STOP byte

        console.log(message);

        for (var i = 0; i < message.length; i++) {
            serial.writeHex(message[i]);
        }
    },

    /**
     * Format a value by prepending '0' if necessary to match byte length.
     *
     * @param string value   : hex representation of a value to format on n bytes
     * @param number nb_byte : number of byte for the final value
     * @returns string
     */
    format_byte: function(value, nb_byte) {
        while (value.length < 2*nb_byte) {
            value = '0' + value;
        }

        return value;
    }
};

Communication.initialize();