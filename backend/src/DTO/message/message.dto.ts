/**
 * DTO used representing a message's information
 */
 export class MessageDTO
 {
	 idMessage: number;
	 idUser: number;
	 idChannel: number;
	 username: string;
	 content: string;
	 timestamps: Date;
 }