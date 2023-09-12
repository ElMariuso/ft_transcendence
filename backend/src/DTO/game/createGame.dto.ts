import { IsInt, IsNotEmpty, IsDate, Min } from 'class-validator';

/**
 * DTO used for creating a new game
 */
export class CreateGameDTO {
	@IsNotEmpty()
	@IsInt()
	@Min(-1)
	scoreLeft: number;

	@IsNotEmpty()
	@IsInt()
	@Min(-1)
	scoreRight: number;

	@IsNotEmpty()
	@IsDate()
	date: Date;
}