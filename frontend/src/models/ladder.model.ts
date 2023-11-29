export interface GameRes {
	idGame: number;
	isWinner: number;
	username: string;
	idUser: number;
}

export interface Blocked {
	username: string;
	idUser: number;
}

export interface Friend {
	idUser: number;
}