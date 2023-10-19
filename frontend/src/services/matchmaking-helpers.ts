import socket from "./socket-helpers";
import { useRouter } from 'vue-router';

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

const quitStandardMatch = () => {
    socket.emit('quit-standard');
};

const quitRankedMatch = () => {
    socket.emit('quit-ranked');
};

const initializeSocketListeners = (matchmakingStore) => {
    const router = useRouter();

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
            matchmakingStore.setRoomID(response.roomId);
            setTimeout(() => {
                matchmakingStore.setIsSearching(false);
                matchmakingStore.setMatchFound(false);
                router.push({ name: 'game', params: { roomId: response.roomId } });
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
            matchmakingStore.setRoomID(response.roomId);
            setTimeout(() => {
                matchmakingStore.setIsSearching(false);
                matchmakingStore.setMatchFound(false);
                matchmakingStore.setIsRanked(false);
                router.push({ name: 'game', params: { roomId: response.roomId } });
            }, 5000);
        }
    });

    socket.on('left-room', (response) => {
        console.log(response);
        matchmakingStore.setRoomID(null);

        router.push({ name: 'home'});
    });
};

export { joinQueue, leaveQueue, getQueueStatus, joinRankedQueue, leaveRankedQueue, getRankedQueueStatus, quitStandardMatch, quitRankedMatch, initializeSocketListeners };