(function() {
    function Logger() {
        this.chatArea = document.querySelector('.chat__body');
    }

    Logger.prototype.writeUserJoinMessage = function(login) {
        this.chatArea.innerHTML += "<div>Пользователь <strong>" + login + "</strong> присоединился к чату.</div>";
    };

    Logger.prototype.writeNewMessage = function(data) {
        this.chatArea.innerHTML += "<div>От <strong>" + data.login + "</strong> : " + data.message + "</div>";
    };

    Logger.prototype.writeUserLeaveMessage = function(login) {
        this.chatArea.innerHTML += "<div>Пользователь <strong>" + login + "</strong> покинул чат.</div>";
    };

    this.Logger = Logger;
})();