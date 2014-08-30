var app = require('express')()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

var mongodb = require('mongodb').MongoClient;

mongodb.connect("mongodb://localhost:27017/userDB", function(err, db) {
  if(!err) {
    console.log("We are connected");
  } else {
  	console.log(err);
  }

  var collection = db.collection('users');

});

server.listen(3333);

app.get('/', function (req, res) {

    res.sendfile(__dirname + '/index.html');

});

app.get('/login', function (req, res) {

    res.sendfile(__dirname + '/login.html');

});

app.get('/js/core.js', function (req, res) {

    res.sendfile(__dirname + '/js/core.js');

});

function ParseData(data) {

		var oData = JSON.parse(data);

		console.log('command: ' + oData.command);
		console.log('user: ' + oData.user);
		console.log('password: ' + oData.pass)
}

var connIndex = 0;
var aConnections = [];
var max;

io.sockets.on('connection', function (socket) {

	socket.on('clientData', function (data) {

		console.log('received data')

		ParseData(data);

	});

	console.log('new connection')
	console.log(socket.id);

	aConnections[connIndex] = socket;
	connIndex++;

	max = aConnections.length;

});

//var timer = setInterval(SendRandomMessage, 5000);
var count = 0;

function SendRandomMessage() {

	if (max >= 3) {

		var connNum = Math.floor(Math.random() * max);
		console.log("writing to connection: " + connNum);

		var greetings = ['Hello', 'Whats Up?', 'Hey', 'Hola']; 
		var greetingNum = Math.floor(Math.random() * greetings.length);
		var greeting = greetings[greetingNum];

		aConnections[connNum].emit('message', greeting);

		count++;

		if (count >= 10) {
			clearInterval(timer);
		}

	} else {
		console.log('not enough connections')
	}

}








