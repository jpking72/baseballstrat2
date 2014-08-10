var app = require('express')()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

server.listen(3333);

app.get('/', function (req, res) {

    res.sendfile(__dirname + '/index.html');

});

app.get('/js/core.js', function (req, res) {

    res.sendfile(__dirname + '/js/core.js');

});

var gameIDIndex = 0;
var arrSockets = [];
var newgame;
var newsock;

io.sockets.on('connection', function (socket) {

	newsock = new UserSocket();
	newsock.sock = socket;
	newsock.game = null;
	newsock.host = null;
	newsock.opponent = null;
	newsock.room = "";

	newsock.Output('news', 'Welcome to Baseball Strategy II');

	arrSockets.push(socket);

});

CompleteGame = function ()

function Game() {

	this.gameID = ++gameIDIndex;
	this.complete = false;

}

function UserSocket() {

	this.sock.on('clientData', function (data)) {

		this.ParseClientData;

	};

	this.sock.on('broadcast', function (data)) {

		this.BroadcastToGame;

	};


	this.ParseClientData = function (data) {

		var arrData = data.split("--");
		var command = arrData[0];
		var data = arrData[1];
		var dataValues = data.split(",");

		var aGameData = {};

		for (i = 0; i < dataValues.length; i++) {

			var kvpair = dataValues[i].split("|");
			aGameData.kvpair[0] = kvpair[1];

		}

		this.PerformAction(command, aGameData);

	}


	this.PerformAction = function (command, aGameData) {

		switch (command) {

			case "newgame":
				this.CreateGame(aGameData);
				break;
			case "joingame":
				this.JoinGame(aGameData);
				break;

		}

	}

	this.CreateGame = function (startdata) {

		this.game = new Game();
		this.game.host = this.sock;

	} 

	this.JoinGame = function (joindata) {

		gameid = joindata.id;

		


	}

	this.BroadcastToGame = function(data) {

		if (this.game > 0) {

			this.sock.broadcast.emit(data);

		}

	}

	this.Output = function(data) {

		this.sock.broadcast.emit(data);

	}
}



