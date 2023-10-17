import { Injectable, NotFoundException } from '@nestjs/common';
import { Game } from '@prisma/client';
import { GameQuery } from 'src/Query/game.query';
import { GameDTO } from 'src/DTO/game/game.dto';
import { CreateGameDTO } from 'src/DTO/game/createGame.dto';

import { ERROR_MESSAGES } from 'src/globalVariables';

@Injectable()
export class GameService
{
	constructor(private readonly GameQuery: GameQuery) {}

	/**
	 * Gets all the Games
	 * 
	 * @returns All the Games
	 */
	async findAllGames(): Promise<Game []>
	{
		return this.GameQuery.findAllGames();
	}

	/**
	 * Gets a Game by his id
	 * 
	 * @param id  Game's id to find
	 * 
	 * @returns GameDTO if the Game is find, null otherwise
	 */
	async findGameById(id: number): Promise<GameDTO | null>
	{
		const Game = await this.GameQuery.findGameById(id);

		if (!Game)
			return null;
		
		return this.transformToDTO(Game);
	}

	/**
	 * Creates a Game in DB
	 * 
	 * @param Game GameDTO to create
	 * 
	 * @returns New Game
	 */
	async createGame(Game : CreateGameDTO) : Promise<GameDTO>
	{
		const newGame = await this.GameQuery.createGame(Game);

		return this.transformToDTO(newGame);
	}

	/**
	 * Delete a Game based on their id
	 * 
	 * @param id Game's id to delete
	 * 
	 * @returns The Game deleted if the Game was deleted successfully, null otherwise
	 */
	async deleteGame(id: number)
	{
		const deletedGame = await this.GameQuery.findGameById(id);

		if (!deletedGame)
			throw new NotFoundException(ERROR_MESSAGES.GAME.NOT_FOUND);
		
		await this.GameQuery.deleteGame(id);
	}

	/**
	 * Transform a Prisma Game Object to a GameDTO
	 * 
	 * @param Game Prisma Game Object
	 * 
	 * @returns GameDTO
	 */
	private transformToDTO(Game: Game): GameDTO
	{
		const GameDTO: GameDTO =
		{
			idGame: Game.idGame,
			scoreLeft: Game.scoreLeft,
			scoreRight: Game.scoreRight,
			date: Game.date
		};

		return GameDTO;
	}
}
