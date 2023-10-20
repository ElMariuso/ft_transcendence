import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
    state: () => ({
        gameState: null,
        isFirstPlayer: true,
    }),
    actions: {
        updateGameState(newGameState) {
            this.gameState = newGameState;
        },
        setIsFirstPlayer(value) {
            this.isFirstPlayer = value;
        },
    },
});