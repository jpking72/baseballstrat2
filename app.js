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

	o = this;

	o.sock = sock;
	o.game = false;

	o.sock.on('clientData', function (data) {

		o.ParseClientData(data);

	});

	o.sock.on('broadcast', function (data) {

		o.BroadcastToGame(data);

	});


	o.ParseClientData = function (data) {

		var oData = JSON.parse(data);

		console.log(oData);

		o.PerformAction(oData.command, oData.senddata);

	}


	o.PerformAction = function (command, aGameData) {

		switch (command) {

			case "newgame":
				o.CreateGame(aGameData.gameid);
				break;
			case "joingame":
				o.JoinGame(aGameData.gameid);
				break;

		}

	}

	o.CreateGame = function (hostdata) {

		console.log('in create game');
		console.log(typeof o.game);

		if (o.game) {

			console.log('game already started');
			return false;
		}

		newgame = new Game(hostdata);

		console.log("game object created");
		console.log(newgame.gameID);

		newgame.host = o.sock;
		o.game = newgame;

		console.log(o.game.gameID);
		arrGames.push(newgame);

		o.SendToHostSocket("Hosting game: " + newgame.gameID );

	} 

	o.JoinGame = function (joindata) {

		gameid = joindata.id;

		console.log(arrGames);

		if ((matchedGame = o.FindGameByID(gameid)) != false) {

			if (matchedGame.complete) {

				o.SendToHostSocket("game already matched")
				return false;

			}

			o.game = matchedGame;

			matchedGame.remote = o.sock;
			mathcedGame.complete = true;
			matchedGame.active = true;
			matchedGame.room = "game" + matchedGame.gameID;

			matchedGame.host.join(o.room);
			matchedGame.remote.join(o.room);

			matchedGame.baseball = new Baseball();

			o.BroadCastToGame('Game ready to start');
			return true;

		} else {

			o.SendToHostSocket("invalid game")
			return false;

		}

	}

	o.FindGameByID = function (gameid) {

		console.log(gameid);

		for (i = 1; i < arrGames.length; i++) {

			if (arrGames[i].gameID == gameid) {

				return arrGames[i];

			}
		}

		return false;

	}

	o.BroadcastToGame = function(data) {

		if (o.game > 0) {

			io.sockets.in(o.game.room).emit('news', data); 

		}

	}

	o.SendToHostSocket = function(data) {

		o.sock.emit('news', data);

	}

	o.SendToRemoteSocket = function(data) {

		o.game.remote.emit('news', data);

	}

}



