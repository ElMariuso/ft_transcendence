import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
    state: () => ({
        gameState: null,
        player1Username: 'Loading...',
        player2Username: 'Loading...',
        isFirstPlayer: true,
    }),
    actions: {
        updateGameState(newGameState) {
            this.gameState = newGameState;
            this.player1Username = this.gameState.player1Username;
            this.player2Username = this.gameState.player2Username;
        },
        setIsFirstPlayer(value) {
            this.isFirstPlayer = value;
        },
    },
});