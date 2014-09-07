var app = require('express')()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

var mongodb = require('mongodb').MongoClient;

var global_db;

mongodb.connect("mongodb://localhost:27017/userDB", function(err, db) {
  if(!err) {
    console.log("We are connected");

    global_db = db;

  } else {
  	console.log(err);
  }

});

server.listen(3333);

app.get('/', function (req, res) {

    res.sendfile(__dirname + '/index.html');

});

app.get('/login', function (req, res) {

    res.sendfile(__dirname + '/login.html');

});

app.get('/register', function (req, res) {

    res.sendfile(__dirname + '/register.html');

});

app.get('/js/core.js', function (req, res) {

    res.sendfile(__dirname + '/js/core.js');

});

//setTimeout( function () { console.log(global_db) }, 3000); 

var connIndex = 0;
var aConnections = [];
var max;

io.sockets.on('connection', function (socket) {

	socket.on('clientData', function (data) {

		ParseData(data);

	});

	function ParseData(data) {

			var oData = JSON.parse(data);

			switch (oData.command) {
				case 'login':
					LoginUser(oData.email, oData.pass);
					break;
				case 'register':
					RegisterUser(oData.user, oData.email, oData.pass);
					break;
			}

	}

	function LoginUser(email, pass) {

		console.log('in login');

		var collection = global_db.collection('users');

		res = collection.find( { email: { $eq: email }, password: { $eq: pass } }).limit(1);

		/*if (!res) {

			var message = { command : 'login', dat : 'fail'}
			message = JSON.stringify(message);

			socket.emit('message', message);

		} else {

			app.get('/index.html', function(req,res) {
    			res.render('index.html');
			});


		}*/

		res.toArray( function (err, items) {

			if (items.length > 0) {



			} else {

				var message = { command : 'login', dat : 'fail'}
				message = JSON.stringify(message);

				socket.emit('message', message);

			}

		});



	}

	function RegisterUser(username, useremail, pass) {

		var items;

		console.log('in register');

		var collection = global_db.collection('users');

		var docs = [ {user:username, email: useremail, password: pass} ];

		collection.insert(docs, {w:1}, function(err, result) {

			LoginUser(result.email, result.password);

		});

	}

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








