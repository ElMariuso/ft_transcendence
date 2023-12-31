/**
 * DTO used representing a user's information
 */
export class UserDTO
{
	idUser: number;
	username: string;
	email: string;
	id42: number;
	points: number;
	avatar: string;
	isTwoFactorAuthEnabled: boolean;
	twoFactorAuthSecret: string;
}