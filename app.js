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

gameIDIndex = 0;
arrSockets = [];
arrGames = [];


console.log("=========================================================================");

io.sockets.on('connection', function (socket) {

	console.log('New connection');

	var localSocket = socket;

	var newsock = new UserSocket(localSocket);

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

	this.thisSocket = sock;

	this.thisSocket.on('clientData', function (data) {

		console.log("user socket object");
		console.log(o);

		this.ParseClientData(data);

	});

	this.thisSocket.on('broadcast', function (data) {

		BroadcastToGame(data);

	});


	thts.ParseClientData = function (data) {

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

		if (o.game) {
			console.log('game already started');
			return false;
		}

		var newgame = new Game(hostdata);

		newgame.host = o.localSock;

		o.game = newgame;

		arrGames.push(newgame);

		o.SendToHostSocket("Hosting game: " + newgame.gameID );

		console.log("=========");

	} 

	o.JoinGame = function (joindata) {

		gameid = joindata.id;

		if ((matchedGame = this.FindGameByID(gameid)) != false) {

			if (matchedGame.complete) {

				o.SendToHostSocket("game already matched")
				return false;

			}

			o.game = matchedGame;

			matchedGame.remote = this.localSock;
			mathcedGame.complete = true;
			matchedGame.active = true;
			matchedGame.room = "game" + matchedGame.gameID;

			matchedGame.host.join(this.room);
			matchedGame.remote.join(this.room);

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

		o.localSock.emit('news', data);

	}

	o.SendToRemoteSocket = function(data) {

		o.game.remote.emit('news', data);

	}

}



