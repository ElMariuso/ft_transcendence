import { IsNotEmpty, IsEmail } from 'class-validator';

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

	@IsNotEmpty()
	password: string;

}