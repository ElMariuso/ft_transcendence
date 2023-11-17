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

const quitMatch = (data) => {
    socket.emit('quit-match', data);
};

const rejoinRoom = (data) => {
    socket.emit('rejoin-room', data);
};

const rejoinMatchmaking = (data) => {
    socket.emit('rejoin-matchmaking', data);
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

const setReady = (roomId, action) => {
    socket.emit('set-ready', roomId, action);
};

const setWantBaseGame = (roomId, action) => {
    socket.emit('set-want-base-game', roomId, action);
};

const setSmallRacket = (roomId, action) => {
    socket.emit('set-small-racket', roomId, action);
};

const setObstacle = (roomId, action) => {
    socket.emit('set-obstacle', roomId, action);
};

const initializeSocketListeners = (matchmakingStore, profileStore) => {
    const router = useRouter();

    socket.on('joined', (response) => {
        matchmakingStore.setIsSearching(true);
    });

    socket.on('left', (response) => {
        matchmakingStore.setIsSearching(false);
    });

    socket.on('status', (response) => {
        matchmakingStore.setNumberOfPlayers(response.playersInQueue);
    });

    socket.on('joined-ranked', (response) => {
        matchmakingStore.setIsSearching(true);
    });

    socket.on('left-ranked', (response) => {
        matchmakingStore.setIsSearching(false);
    });

    socket.on('status-ranked', (response) => {
        matchmakingStore.setNumberOfPlayers(response.playersInQueue);
    });

    socket.on('match-found-standard', (response) => {
        console.log("Standard:", response);
        matchmakingStore.setMatchFound(true);

        let opponentUUID;
        let opponentUsername;
        if (response.player1.id == matchmakingStore.guestUUID || response.player1.id == profileStore.userID) {
            opponentUUID = response.player2.id;
            opponentUsername = response.player2.username;
        } else if (response.player2.id == matchmakingStore.guestUUID || response.player2.id == profileStore.userID) {
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
        console.log("Ranked:", response);
        matchmakingStore.setMatchFound(true);

        let opponentUUID;
        let opponentUsername;
        if (response.player1.id == profileStore.userID) {
            opponentUUID = response.player2.id;
            opponentUsername = response.player2.username;
        } else if (response.player2.id == profileStore.userID) {
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
        matchmakingStore.setRoomID(null);
    });

    socket.on('games-informations', (gameState) => {
        const gameStore = useGameStore();
        gameStore.updateGameState(gameState);
    });

    socket.on('match-ended', (response) => {
        const gameStore = useGameStore();
        gameStore.setMatchResult(response);
    
        matchmakingStore.setOpponentUUID(null);
        matchmakingStore.setOpponentUsername(null);
        matchmakingStore.setRoomID(null);
    
        setTimeout(() => {
            if (router.currentRoute.value.path.startsWith('/game')) {
                router.push({ name: 'home' });
            }
            gameStore.setMatchResult(null);
        }, 10000);
    });

    socket.on('timer-before-launch', (response) => {
        const gameStore = useGameStore();
        gameStore.updateCount(response);
    });

    socket.on('matchmaking-informations', (data) => {
        matchmakingStore.updateInformations(data);
    });
};

export { joinQueue, 
    leaveQueue, 
    getQueueStatus, 
    joinRankedQueue, 
    leaveRankedQueue, 
    getRankedQueueStatus, 
    quitMatch, 
    rejoinRoom,
    rejoinMatchmaking,
    askGamesInformations, 
    updateRacket, 
    setReady,
    setWantBaseGame,
    setSmallRacket,
    setObstacle,
    initializeSocketListeners
};