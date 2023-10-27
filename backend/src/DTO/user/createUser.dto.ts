import { IsNotEmpty, IsEmail, IsInt, IsString } from 'class-validator';

/**
 * DTO used for creating a new user
 */
export class CreateUserDTO
{
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsInt()
	id42: number;

}