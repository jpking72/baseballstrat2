$(document).ready( function () {

	var socket = io.connect('http://local.baseball.com:3333');

  	socket.on('news', function (data) {

  		SocketBroadcastIn(data);

  	});

  	socket.on('message', function (data) {
    	
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

		$("#messages").append("<li>" + data + "</li>");
	}

	$("#hostGame").click( function () {

		var gamenum = $('input[name=gameSelect]:checked', '#gameForm').val();

		var aSendData = { command : "newgame" , senddata : { gameid : gamenum } };
		var senddata = JSON.stringify(aSendData);
		SocketGameOut(senddata);

	});

	$("#joinGame").click( function () {

		var aSendData = { command : "joingame" , senddata : { gameid : gamenum } };
		var senddata = JSON.stringify(aSendData);
		SocketGameOut(senddata);

	})


});