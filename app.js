var app = require('express')()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

server.listen(3333);

app.get('/', function (req, res) {

    res.sendfile(__dirname + '/index.html');

});

app.get('/js/ang.js', function (req, res) {

    res.sendfile(__dirname + '/js/ang.js');

});

io.sockets.on('connection', function (socket) {

    socket.emit('new:msg', 'Welcome to Mars');

    socket.on('broadcast:msg', function (data) {

        socket.broadcast.emit('new:msg', data.message);

    })
})