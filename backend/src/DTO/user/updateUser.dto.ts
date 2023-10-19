import { IsEmail, IsInt } from 'class-validator';
import { getRandomValues } from 'crypto';

/**
 * DTO used for updating a new user
 */
export class UpdateUserDTO
{
	username: string;

	@IsEmail()
	email: string;

	avatar: string;
	
	@IsInt()
	points: number;

	isTwoFactorAuthEnabled: boolean;

	twoFactorAuthSecret: string;
}