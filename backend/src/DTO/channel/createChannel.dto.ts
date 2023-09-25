import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

/**
 * DTO used for creating a new game
 */
export class CreateChannelDTO
{
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	password: string;

	@IsNumber()
	@IsPositive()
	idOwner: number;

	@IsNumber()
	@IsPositive()
	idType: number;
}