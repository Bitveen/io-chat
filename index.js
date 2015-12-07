var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    port = process.env.PORT || 8000,
    io = require('socket.io')(http);


var messages = [];
var users = [];


/* Static server */
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

http.listen(port, function() {
    console.log('Listening on port', port);
});



io.on('connection', function(socket) {

    socket.emit('need authentication');

    socket.on('new user', function(login) {
        socket.login = login;
        users.push({
            login: login
        });
        socket.emit('init chat', users, messages);
        socket.broadcast.emit('user join', login);
    });


    socket.on('new message', function(message) {
        var newMessage = {
            message: message,
            login: socket.login,
            date: Date.now()
        };

        messages.push(newMessage);
        io.emit('new message', newMessage);
    });

    //socket.on('user join', function(login) {
    //    socket.broadcast.emit('user join', login);
    //});

    socket.on('disconnect', function() {
        for (var i = 0; i < users.length; i++) {
            if (users[i].login == socket.login) {
                users.splice(i, 1);
                break;
            }
        }
        socket.broadcast.emit('user leave', socket.login);
    });




});