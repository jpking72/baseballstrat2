var app = require('express')()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

var baseball = require('./baseball');

server.listen(3333);

app.get('/', function (req, res) {

    res.sendfile(__dirname + '/index.html');

});

app.get('/js/core.js', function (req, res) {

    res.sendfile(__dirname + '/js/core.js');

});

var gameIDIndex = 0;
var arrSockets = [];
var arrGames = [];
var newgame;
var newsock;

io.sockets.on('connection', function (socket) {

	newsock = new UserSocket(socket);

	newsock.game = null;
	newsock.host = null;
	newsock.opponent = null;
	newsock.room = "";

	newsock.SendToHostSocket('Welcome to Baseball Strategy II');

	arrSockets.push(socket);

});

function Game(gameid) {

	this.gameID = gameid;
	this.joined = false;
	this.active = false;
	this.baseball = false;

}

function UserSocket(sock) {

	var o = this;

	this.sock = sock;

	this.sock.on('clientData', function (data) {

		o.ParseClientData(data);

	});

	this.sock.on('broadcast', function (data) {

		o.BroadcastToGame(data);

	});


	this.ParseClientData = function (data) {

		var oData = JSON.parse(data);

		console.log(oData);

		this.PerformAction(oData.command, oData.senddata);

	}


	this.PerformAction = function (command, aGameData) {

		switch (command) {

			case "newgame":
				this.CreateGame(aGameData.gameid);
				break;
			case "joingame":
				this.JoinGame(aGameData.gameid);
				break;

		}

	}

	this.CreateGame = function (hostdata) {

		console.log("current object");
		console.log(this);

		if (this.game) {

			console.log('game already started');
			return false;
		}

		newgame = new Game(hostdata);

		newgame.host = this.sock;

		this.game = newgame;

		arrGames.push(newgame);

		this.SendToHostSocket("Hosting game: " + newgame.gameID );

	} 

	this.JoinGame = function (joindata) {

		gameid = joindata.id;

		if ((matchedGame = this.FindGameByID(gameid)) != false) {

			if (matchedGame.complete) {

				this.SendToHostSocket("game already matched")
				return false;

			}

			this.game = matchedGame;

			matchedGame.remote = this.sock;
			mathcedGame.complete = true;
			matchedGame.active = true;
			matchedGame.room = "game" + matchedGame.gameID;

			matchedGame.host.join(this.room);
			matchedGame.remote.join(this.room);

			matchedGame.baseball = new Baseball();

			this.BroadCastToGame('Game ready to start');
			return true;

		} else {

			this.SendToHostSocket("invalid game")
			return false;

		}

	}

	this.FindGameByID = function (gameid) {

		console.log(gameid);

		for (i = 1; i < arrGames.length; i++) {

			if (arrGames[i].gameID == gameid) {

				return arrGames[i];

			}
		}

		return false;

	}

	this.BroadcastToGame = function(data) {

		if (this.game > 0) {

			io.sockets.in(this.game.room).emit('news', data); 

		}

	}

	this.SendToHostSocket = function(data) {

		this.sock.emit('news', data);

	}

	this.SendToRemoteSocket = function(data) {

		this.game.remote.emit('news', data);

	}

}



