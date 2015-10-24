(function(Logger) {

    var chatForm = document.getElementById('chatForm');
    var messageInput = document.getElementById('messageInput');
    var chat = document.querySelector('.chat');
    var auth = document.querySelector('.auth');



    function Chat(io, logger) {
        this.socket = io();
        this.logger = logger;

        /* События самого чата */
        this.socket.on('new message', this.handleNewMessage.bind(this));
        this.socket.on('user leave', this.handleUserLeave.bind(this));
        this.socket.on('user join', this.handleUserJoin.bind(this));
        this.socket.on('get login', this.authenticateUser.bind(this));
        this.socket.on('authenticated', this.init.bind(this));


        
        chatForm.addEventListener('submit', this.handleFormSubmit.bind(this), false);
    }


    Chat.prototype.handleNewMessage = function(data) {
        this.logger.writeNewMessage(data);
    };

    Chat.prototype.handleUserLeave = function(login) {
        this.logger.writeUserLeaveMessage(login);
    };

    Chat.prototype.handleUserJoin = function(login) {
        this.logger.writeUserJoinMessage(login);
    };


    Chat.prototype.authenticateUser = function() {

        auth.style.display = "block";
        chat.style.display = "none";

        var loginForm = document.getElementById('formAuth');
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            var loginInput = document.getElementById('loginInput');
            var login = loginInput.value.trim();
            if (login) {
                this.socket.emit('set login', login);
                loginInput.value = '';
            }
        }.bind(this), false);
    };

    Chat.prototype.handleFormSubmit = function(event) {
        event.preventDefault();
        var message = messageInput.value.trim();
        if (message) {
            this.socket.emit('new message', message);
            messageInput.value = '';
        }
    };

    Chat.prototype.init = function(login) {
        chat.style.display = "block";
        auth.style.display = "none";
        this.socket.emit('user join', login);
    };

    new Chat(io, new Logger());
})(Logger);