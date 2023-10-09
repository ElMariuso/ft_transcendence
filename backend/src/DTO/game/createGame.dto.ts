import { IsNumber, IsPositive } from 'class-validator';

/**
 * DTO used for creating a new game
 */
export class CreateGameDTO
{
	@IsNumber()
	@IsPositive()
	scoreLeft: number;

	@IsNumber()
	@IsPositive()
	scoreRight: number;
}