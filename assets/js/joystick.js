/**
 * Remote control
 */
var Joystick = {
    /**
     * @var number
     */
    yaw: 0,

    /**
     * @var number
     */
    pitch: 0,

    /**
     * @var number
     */
    roll: 0,

    /**
     * @var number
     */
    throttle: 0,

    /**
     * Initialisation
     */
    init: function() {
        $('#remote .joystick .pad').draggable({
            drag: function (event, ui) {
                if ( ! Remote.isInsideCircle(ui.position.left, -ui.position.top) ) {
                    console.log('outside');
                } else {
                    console.log('inside');
                }
            }
        });
    },

    /**
     * Determine if a point is inside the circle defined as following :
     *     - Diameter : 200px
     *     - Center : (100px, -100px)
     *
     * @param number x : absciss of the point.
     * @param number y : ordinate of the point.
     * @returns {boolean}
     */
    isInsideCircle: function(x, y) {
        // Equation of points inside a circle : (x - a)^2 + (y - b)^2 <= r^2

        var isInside = false;

        var diameter = 200;
        var radius   = diameter/2;
        var a        = diameter/2;
        var b        = -diameter/2;

        // Left par of the equation
        var left = Math.pow((x - a), 2) + Math.pow((y - b), 2);
        // Right part of the equation
        var right = Math.pow(radius, 2);

        if (left <= right) {
            isInside = true;
        }

        return isInside;
    }
};