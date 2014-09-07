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

	var oData = JSON.parse(data);

	if (oData.command == 'login') {

		if (oData.dat == 'success') {

			window.location.href = "/";

		} else {

			$("#messages").append("<li>Invalid Login</li>");

		}

	}
}


