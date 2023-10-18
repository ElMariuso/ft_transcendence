import socket from "./socket-helpers";

const joinQueue = (playerData) => {
    socket.emit('join-standard', playerData);
};

const leaveQueue = (playerId) => {
    socket.emit('leave-standard', { playerId });
};

const getQueueStatus = () => {
    socket.emit('status-standard');
};

const joinRankedQueue = (playerData) => {
    socket.emit('join-ranked', playerData);
};

const leaveRankedQueue = (playerId) => {
    socket.emit('leave-ranked', playerId);
};

const getRankedQueueStatus = () => {
    socket.emit('status-ranked');
};

const initializeSocketListeners = (matchmakingStore) => {
    socket.on('joined', (response) => {
        console.log(response);
        matchmakingStore.setIsSearching(true);
    });

    socket.on('left', (response) => {
        console.log(response);
        matchmakingStore.setIsSearching(false);
    });

    socket.on('status', (response) => {
        console.log(response);
        matchmakingStore.setNumberOfPlayers(response.playersInQueue);
    });

    socket.on('joined-ranked', (response) => {
        console.log(response);
        matchmakingStore.setIsSearching(true);
    });

    socket.on('left-ranked', (response) => {
        console.log(response);
        matchmakingStore.setIsSearching(false);
    });

    socket.on('status-ranked', (response) => {
        console.log(response);
        matchmakingStore.setNumberOfPlayers(response.playersInQueue);
    });

    socket.on('match-found-standard', (response) => {
        console.log(response);
        matchmakingStore.setMatchFound(true);

        let opponentUUID;
        if (response.player1.id == matchmakingStore.guestUUID) {
            opponentUUID = response.player2.id;
        } else if (response.player2.id == matchmakingStore.guestUUID) {
            opponentUUID = response.player1.id;
        }
        if (opponentUUID) {
            matchmakingStore.setOpponentUUID(opponentUUID);
            setTimeout(() => {
                matchmakingStore.setIsSearching(false);
                matchmakingStore.setMatchFound(false);
            }, 5000);
        }
    });

    socket.on('match-found-ranked', (response) => {
        console.log(response);
        matchmakingStore.setMatchFound(true);

        let opponentUUID;
        if (response.player1.id == matchmakingStore.guestUUID) {
            opponentUUID = response.player2.id;
        } else if (response.player2.id == matchmakingStore.guestUUID) {
            opponentUUID = response.player1.id;
        }
        if (opponentUUID) {
            matchmakingStore.setOpponentUUID(opponentUUID);
            setTimeout(() => {
                matchmakingStore.setIsSearching(false);
                matchmakingStore.setMatchFound(false);
            }, 5000);
        }
    });
};

export { joinQueue, leaveQueue, getQueueStatus, joinRankedQueue, leaveRankedQueue, getRankedQueueStatus, initializeSocketListeners };