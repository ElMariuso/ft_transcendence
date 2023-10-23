import { IsInt, IsPositive, IsString } from 'class-validator';

/**
 * DTO used for creating a new userchannel
 */
export class CreateUserChannelDTO
{
	@IsInt()
	@IsPositive()
	idUser: number;

	@IsInt()
	@IsPositive()
	idChannel: number;

	@IsString()
	password: string;
}