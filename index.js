var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 8000;
var io = require('socket.io')(http);


/* Статический сервер */
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
http.listen(port, function() {
    console.log('Listening on port', port);
});



/* Обработка сообщений */
io.on('connection', function(socket) {
    console.log('Client connected');

    socket.emit('get login'); //авторизация нового пользователя

    socket.on('set login', function(login) {
        socket.login = login;

        socket.emit('authenticated', login);

        socket.on('new message', function(message) {
            io.emit('new message', {
                message: message,
                login: socket.login
            });
        });

        socket.on('user join', function(login) {
            socket.broadcast.emit('user join', login);
        });

        socket.on('disconnect', function() {
            console.log('Client disconnected');
            io.emit('user leave', socket.login);
        });

    });







});






