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
    canvasSize: size;
    score1: number;
    score2: number;
    racket1Size: size;
    racket2Size: size;
    racket1Position: position;
    racket2Position: position;
    ballSize: size;
    ballPosition: position;
    ballVelocity: position;
    ballSpeed: number;
    playerReady: { first: boolean, second: boolean };
    smallRacket: { first: boolean, second: boolean };
    obstacle: { first: boolean, second: boolean };
    obstacle1Size: size;
    obstacle2Size: size;
    obstacle1Position: position;
    obstacle2Position: position;
}