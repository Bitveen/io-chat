(function() {
    function Logger() {
        this.chatArea = document.querySelector('.chat__body');
    }

    Logger.prototype.writeUserJoinMessage = function(login) {
        this.chatArea.innerHTML += "<div>User <strong>" + login + "</strong> has joined the chat.</div>";
    };

    Logger.prototype.writeNewMessage = function(data) {
        this.chatArea.innerHTML += "<div>From <strong>" + data.login + "</strong> : " + data.message + "</div>";
    };

    Logger.prototype.writeUserLeaveMessage = function(login) {
        this.chatArea.innerHTML += "<div>User <strong>" + login + "</strong> has left the chat.</div>";
    };

    this.Logger = Logger;
})();