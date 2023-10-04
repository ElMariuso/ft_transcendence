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
