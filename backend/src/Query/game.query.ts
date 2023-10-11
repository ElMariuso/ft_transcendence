import { Injectable } from '@nestjs/common';
import { PrismaClient, Game } from '@prisma/client';
import { CreateGameDTO } from 'src/DTO/game/createGame.dto';

@Injectable()
export class GameQuery
{
	constructor(private readonly prisma: PrismaClient) {}

	/**
	 * Gets all the Games
	 * 
	 * @returns All Games
	 * 
	 * @query select * from game;
	 */
	async findAllGames()
	{
		return this.prisma.game.findMany();
	}

	/**
	 * Gets a Game by his id
	 * 
	 * @param idGame Game's id to find
	 * 
	 * @returns Game if the id match, null otherwise
	 * 
	 * @query select * from game where game.idGame = $idGame;
	 */
	async findGameById(idGame: number)
	{
		return this.prisma.game.findUnique(
		{
			where: { idGame },
		});
	}

	/**
	 * Gets all played games for a user
	 * 
	 * @param idUser User's id
	 * 
	 * @returns All played games for a user
	 */
	async findAllGamesByUserId(idUser: number)
	{
		const us_ga = await this.prisma.user_Game.findMany
		(
			{
				where: { idUser },
			}
		);

		const ids = us_ga.map(value => value.idGame);

		const games = await this.prisma.game.findMany
		(
			{
				where:
				{
					idGame:
					{ 
						in:ids
					}
				}
			}
		);

		return games;
	}

	/**
	 * Gets all games data from a user
	 * 
	 * @param idUser User's id
	 * 
	 * @returns Games datas
	 * 
	 * @query select * from User_Game inner join Game on User_Game.idGame = Game.idGame where User_Game.idUser = idUser;
	 */
	async findAllGamesDatasByUserId(idUser: number)
	{
		const games = await this.prisma.user_Game.findMany
		(
			{
				where: { idUser },
				include:
				{
					Game: true
				}
			}
		);

		return games;
	}

	/**
	 *  ---------------------
	 * | SUREMENT A MODIFIER |
	 *  ---------------------
	 * 
	 * Posts a new Game in DB
	 * 
	 * @param Game CreateGameDTO
	 * 
	 * @returns New Game
	 * 
	 * @query insert into game (scoreLeft, scoreRight, date) values ($scoreLeft, $scoreRight, date);
	 */
	async createGame(Game: CreateGameDTO) : Promise<Game>
	{
		// Deconstruction de l'objet CreateGameDTO
		const { scoreLeft, scoreRight } = Game;

		const date = new Date();

		const newGame = await this.prisma.game.create(
		{
			data: 
			{
				scoreLeft,
				scoreRight,
				date,
			},
		});

		return newGame;
	}

	async storeGame(idUser:number, idGame:number, win: boolean)
	{
		const storedGame = await this.prisma.user_Game.create
		(
			{
				data:
				{
					idUser,
					idGame,
					isWinner: win
				}
			}
		);
		
		return storedGame;
	}

	/**
	 * Delete a Game based on his id
	 * 
	 * @param idGame Game's id to delete
	 * 
	 * @query delete from game where game.idGame = $idGame;
	 */
	async deleteGame(idGame: number)
	{
		await this.prisma.user_Game.deleteMany
		(
			{
				where: { idGame },
			}
		);

		await this.prisma.game.delete
		(
			{
				where : { idGame }
			}
		);
	}
}
