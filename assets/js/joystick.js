/**
 * Remote control
 */
var Joystick = {

    /**
     * [0, 360]
     * @var number
     */
    yaw: 0,

    /**
     * [0, 900]
     * @var number
     */
    pitch: 0,

    /**
     * [0, 900]
     * @var number
     */
    roll: 0,

    /**
     * [0, 100]
     * @var number
     */
    throttle: 0,

    /**
     * Initialisation
     *
     * @return boolean
     */
    init: function() {
        $('#remote .joystick .pad').draggable({
            drag: function (event, ui) {
                if ( ! Joystick.isInsideCircle(ui.position.left, -ui.position.top) ) {
                    return false;
                }

                var parent = $(this).parent().attr('id');

                if (parent == 'rjoystick') {
                    Joystick.updateYawThrottle(ui.position.left, -ui.position.top);
                } else if (parent == 'ljoystick') {
                    Joystick.updatePitchRoll(ui.position.left, -ui.position.top);
                }

                return false;
            }
        });
    },

    /**
     * Determine if a point is inside the circle defined as following :
     *     - Diameter : 200px
     *     - Center : (100px, -100px)
     * Origin is based on the parent's container origin.
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
    },

    /**
     * Update yaw & throttle values from the pad coordinates.
     *
     * @param number x : absciss of the pad.
     * @param number y : ordinate of the pad.
     */
    updateYawThrottle: function (x, y) {

    },

    /**
     * Update pitch & roll from the pad coordinates.
     *
     * @param number x : absciss of the pad.
     * @param number y : ordinate of the pad.
     */
    updatePitchRoll: function(x, y) {

    }
};