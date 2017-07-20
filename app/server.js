var config = require('./config.js');
var app = require('express')();

var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
mongoose.Promise = global.Promise;
mongoose.connect(config.dbLogin, function(err) {
    if(err) { console.log("ERR", err); return;}
});

var Temp = require('./models/Temp');
var Brew = require('./models/Brew.js');
//echo "temp=`python temp.py`" | curl -X POST -d @-  "http://192.168.1.245:3000/data"

app.post('/data', function (req, res) {
    var t = req.body.temp;
    console.log(t);
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

app.get('/brews', function(req, res) {
    Brew.find({}).then(function(data) {
        res.send(data);
    });
});

app.post('/brews', function(req, res) {
    var b = req.body;
    var brew = new Brew({
        name: b.name,
        started_at: b.started_at
    });
    brew.save(function(err) {
        if(err) { res.status(500).send({message: err.message, status: 0}) }
        res.send({message: 'success', status: 1});
    })

});

app.listen(3000, function() {
    console.log('started at port 3000');
});
