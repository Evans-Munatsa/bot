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
  console.log("100% red");
  led.color("#FF0000");

  temporal.queue([{
    // After 3 seconds, dim to 30% intensity
    wait: 3000,
    task: function() {
      console.log("30% red");
      led.intensity(30);
    }
  }, {
    // 3 secs then turn blue, still 30% intensity
    wait: 3000,
    task: function() {
      console.log("30% blue");
      led.color("white");
    }
  }, {
    // Another 3 seconds, go full intensity blue
    wait: 3000,
    task: function() {
      console.log("100% blue");
      led.intensity(100);
    }
  }, ]);
});



app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});




//  app.get('/blink1', function(req, res) {
    //     led1.blink(100);
    //     res.render('index');
    // })

    //  app.get('/blink2', function(req, res) {
    //     led2.blink(100);
    //     res.render('index');
    // })

    // app.get("/off1", function(req, res) {
    //     led1.stop().off()
    //     res.render('index');
    // })

    // app.get("/on1", function(req, res) {
    //     led1.on()
    //     // led.fadeIn(500);
    //     res.render('index');
    // })

    // app.get("/off2", function(req, res) {
    //     led2.stop().off()
    //     res.render('index');
    // })

    // app.get('/on2', function(req, res) {
    //     led2.on();
    //     res.render('index');
    // })