import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

/**
 * DTO used for updating a new user
 */
export class UpdateUserDTO
{
	@IsString()
	@IsOptional()
	username: string;

	@IsEmail()
	@IsOptional()
	email: string;

	@IsString()
	@IsOptional()
	avatar: string;
	
	@IsInt()
	@IsOptional()
	points: number;

	@IsOptional()
	isTwoFactorAuthEnabled: boolean;
	
	@IsString()
	@IsOptional()
	twoFactorAuthSecret: string;
}