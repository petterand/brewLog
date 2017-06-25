var app = require('express')();

var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:33066/brew_temps', function(err) {
  if(err) { console.log("ERR", err); return;}
});

var Temp = require('./models/Temp');

//echo "temp=`python temp.py`" | curl -X POST -d @-  "http://192.168.1.245:3000/data"

app.post('/data', function (req, res) {
    var t = req.body.temp;
    
    var temp = new Temp({
      temperature: t
    });

    temp.save(function(err) {
      if(err) {console.log('ERR', err); res.end();}
      res.end();
    });

});

function handleGetTemps(err, temps, res) {
  if(err) { res.send(JSON.stringify({status:0, message: err.message}));}

  var responseObject = {status: 1, data: temps, message: 'success'};
  
  res.send(JSON.stringify(responseObject));
}

app.get('/temp', function(req, res) {
  if(req.query.dateFrom) {
    var dateFrom = new Date(parseInt(req.query.dateFrom));
    if(req.query.dateTo) {
      var dateTo = new Date(parseInt(req.query.dateTo));
      Temp.find({}).where('measured_at').gt(dateFrom).lt(dateTo).exec(function(err, temps) {
        handleGetTemps(err, temps, res);
      });
    } else {
      Temp.find({}).where('measured_at').gt(dateFrom).exec(function(err, temps) {
        handleGetTemps(err, temps, res);
      });
    }
  } else {
    Temp.find({}, function(err, temps) {
      handleGetTemps(err, temps, res);
    });
  }
});

app.listen(3000);
