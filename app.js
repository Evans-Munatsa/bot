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
    var lightSensor = new five.Light("A2");
    var currentRGBColor = '';
    var currentSensorValue = 0;

    lightSensor.on("change", function() {
        if (currentRGBColor != ''){
          //console.log('Sampling ' + currentRGBColor + " : "  + this.level);
          currentSensorValue = this.level;
        }
    })
        // var led2 = new five.Led(13);
        // led)

    app.get("/", function(req, res) {
        res.re//nder(x');
    })


    // Initialize the RGB LED
    var led = new five.Led.RGB([6, 5, 3]);
    var context = {};

    // Set to full intensity red
    // console.lo0% red");
    // led.color("#FF0000");


    function sampleColor(color, cb){

      var readings = {};

      function read(rgbColor){

        return [{
          wait : 1000,
          task : function (){
            console.log("PLEASE SHOW ME : " + color);
          },
        },
          {
            wait: 5000,
            task: function() {
                currentRGBColor = rgbColor;
                console.log(rgbColor)//;
                led.color(rgbColor);
                led.intensity(100);
            }
        },{
            wait: 1000,
            task: function() {
                currentRGBColor = rgbColor;
                readings[rgbColor] = currentSensorValue;
            }
        },

        {
            wait: 1000,
            task: function() {
                currentRGBColor = rgbColor;
                readings[rgbColor] = (readings[rgbColor] + currentSensorValue)/2;
            }
        },
        {
            wait: 1000,
            task: function() {
                currentRGBColor = rgbColor;
                readings[rgbColor] = (readings[rgbColor] + currentSensorValue)/2;
            }
        }];

      }

      var queue = [];

      queue = queue.concat(read('red'));
      queue = queue.concat(read('green'))
      queue = queue.concat(read('blue'))

      queue.push({
          wait: 1000,
          task: function() {
              //currentRGBColor = rgbColor;
              //readings[color] = (readings[color] + currentSensorValue)/2;

              context[color] = readings;

          }
      });

      return queue;

    }

    var colorQueue = sampleColor('white');
    colorQueue = colorQueue.concat(sampleColor('black'));
    colorQueue = colorQueue.concat(sampleColor('theColor'));
    colorQueue.push({
        wait: 1000,
        task: function() {
            //currentRGBColor = rgbColor;
            //readings[color] = (readings[color] + currentSensorValue)/2;
            currentRGBColor = '';
            console.log(context);
            //context[color] = readings;

        }
    });

    temporal.queue(colorQueue)


  // console.log("Quick show me white!");
  // sampleColor('white', function(err, whiteData){
  //
  //   console.log("Quick show me black!");
  //   sampleColor('black', function(err, blackData){
  //     console.log('let me guess...');
  //     sampleColor('guess', function(err, theColor){
  //       //
  //       console.log(whiteData);
  //       console.log(blackData);
  //       console.log(colorData);
  //     });
  //   });
  // });



    /*
    temporal.queue([{
        wait: 5000,
        task: function() {
            currentRGBColor = 'red';
            console.log("100% red");
            led.color("red");
            led.intensity(100);
        }
    },{
        wait: 1000,
        task: function() {
            currentRGBColor = 'red';
            readings['red'] = currentSensorValue;
        }
    },

    {
        wait: 1000,
        task: function() {
            currentRGBColor = 'red';
            readings['red'] = (readings['red'] + currentSensorValue)/2;
        }
    },
    {
        wait: 1000,
        task: function() {
            currentRGBColor = 'red';
            readings['red'] = (readings['red'] + currentSensorValue)/2;
        }
    },

     {
        wait: 5000,
        task: function() {
            currentRGBColor = 'green';
            console.log("100% green");
            led.color("green");
            led.intensity(100);
        }
    }, {
        wait: 5000,
        task: function() {
            currentRGBColor = 'blue';
            console.log("100% blue");
            led.color("blue");
            led.intensity(100);
        }
    }, {
      wait : 500,
      task : function(){
        console.log(readings);

      }

    }]);
    */


});



app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
