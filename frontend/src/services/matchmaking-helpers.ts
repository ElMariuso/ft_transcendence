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
    });

    socket.on('left', (response) => {
        console.log(response);
    });

    socket.on('status', (response) => {
        console.log(response);
        matchmakingStore.setNumberOfPlayers(response.playersInQueue);
    });

    socket.on('joined-ranked', (response) => {
        console.log(response);
    });

    socket.on('left-ranked', (response) => {
        console.log(response);
    });

    socket.on('status-ranked', (response) => {
        console.log(response);
        matchmakingStore.setNumberOfPlayers(response.playersInQueue);
    });
};

export { joinQueue, leaveQueue, getQueueStatus, joinRankedQueue, leaveRankedQueue, getRankedQueueStatus, initializeSocketListeners };