$(document).ready( function () {

	var socket = io.connect('http://local.baseball.com:3333');
  		socket.on('news', function (data) {
    	$("#messages").append("<li>" + data + "</li>");
  	});

	$("#broadcast").click( function () {
		var message = $("#message").val();
		socket.emit('broadcast', { mydata: message });

	});

});