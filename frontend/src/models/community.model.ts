export interface Channel {
	idChannel: number;
	name: string;
	idOwner: number;
	idType: number;
}

export interface Msg {
	idMessage: number;
	idUser: number;
	idChannel: number;
	username: string;
	content: string;
	timestamps: Date;
}

export interface UserInChannel {
	idUser: number;
	username: string;
	email: string;
	owner: boolean;
	role: string;
}
 
export interface ChallengeState {
	isChallengePending: boolean,
	challengerId: number,
	opponentId: number
};

export interface AcceptedChallengeState {
	isReady: { [playerId: number]: boolean }
	opponentId: number
};