var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var localization = require(__dirname + '/../sendbyte-tool/localization');
var buildRoomMapping = require('./updateRooms').buildRoomMapping;
var request = require('request');
var roomMapping = { };

setInterval(function() {
	var mapping = localization.getPresenceRSSIMap();
	roomMapping = buildRoomMapping(mapping);

	for(var personName in roomMapping) {
		var roomName = roomMapping[personName];

		console.log(personName + ' is in ' + roomName);
		request.put('http://divya.wigwag.com:9090/rooms/' + roomName + '/' + personName);
	}
}, 1000)

// var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));
//app.use('/controllers',express.static(path.join(__dirname, 'public/controllers')));

// app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler


app.get('/localizationMap', function(req, res) {
	var rssiMap = localization.getFilamentRSSIMap();
	res.status(200).send(rssiMap);
})

app.get('/presenceMap', function(req, res) {
	var presenceValue = localization.getPresenceRSSIMap();
	res.status(200).send(presenceValue);
})

app.get('/personMap', function(req, res) {
    res.status(200).send(roomMapping);
})

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

localization.start().then(function() {
	app.listen(8080);
})
module.exports = app;
