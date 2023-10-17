import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Game } from '@prisma/client';
import { GameQuery } from 'src/Query/game.query';
import { GameDTO } from 'src/DTO/game/game.dto';
import { CreateGameDTO } from 'src/DTO/game/createGame.dto';

import { ERROR_MESSAGES } from 'src/globalVariables';
import { UserQuery } from 'src/Query/user.query';
import { AchievementService } from './achievement.service';

@Injectable()
export class GameService
{
	constructor(
		private readonly gameQuery: GameQuery,
		private readonly userQuery: UserQuery,
		private readonly achievementService: AchievementService	
	) {}

	/**
	 * Gets all the games
	 * 
	 * @returns All the games
	 */
	async findAllGames(): Promise<Game []>
	{
		return this.gameQuery.findAllGames();
	}

	/**
	 * Gets a game by his id
	 * 
	 * @param id  Game's id to find
	 * 
	 * @returns GameDTO if the Game is find, null otherwise
	 */
	async findGameById(id: number): Promise<GameDTO | null>
	{
		const game = await this.gameQuery.findGameById(id);

		if (!game)
			return null;
		
		return this.transformToDTO(game);
	}

	/**
	 * Gets all games for a specific user
	 * 
	 * @param idUser User's id
	 * 
	 * @returns All games of the user
	 */
	async getAllGamesByUserId(idUser: number) : Promise<GameDTO[]>
	{
		const checkUser = await this.userQuery.findUserById(idUser);

		if (!checkUser)
			throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);

		const games = await this.gameQuery.findAllGamesByUserId(idUser);

		const formatGames: GameDTO[] = games.map((game) =>
		{
			return this.transformToDTO(game);
		});

		return formatGames;
	}

	/**
	 * Gets Games Stats for a specific user
	 * 
	 * @param idUser User's id
	 * 
	 * @returns Number of games, the number of wins, the number of looses
	 */
	async getGameStatsByUserId(idUser: number) : Promise<{ nbGames: number, nbWin: number, nbLoose: number }>
	{
		const checkUser = await this.userQuery.findUserById(idUser);

		if (!checkUser)
			throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);

		const games = await this.gameQuery.findAllGamesDatasByUserId(idUser);
		
		if (games.length == 0)
			return { nbGames: 0, nbWin: 0, nbLoose: 0 };
		
		const nbGames = games.length;

		let nbWin = 0;

		games.forEach(game => 
		{
			if (game.isWinner)
				nbWin++;	
		});

		const nbLoose = nbGames - nbWin;

		return { nbGames: nbGames, nbWin: nbWin, nbLoose: nbLoose };
	}


	/**
	 * Creates a game in DB
	 * 
	 * @param Game GameDTO to create
	 * 
	 * @returns New game
	 */
	async createGame(game : CreateGameDTO) : Promise<GameDTO>
	{
		const checkOne = await this.userQuery.findUserById(game.idPlayerOne);
		const checkSecond =  await this.userQuery.findUserById(game.idPlayerSecond);

		if (!checkOne || !checkSecond)
			throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);

		const newGame = await this.gameQuery.createGame(game);

		if (newGame)
		{
			if (game.idPlayerOne != game.idWinner && game.idPlayerSecond != game.idWinner)
				throw new BadRequestException();
			
			let oneWin = false;

			if (game.idPlayerOne === game.idWinner)
				oneWin = true;
			
			await this.gameQuery.storeGame(game.idPlayerOne, newGame.idGame, oneWin);
			await this.gameQuery.storeGame(game.idPlayerSecond, newGame.idGame, !oneWin);

			this.achievementService.checkAchievement(game.idPlayerOne, 1);
			this.achievementService.checkAchievement(game.idPlayerSecond, 1);
		}
		else
			throw new InternalServerErrorException();
		return this.transformToDTO(newGame);
	}

	/**
	 * Delete a game based on their id
	 * 
	 * @param id Game's id to delete
	 * 
	 * @returns The Game deleted if the Game was deleted successfully, null otherwise
	 */
	async deleteGame(id: number)
	{
		const deletedGame = await this.gameQuery.findGameById(id);

		if (!deletedGame)
			throw new NotFoundException(ERROR_MESSAGES.GAME.NOT_FOUND);
		
		await this.gameQuery.deleteGame(id);
	}

	/**
	 * Transform a Prisma Game Object to a GameDTO
	 * 
	 * @param Game Prisma Game Object
	 * 
	 * @returns GameDTO
	 */
	private transformToDTO(game: Game): GameDTO
	{
		const GameDTO: GameDTO =
		{
			idGame: game.idGame,
			scoreLeft: game.scoreLeft,
			scoreRight: game.scoreRight,
			date: game.date
		};

		return GameDTO;
	}
}
