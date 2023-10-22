import { useGameStore } from "@/stores/GameStore";
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

const quitMatch = () => {
    socket.emit('quit-match');
};

const rejoinRoom = (data) => {
    socket.emit('rejoin-room', data);
};

const askGamesInformations = (roomId) => {
    return new Promise((resolve) => {
        socket.once('games-informations', (data) => {
            resolve(data);
        });

        socket.emit('ask-games-informations', roomId);
    });
};

const updateRacket = (roomId, action) => {
    socket.emit('update-racket', roomId, action);
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
        let opponentUsername;
        if (response.player1.id == matchmakingStore.guestUUID) {
            opponentUUID = response.player2.id;
            opponentUsername = response.player2.username;
        } else if (response.player2.id == matchmakingStore.guestUUID) {
            opponentUUID = response.player1.id;
            opponentUsername = response.player1.username;
        }
        if (opponentUUID) {
            matchmakingStore.setOpponentUUID(opponentUUID);
            matchmakingStore.setOpponentUsername(opponentUsername);
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
        let opponentUsername;
        if (response.player1.id == matchmakingStore.guestUUID) {
            opponentUUID = response.player2.id;
            opponentUsername = response.player2.username;
        } else if (response.player2.id == matchmakingStore.guestUUID) {
            opponentUUID = response.player1.id;
            opponentUsername = response.player1.username;
        }
        if (opponentUUID) {
            matchmakingStore.setOpponentUUID(opponentUUID);
            matchmakingStore.setOpponentUsername(opponentUsername);
            matchmakingStore.setRoomID(response.roomId);
            setTimeout(() => {
                matchmakingStore.setIsSearching(false);
                matchmakingStore.setMatchFound(false);
                matchmakingStore.setIsRanked(false);
                router.push({ name: 'game', params: { roomId: response.roomId } });
            }, 5000);
        }
    });

    socket.on('rejoin-failed', (response) => {
        console.log(response);
        matchmakingStore.setRoomID(null);
    });

    socket.on('games-informations', (gameState) => {
        const gameStore = useGameStore();
        
        gameStore.updateGameState(gameState);
    });

    socket.on('match-ended', (response) => {
        console.log(response);
        matchmakingStore.setOpponentUUID(null);
        matchmakingStore.setOpponentUsername(null);
        matchmakingStore.setRoomID(null);

        setTimeout(() => {
            router.push({ name: 'home'});
        }, 10000);
    });
};

export { joinQueue, leaveQueue, getQueueStatus, joinRankedQueue, leaveRankedQueue, getRankedQueueStatus, quitMatch, rejoinRoom, askGamesInformations, updateRacket, initializeSocketListeners };