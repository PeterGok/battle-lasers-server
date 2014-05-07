var Constants = require('./constants');
var gcm = require('node-gcm');

function Match(playerOne, playerTwo) {
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
};

Match.prototype.sendMessage = function(message, whichPlayer) {
    if (whichPlayer) {
        if (whichPlayer === 1) {
            this.playerOne.sendMessage(message);
        } else if (whichPlayer === 2) {
            this.playerTwo.sendMessage(message);
        }
    } else {
        this.playerOne.sendMessage(message);
        this.playerTwo.sendMessage(message);
    }
};

Match.prototype.getMapId = function() {
    if (!this.mapId) {
        this.mapId = (Math.random() * Number(Constants.NUMBER_OF_MAPS)) | 0;
    }
     
    return this.mapId;
};

Match.prototype.makeMove = function (startRow, startCol, endRow, endCol, turnRight, playerId) {
    var message = new gcm.Message({
        delayWhileIdle: true,
        timeToLive: 3,
        data: {
            messageType: 'move',
            turnRight: turnRight,
            startRow: 11 - startRow,
            startCol: startCol,
            endRow: 11 - endRow,
            endCol: endCol
        }
    });

    if (playerId === this.playerOne.playerId) {
        sendMessage(message, this.playerTwo.playerId);
    } else {
        sendMessage(message, this.playerOne.playerId);
    }
};

Match.prototype.userAccepted = function(playerId) {
    if (playerId === this.playerOn.playerId) {
        this.playerOne.accepted = true;
        if (!this.playerTwo.accepted) {
            return;
        }
    } else {
        this.playerTwo.accepted = true;
        if (!this.playerOne.accepted) {
            return;
        }
    }

    sendMessage(new gcm.Message({
        delayWhileIdle: true,
        timeToLive: 3,
        data: {
            messageType: 'matchStart'
        }
    }));
};

Match.prototype.end = function(quitPlayerId) {
    var message = new gcm.Message({
        delayWhileIdle: true,
        timeToLive: 3,
        data: {
            messageType: 'endMatch'
        }
    });

    if (quitPlayerId === this.playerOne.playerId) {
        sendMessage(message, this.playerTwo.playerId);
    } else {
        sendMessage(message, this.playerOne.playerId);
    }
};

Match.prototype.getOtherPlayerId = function(playerId) {
    if (playerId === this.playerOne.playerId) {
        return this.playerOne.playerId;
    }

    return this.playerTwo.playerId;
};

module.exports = Match;

