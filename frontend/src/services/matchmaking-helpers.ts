import { useGameStore } from "@/stores/GameStore";
import socket from "./socket-helpers";
import { useRouter } from 'vue-router';
import { useProfileStore } from "@/stores/ProfileStore";
import { useLadderStore } from "@/stores/UserProfileStore";
import { useCommunityStore } from "@/stores/CommunityStore";
import { useMatchmakingStore } from "@/stores/MatchmakingStore";
import { AuthenticatedPlayer, PlayerInQueue } from "@/models/player.model";
import { GameState } from "@/models/game.model";

const joinQueue = (playerData: PlayerInQueue): void => {
    socket.emit('join-standard', playerData);
};

const leaveQueue = (playerId: string | number): void => {
    socket.emit('leave-standard', { playerId });
};

const getQueueStatus = (): void => {
    socket.emit('status-standard');
};

const joinRankedQueue = (playerData: AuthenticatedPlayer): void => {
    socket.emit('join-ranked', playerData);
};

const leaveRankedQueue = (playerId: string): void => {
    socket.emit('leave-ranked', playerId);
};

const getRankedQueueStatus = (): void => {
    socket.emit('status-ranked');
};

const quitMatch = (playerId: number | string): void => {
    socket.emit('quit-match', playerId);
};

const rejoinRoom = (data: { playerId: string | number, roomId: string, username: string }): void => {
    socket.emit('rejoin-room', data);
};

const rejoinMatchmaking = (playerId: string | number): void => {
    socket.emit('rejoin-matchmaking', playerId);
};

const askGamesInformations = (roomId: string | null) : Promise<GameState> => {
    return new Promise((resolve) => {
        socket.once('games-informations', (data) => {
            resolve(data);
        });

        socket.emit('ask-games-informations', roomId);
    });
};

const updateRacket = (roomId: string | null, action: string): void => {
    socket.emit('update-racket', roomId, action);
};

const setReady = (roomId: string | null, action: string): void => {
    socket.emit('set-ready', roomId, action);
};

const setWantBaseGame = (roomId: string | null, action: string): void => {
    socket.emit('set-want-base-game', roomId, action);
};

const setSmallRacket = (roomId: string | null, action: string): void => {
    socket.emit('set-small-racket', roomId, action);
};

const setObstacle = (roomId: string | null, action: string): void => {
    socket.emit('set-obstacle', roomId, action);
};

const updatePlayerStatus = (status: number): void => {
    const profileStore = useProfileStore();
    const playerId = profileStore.userID;

	let id = parseInt(playerId, 10);

    if (id > 0) {
        socket.emit('update-status', { playerId, status });
    }
};

const getPlayerStatus = (playerId: number): void => {
    socket.emit('get-status', playerId);
};

const askChallenge = (playerId: number, opponentId: number): void => {
    socket.emit('challenge', playerId, opponentId);
};

const askChallengeState = (askerId: number, friendId: number): void => {
    socket.emit('challenge-state', askerId, friendId);
};

const challengeAnswer = (challengerId: number, opponentId: number, answer: number): void => {
    socket.emit('challenge-answer', challengerId, opponentId, answer);
};

const askAcceptedChallengeState = (playerId: number): void => {
    socket.emit('accepted-challenge-state', playerId);
};

const confirmChallenge = (playerId: number, playerUsername: string): void => {
    socket.emit('confirm-challenge', playerId, playerUsername);
};

const initializeSocketListeners = (): void => {
    const router = useRouter();
    const matchmakingStore = useMatchmakingStore();
    const profileStore = useProfileStore();

    socket.on('joined', () => {
        matchmakingStore.setIsSearching(true);
    });

    socket.on('left', () => {
        matchmakingStore.setIsSearching(false);
    });

    socket.on('status', (response) => {
        matchmakingStore.setNumberOfPlayers(response.playersInQueue);
    });

    socket.on('joined-ranked', () => {
        matchmakingStore.setIsSearching(true);
    });

    socket.on('left-ranked', () => {
        matchmakingStore.setIsSearching(false);
    });

    socket.on('status-ranked', (response) => {
        matchmakingStore.setNumberOfPlayers(response.playersInQueue);
    });

    socket.on('match-found-standard', (response) => {
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
            matchmakingStore.setIsSearching(false);
            matchmakingStore.setMatchFound(false);
            router.push({ name: 'game', params: { roomId: response.roomId } });
        }
        updatePlayerStatus(2);
    });

    socket.on('match-found-ranked', (response) => {
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
            matchmakingStore.setIsSearching(false);
            matchmakingStore.setMatchFound(false);
            matchmakingStore.setIsRanked(false);
            router.push({ name: 'game', params: { roomId: response.roomId } });
        }
        updatePlayerStatus(2);
    });

    socket.on('rejoin-failed', () => {
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
        updatePlayerStatus(0);
    });

    socket.on('status-response', (data: any) => {
        const LadderStore = useLadderStore();
    
        let statusText = "Offline";
        switch (data.status) {
            case 0:
                statusText = "Online";
                break;
            case 1:
                statusText = "Offline";
                break;
            case 2:
                statusText = "In Game";
                break;
        }
        LadderStore.friendsStatus.set(data.playerId, statusText);
    });    

    socket.on('timer-before-launch', (response) => {
        const gameStore = useGameStore();
        gameStore.updateCount(response);
    });

    socket.on('matchmaking-informations', (data) => {
        matchmakingStore.updateInformations(data);
    });

    socket.on('challenge-state-response', (data) => {
        const communityStore = useCommunityStore()
        
        communityStore.updateChallengeState(data.challengerId, data);
        communityStore.updateChallengeStateForOpponent(data.opponentId, data);
    });

    socket.on('accepted-challenge-state-response', (data) => {
        const communityStore = useCommunityStore();

        communityStore.updateAcceptedChallengeState(data);
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
    updatePlayerStatus,
    getPlayerStatus,
    askChallenge,
    askChallengeState,
    challengeAnswer,
    askAcceptedChallengeState,
    confirmChallenge,
    initializeSocketListeners
};