var five = require('johnny-five')
    , LEDs
    , board
    , photo         // photo resistor
    , state = 0     // current color (0 = r, 1 = g, 2 = b)
    , duty = 255    // current duty cycle
    , maxPhotoValue = 0 // highest photo resistor value
    , maxHue = [ ]    // color values at time of highest photo resistor value
    , timer            // loop
    , red
    , green
    , blue
    , idle    // boolean: is the sensor taking a reading?
    ;

    board = new five.Board();

    board.on('ready', function() {
    red = new five.Led(9);
    blue = new five.Led(10);
    green = new five.Led(11);
    LEDs = [ red, green, blue ];

    photo = new five.Sensor({
        pin : "A0"
        , freq : 200
    });

    photo.on('read', function(err, dat) {
        if(err) { return console.log(">>> Read error: %s", err); }
        //console.log("Raw value: %s, normalized: %s", dat, this.normalized); //this prints the photo resistor values, and if you'd like to see them, remove the slash marks from the front of the command

    });

    function stepColor() { //start cycling through the colors
        stateCheck();
        colorCheck(); //and while you're at it, check what color the object is
        LEDs[state].brightness(duty);
        LEDs[(state + 1) % 3].brightness(255 - duty);
    };

    function stateCheck() {
        if(--duty > 0) {
            return false;
        }
        //
        duty = 255;
        if(++state == 3) {
            // done with scan
            state = 0;
            console.log(maxHue)
            console.log(">>> %s", rgbToHex(maxHue));
            //
            maxPhotoValue = 0;
        }
        return true;
    };
    setInterval (stepColor, 10)

    function colorCheck() {
        //console.log(photo.value);
        if(photo.value > maxPhotoValue) {
            maxPhotoValue = photo.value;
            maxHue = [
                red.value ? red.value : 0
                , green.value ? green.value : 0
                , blue.value ? blue.value : 0
            ];
        }
    };

    function componentToHex(c) {
        if(c == null){
            return;
        }
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    };

    function rgbToHex(vals) {

        return [
            "#"
            , componentToHex(vals[0])
            , componentToHex(vals[1])
            , componentToHex(vals[2])
        ].join('');
    };
});