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

const quitStandardMatch = () => {
    socket.emit('quit-standard');
};

const quitRankedMatch = () => {
    socket.emit('quit-ranked');
};

const rejoinRoom = (data) => {
    socket.emit('rejoin-room', data);
};

const updateGame = (action) => {
    socket.emit('update-racket', action);
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
        const gameStore = useGameStore();
        console.log(response);
        matchmakingStore.setMatchFound(true);

        let opponentUUID;
        let opponentUsername;
        if (response.player1.id == matchmakingStore.guestUUID) {
            opponentUUID = response.player2.id;
            opponentUsername = response.player2.username;
            gameStore.setIsFirstPlayer(true);
        } else if (response.player2.id == matchmakingStore.guestUUID) {
            opponentUUID = response.player1.id;
            opponentUsername = response.player1.username;
            gameStore.setIsFirstPlayer(false);
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
        const gameStore = useGameStore();
        console.log(response);
        matchmakingStore.setMatchFound(true);

        let opponentUUID;
        let opponentUsername;
        if (response.player1.id == matchmakingStore.guestUUID) {
            opponentUUID = response.player2.id;
            opponentUsername = response.player2.username;
            gameStore.setIsFirstPlayer(true);
        } else if (response.player2.id == matchmakingStore.guestUUID) {
            opponentUUID = response.player1.id;
            opponentUsername = response.player1.username;
            gameStore.setIsFirstPlayer(false);
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

    socket.on('left-room', (response) => {
        console.log(response);
        matchmakingStore.setOpponentUUID(null);
        matchmakingStore.setOpponentUsername(null);
        matchmakingStore.setRoomID(null);

        router.push({ name: 'home'});
    });

    socket.on('rejoin-failed', (response) => {
        console.log(response);
        matchmakingStore.setRoomID(null);
    });

    socket.on('racket-update', (response) => {
        const gameStore = useGameStore();

        console.log(response);
        switch (response) {
            case 'racket1-up':
                gameStore.racket1Up(false);
                break;
            case 'racket1-down':
                gameStore.racket1Down(false);
                break;
            case 'racket2-up':
                gameStore.racket2Up(false);
                break;
            case 'racket2-down':
                gameStore.racket2Down(false);
                break;
            default:
                console.error('Unknown action:', response);
        }
    });
};

export { joinQueue, leaveQueue, getQueueStatus, joinRankedQueue, leaveRankedQueue, getRankedQueueStatus, quitStandardMatch, quitRankedMatch, rejoinRoom, updateGame, initializeSocketListeners };