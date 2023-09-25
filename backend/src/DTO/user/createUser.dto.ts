import { IsNotEmpty, IsEmail, IsInt } from 'class-validator';

/**
 * DTO used for creating a new user
 */
export class CreateUserDTO
{
	@IsNotEmpty()
	username: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsInt()
	id42: number;

}