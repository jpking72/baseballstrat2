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

io.sockets.on('connection', function (socket) {

    socket.emit('news', 'Welcome to Baseball Strategy II');

    socket.on('broadcast', function (data) {

    	console.log(data)

        socket.emit('news', data.mydata);

    })
})