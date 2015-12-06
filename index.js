var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    port = process.env.PORT || 8000,
    io = require('socket.io')(http);


var messages = [];


/* Static server */
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

http.listen(port, function() {
    console.log('Listening on port', port);
});



/* Handle messages */
io.on('connection', function(socket) {

    socket.emit('get login'); // authorization of new user



    socket.on('set login', function(login) {
        socket.login = login;

        socket.emit('authenticated', login);


        socket.on('new message', function(message) {

            messages.push({
                message: message,
                login: socket.login
            });

            io.emit('new message', {
                message: message,
                login: socket.login
            });


        });

        socket.on('user join', function(login) {
            socket.broadcast.emit('user join', login);
        });

        socket.on('disconnect', function() {
            io.emit('user leave', socket.login);
        });


        socket.on('get current users', function() {

        });

    });




});






