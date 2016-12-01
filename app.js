var express = require('express');
var five = require("johnny-five");
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var path = require("path");
var temporal = require("temporal");
var board = new five.Board();

app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));


app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, "public")));



board.on("ready", function() {
    // var led1 = new five.Led(13);
    // led1.on()

    var light = new five.Light("A2");
    light.on("change", function() {
            console.log(this.level);
        })
        // var led2 = new five.Led(13);
        // led2.on()

    app.get("/", function(req, res) {
        res.render('index');
    })

    // Initialize the RGB LED
    var led = new five.Led.RGB([6, 5, 3]);

    // Set to full intensity red
    // console.log("100% red");
    // led.color("#FF0000");

    temporal.queue([{
        wait: 3000,
        task: function() {
            console.log("100% green");
            led.color("green");
            led.intensity(100);
        }
    }, {
        wait: 3000,
        task: function() {
            console.log("30% blue");
            led.color("blue");
            led.intensity(100);
        },
        wait: 3000,
        task: function() {
            console.log("100% red");
            led.color("red");
            led.intensity(100);
        }
    }]);
});



app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
