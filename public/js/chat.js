(function(Logger) {

    var chatForm = document.getElementById('chatForm');
    var messageInput = document.getElementById('messageInput');
    var chat = document.querySelector('.chat');
    var auth = document.querySelector('.auth');
    var onlineUsersButton = chat.querySelector('.chat__link_users');
    var chatUsers = document.querySelector('.chat__users');



    function Chat(io, logger) {
        this.socket = io();
        this.logger = logger;


        var timer = null;

        var onlineUsers = [];

        /* chat events */
        this.socket.on('new message', this.handleNewMessage.bind(this));
        this.socket.on('user leave', this.handleUserLeave.bind(this));
        this.socket.on('user join', this.handleUserJoin.bind(this));
        this.socket.on('get login', this.authenticateUser.bind(this));
        this.socket.on('authenticated', this.init.bind(this));
        //this.socket.on('get users', this.handleUsers.bind(this), false);

        auth.style.display = "none";
        chat.style.display = "block";

        chatForm.addEventListener('submit', this.handleFormSubmit.bind(this), false);


        // update count label
        chatUsers.addEventListener('DOMNodeInserted', function() {
            var chatUsersCount = document.querySelector('.chat__users-count');
            chatUsersCount.innerHTML = onlineUsers.length;
        }, false);


        onlineUsersButton.addEventListener('click', function(event) {
            event.preventDefault();
            chatUsers.classList.toggle('chat__users_active');

            chatUsers.appendChild(document.createElement('a').appendChild(document.createTextNode('Link')));

            if (chatUsers.classList.contains('chat__users_active')) {
                timer = setTimeout(function() {
                    chatUsers.classList.remove('chat__users_active');
                }, 3000);
            } else {
                clearTimeout(timer);
            }
        }, false);


        chatUsers.addEventListener('mouseover', function() {
            clearTimeout(timer);
        }, false);

        chatUsers.addEventListener('mouseout', function() {
            timer = setTimeout(function() {
                chatUsers.classList.remove('chat__users_active');
            }, 3000);
        }, false);











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

        //auth.style.display = "block";
        //chat.style.display = "none";

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
        //chat.style.display = "block";
        //auth.style.display = "none";
        //this.socket.emit('user join', login);
    };





    new Chat(io, new Logger());
})(Logger);