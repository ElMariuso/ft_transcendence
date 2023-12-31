import { GameStoreState, GameState, EndMatchResult } from '@/models/game.model';
import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
    state: (): GameStoreState => ({
        gameState: null,
        count: 0,
        player1Username: 'Loading...',
        player2Username: 'Loading...',
        isPlayer1Ready: false,
        isPlayer2Ready: false,
        isPlayer1WantBaseGame: false,
        isPlayer2WantBaseGame: false,
        isPlayer1SmallRacket: false,
        isPlayer2SmallRacket: false,
        isPlayer1Obstacle: false,
        isPlayer2Obstacle: false,
        isFirstPlayer: true,
        matchResult: null,
    }),
    actions: {
        updateGameState(newGameState: GameState): void {
            this.gameState = newGameState;
            this.player1Username = this.gameState.player1Username;
            this.player2Username = this.gameState.player2Username;

            this.isPlayer1Ready = this.gameState.playerReady.first;
            this.isPlayer2Ready = this.gameState.playerReady.second;
            this.isPlayer1WantBaseGame = this.gameState.wantBaseGame.first;
            this.isPlayer2WantBaseGame = this.gameState.wantBaseGame.second;
            this.isPlayer1SmallRacket = this.gameState.smallRacket.first;
            this.isPlayer2SmallRacket = this.gameState.smallRacket.second;
            this.isPlayer1Obstacle = this.gameState.obstacle.first;
            this.isPlayer2Obstacle = this.gameState.obstacle.second;
        },
        updateCount(count: number): void {
            this.count = count;
        },
        setIsFirstPlayer(value: boolean): void {
            this.isFirstPlayer = value;
        },
        setMatchResult(result: EndMatchResult | null): void {
            this.matchResult = result;
        },
    },
});
