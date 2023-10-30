import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

/**
 * DTO used for creating a new game
 */
export class CreateChannelDTO
{
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsString()
	@IsOptional()
	password: string;

	@IsNumber()
	@IsPositive()
	idOwner: number;

	@IsNumber()
	@IsPositive()
	idType: number;
}