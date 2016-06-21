/**
 * Remote control
 */
var Joystick = {

    /**
     * Yaw
     * [0, 360]
     * @var number
     */
    yaw: 0,

    /**
     * Pitch [-45.0, +45.0]
     * Offset +45 to have positive values : [0.0, +90.0]
     * x10 to have integers : [0, 900]
     * @var number
     */
    pitch: 0,

    /**
     * Roll [-45.0, +45.0]
     * Offset +45 to have positive values : [0.0, +90.0]
     * x10 to have integers : [0, 900]
     * @var number
     */
    roll: 0,

    /**
     * Throttle
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
        interact('.pad').draggable({
            onmove: Joystick.dragMoveListener,
            onend: Joystick.autoReturn,
        });

        // Perform a vibration when click on buttons.
        $('.button').click(function() {
            navigator.vibrate(50);
        });

        // When activate auto-return.
        $('#autoreturn').click(function() {
            if ($('#autoreturn:checked').length) {
                Joystick.animateToPosition('#rjoystick .pad', 0, 0);
                Joystick.animateToPosition('#ljoystick .pad', 0, $('#ljoystick .pad').attr('data-y'));
            }
        });
    },

    /**
     * Manage pads behavior when released depending on auto-return button's state.
     * If auto-return is checked, pads will be auto centered when released.
     * Do nothing otherwise.
     *
     * @param event
     */
    autoReturn: function(event) {
        if ($('#autoreturn:checked').length == 0) {
            return false;
        }

        var target   = event.target;
        var joystick = $(target).parent();

        if (joystick.attr('id') == 'rjoystick') {
            // Pitch/Roll joystick.
            var x = 0;
            var y = 0;
        } else if (joystick.attr('id') == 'ljoystick') {
            // Yaw/Throttle joystick.
            var x = 0;
            var y = target.getAttribute('data-y');
        } else {
            return false;
        }

        Joystick.animateToPosition(target, x, y);

        if ($(target).parent().attr('id') == 'ljoystick') {
            Joystick.updateYawThrottle(x, y);
        } else {
            Joystick.updatePitchRoll(x, y);
        }
    },

    /**
     * Move pad to desired position with soft transition.
     *
     * @param mixed  target : pad to move.
     * @param number x      : absciss of the destination.
     * @param number y      : ordinate of the destination.
     */
    animateToPosition: function(target, x, y) {
        $(target)
            .addClass('transition')
            .css('transform', 'translate(' + x + 'px, ' + y + 'px)')
            .attr('data-x', x)
            .attr('data-y', y);

        setTimeout(function() {
            $(target).removeClass('transition');
        }, 250);
    },

    /**
     * Callback of draggable.onmove listener.
     *
     * @param event
     */
    dragMoveListener : function(event) {
        var target = event.target;

        if (!Joystick.isInsideCircle($(target).position().left, -$(target).position().top)) {
            // Calculate point coordinates.
            var new_coordinates = Joystick.getClosestInnerPoint($(target).position().left, -$(target).position().top);

            if ($(target).parent().attr('id') == 'ljoystick') {
                var dataY = -new_coordinates[1]-200;
            } else {
                var dataY = -new_coordinates[1]-100;
            }

            target.setAttribute('data-x', new_coordinates[0]-100);
            target.setAttribute('data-y', dataY);
        }

        // Keep the dragged position in the data-x/data-y attributes.
        var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // Translate the element.
        target.style.webkitTransform =
            target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

        // Update the position attributes.
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);

        if ($(target).parent().attr('id') == 'ljoystick') {
            Joystick.updateYawThrottle(x, y);
        } else {
            Joystick.updatePitchRoll(x, y);
        }
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

        // Left par of the equation.
        var left = Math.pow((x - a), 2) + Math.pow((y - b), 2);
        // Right part of the equation.
        var right = Math.pow(radius, 2);

        if (left <= right) {
            isInside = true;
        }

        return isInside;
    },

    /**
     * Update yaw & throttle values from the pad coordinates.
     *
     * @param number x : absciss of the pad [-100, 100].
     * @param number y : ordinate of the pad [-200, 0].
     */
    updateYawThrottle: function (x, y) {
        if (y > 0) {
            y = 0;
        } else if (y < -200) {
            y = -200;
        }

        if (x > 100) {
            x = 100;
        } else if (x < -100) {
            x = -100;
        }

        Joystick.yaw      = (x + 100) * 1.8; // [0, 360]
        Joystick.throttle = (-1 * y) / 2;    // [0, 100]
    },

    /**
     * Update pitch & roll from the pad coordinates.
     *
     * @param number x : absciss of the pad [-100, 100].
     * @param number y : ordinate of the pad [-100, 100].
     */
    updatePitchRoll: function(x, y) {
        if (x < -100) {
            x = -100;
        } else if (x > 100) {
            x = 100;
        }

        if (y < -100) {
            y = -100;
        } else if (y > 100) {
            y = 100;
        }

        Joystick.roll  = (x + 100) * 4.5; // [0, 900];
        Joystick.pitch = (y + 100) * 4.5; // [0, 900];
    },

    /**
     * Get the coordinates of the point being on the circle and closest from the passed point.
     *
     * @param number padX : absciss of the point.
     * @param number padY : ordinate f the point.
     * @returns {*[]}
     */
    getClosestInnerPoint: function(padX, padY) {
        // Coordinates of the circle
        var circleX = 100;
        var circleY = -100;
        var radius  = 100;

        // Droite y = ax + b
        if (padX == circleX) {
            var coeffDir = 0;
        } else {
            var coeffDir = (padY - circleY) / (padX - circleX); // a
        }
        var ordOr    = padY - coeffDir*padX;                    // b

        // y = ax2 + bx + c
        var a = 1 + Math.pow(coeffDir, 2);
        var b = -2*circleX + 2*coeffDir*(ordOr - circleY);
        var c = Math.pow((ordOr - circleY), 2) - Math.pow(radius, 2) + Math.pow(circleX, 2);

        // delta = b2 -4ac
        var delta = Math.pow(b, 2) - 4*a*c;

        if (delta < 0) {
            // No real roots.
            var x_final = padX;

            if (padY >= 0) {
                var y_final = 0;
            } else {
                var y_final = -2*radius;
            }
        } else {

            // x1 = (-b - sqrt(delta)) / 2a
            var x1 = (-1*b - Math.sqrt(delta)) / (2*a);
            // x2 = (-b + sqrt(delta)) / 2a
            var x2 = (-1*b + Math.sqrt(delta)) / (2*a);


            if (Math.abs(padX-x1) < Math.abs(padX-x2)) {
                var x_final = Math.trunc(x1);
                var y_final = Math.trunc(coeffDir*x1 + ordOr);
            } else {
                var x_final = Math.trunc(x2);
                var y_final = Math.trunc(coeffDir*x2 + ordOr);
            }
        }

        return [x_final, y_final];
    }
};