$(document).ready( function () {

	var socket = io.connect('http://local.baseball.com:3333');

  	socket.on('news', function (data) {

  		SocketBroadcastIn(data);

  	});

  	socket.on('gameData', function (data) {
    	
    	SocketGameIn(data);

  	});

  	function SocketGameOut(outstring) {
		
		socket.emit('clientData', outstring );
  	
	}

	function SocketBroadcastOut(message) {

		socket.emit('broadcast', message);

	}

	function SocketBroadcastIn(data) {

		$("#messages").append("<li>" + data + "</li>");

	}

	function SocketGameIn(data) {

		
	}

	$("#startGame").click( function () {
		SocketGameOut("newgame--start|1")
	})

	$(".gameSelect").click( function () {
		gameid = $(this).data("game");
		SocketGameOut("joingame--id|" + gameid);

	})



});