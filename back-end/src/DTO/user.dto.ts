/**
 * DTO used representing a user's information
 */
export class UserDTO
{
	idUser: number;
	username: string;
	email: string;
	password: string;
	points: number;
	isTwoFactorAuth: boolean;
}