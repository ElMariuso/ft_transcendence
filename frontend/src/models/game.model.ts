export type GameStoreState = {
    gameState: GameState | null,
    count: number,
    player1Username: string,
    player2Username: string,
    isPlayer1Ready: boolean,
    isPlayer2Ready: boolean,
    isPlayer1WantBaseGame: boolean,
    isPlayer2WantBaseGame: boolean,
    isPlayer1SmallRacket: boolean,
    isPlayer2SmallRacket: boolean,
    isPlayer1Obstacle: boolean,
    isPlayer2Obstacle: boolean,
    isFirstPlayer: boolean,
    matchResult: EndMatchResult | null,
};

export enum Player {
    Player1 = 'player1',
    Player2 = 'player2'
}

export enum Direction {
    Up = 'up',
    Down = 'down'
}

export enum EndReason {
    Forfeit = 'forfeit',
    Score = 'score'
}

export interface size {
    width: number;
    height: number;
}

export interface position {
    x: number;
    y: number;
}

export interface EndMatchResult {
    winner: Player;
    reason: EndReason;
}

export interface GameState {
    player1ID: number | string;
    player2ID: number | string;
    player1Username: string;
    player2Username: string;
    score1: number;
    score2: number;
    racket1Size: size;
    racket2Size: size;
    racket1Position: position;
    racket2Position: position;
    ballSize: size;
    ballPosition: position;
    playerReady: { first: boolean, second: boolean };
    wantBaseGame: { first: boolean, second: boolean };
    smallRacket: { first: boolean, second: boolean };
    obstacle: { first: boolean, second: boolean };
    obstacle1Size: size;
    obstacle2Size: size;
    obstacle1Position: position;
    obstacle2Position: position;
}