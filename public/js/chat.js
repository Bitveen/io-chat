(function() {
    "use strict";

    var container = document.querySelector('.container');

    var authTemplate = document.getElementById('auth-template').innerHTML;
    var chatTemplate = document.getElementById('chat-template').innerHTML;

    var authView = Handlebars.compile(authTemplate);
    var chatView = Handlebars.compile(chatTemplate);


    var socket = io();


    function Chat() {
        this.users = [];
        this.messages = [];


        this.onlineUsersButton = null;
        this.chatUsers = null;
        this.loginForm = null;
        this.chat = null;
        this.chatForm = null;

        this.timer = null;

        socket.on('need authentication', this.authenticate.bind(this));
        socket.on('init chat', this.init.bind(this));
        socket.on('user join', this.addUser.bind(this));
        socket.on('user leave', this.removeUser.bind(this));
        socket.on('new message', this.writeMessage.bind(this));
    }

    /* Вставка формы аутентификации */
    Chat.prototype.authenticate = function() {
        container.innerHTML = authView();
        this.loginForm = document.getElementById('formAuth');
        this.loginForm.addEventListener('submit', this.handleLoginForm, false);
    };


    /* Аутентификация */
    Chat.prototype.handleLoginForm = function(event) {
        event.preventDefault();
        var loginInput = document.getElementById('loginInput');
        var login = loginInput.value.trim();
        if (login) {
            socket.emit('new user', login);
            loginInput.value = '';
        }
    };


    /* Срабатывает после аутентификации. Открытие самого чата */
    Chat.prototype.init = function(users, messages) {
        var self = this;

        self.users = users;
        self.messages = messages;

        self.loginForm.removeEventListener('submit', self.handleLoginForm, false);

        container.innerHTML = chatView({
            onlineUsers: self.users,
            messages: self.messages
        });

        self.chat = document.querySelector('.chat');
        self.onlineUsersButton = this.chat.querySelector('.chat__link_users');
        self.chatUsers = document.querySelector('.chat__users');
        self.chatForm = document.getElementById('chatForm');


        self.onlineUsersButton.addEventListener('click', function(event) {
            event.preventDefault();
            self.chatUsers.classList.toggle('chat__users_active');
            if (self.chatUsers.classList.contains('chat__users_active')) {
                self.timer = setTimeout(function() {
                    self.chatUsers.classList.remove('chat__users_active');
                }, 2000);
            } else {
                clearTimeout(self.timer);
            }
        }, false);


        self.chatUsers.addEventListener('mouseover', function() {
            clearTimeout(self.timer);
        }, false);

        self.chatUsers.addEventListener('mouseout', function() {
            self.timer = setTimeout(function() {
                self.chatUsers.classList.remove('chat__users_active');
            }, 2000);
        }, false);



        self.chatUsers.addEventListener('DOMNodeInserted', self.updateUsersCounter.bind(self), false);
        self.chatUsers.addEventListener('DOMNodeRemoved', self.updateUsersCounter.bind(self), false);

        self.chatForm.addEventListener('submit', self.handleSendMessage.bind(this), false);

    };

    /* Обновление счетчика пользователей */
    Chat.prototype.updateUsersCounter = function() {
        var chatUsersCount = document.querySelector('.chat__users-count');
        chatUsersCount.innerHTML = this.users.length;
    };


    /* Отправка сообщения */
    Chat.prototype.handleSendMessage = function(event) {
        event.preventDefault();
        var messageInput = document.getElementById('messageInput');
        var message = messageInput.value.trim();
        if (message) {
            socket.emit('new message', message);
            messageInput.value = '';
        }
    };



    /* Логирование подключений/отключений */
    Chat.prototype.log = function(login, type) {
        var chatBody = document.querySelector('.chat__body');
        var messageDiv = document.createElement('div');
        var message;
        switch (type) {
            case 'add':
                message = "Пользователь <strong>" + login + "</strong> присоединился к чату.";
                break;
            case 'remove':
                message = "Пользователь <strong>" + login + "</strong> покинул чат.";
                break;
        }

        messageDiv.className = "message";
        messageDiv.innerHTML = message;

        chatBody.appendChild(messageDiv);
    };


    /* Вставить новый элемент в список пользователей онлайн*/
    Chat.prototype.addUser = function(login) {
        this.log(login, 'add');
        this.users.push({ login: login });

        var div = document.createElement('div');
        var span = document.createElement('span');
        div.className = "chat__users-user";
        div.dataset.login = login;
        span.className = "chat__users-login";
        span.appendChild(document.createTextNode(login));
        div.appendChild(span);
        this.chatUsers.appendChild(div);
    };




    /* Удалить элемент из списка пользователей */
    Chat.prototype.removeUser = function(login) {
        this.log(login, 'remove');
        var elements = document.querySelectorAll('.chat__users-user');
        for (var i = 0; i < elements.length; i++) {
            if (login == elements[i].dataset.login) {
                this.users.splice(i, 1);
                elements[i].parentNode.removeChild(elements[i]);
                break;
            }
        }
    };


    Chat.prototype.writeMessage = function(message) {
        this.messages.push(message);
        var chatBody = document.querySelector('.chat__body');
        var div = document.createElement('div'),
            fromSpan = document.createElement('span'),
            loginSpan = document.createElement('span'),
            messageSpan = document.createElement('span');

        div.className = "message";
        fromSpan.className = "message__from";
        loginSpan.className = "message__user";
        messageSpan.className = "message__text";

        fromSpan.innerText = "От: ";
        loginSpan.innerText = message.login;
        messageSpan.innerText = message.message;

        div.appendChild(fromSpan);
        div.appendChild(loginSpan);
        div.appendChild(messageSpan);

        chatBody.appendChild(div);
    };


    new Chat();
})();
