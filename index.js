var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 8000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

var io = require('socket.io')(http);


io.on('connection', function(socket) {

    socket.on('user message', function(message) {
        //обработка пользовательского сообщения
    });



});






http.listen(port, function() {
    console.log('Listening on port', port);
});