import { IsEmail, IsInt } from 'class-validator';

/**
 * DTO used for updating a new user
 */
export class UpdateUserDTO
{
	username: string;

	@IsEmail()
	email: string;

	password: string;
	avatar: string;
	
	@IsInt()
	points: number;

	isTwoFactorAuth: boolean;
}