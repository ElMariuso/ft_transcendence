import { Injectable } from '@nestjs/common';
import { PrismaClient, Game } from '@prisma/client';
import { CreateGameDTO } from 'src/DTO/game/createGame.dto';
import { UpdateGameDTO } from 'src/DTO/game/updateGame.dto';

@Injectable()
export class GameQuery {
    constructor(private readonly prisma: PrismaClient) {}

    /**
	 * Gets all the games
	 * 
	 * @returns All Games
	 */
    async findAllGames()
    {
        return this.prisma.game.findMany();
    }

    /**
	 * Gets a game by his id
	 * 
	 * @param idGame game's id to find
	 * 
	 * @returns Game if the id match, null otherwise
	 */
    async findGameById(idGame: number)
	{
		return this.prisma.game.findUnique(
		{
			where: { idGame },
		});
	}

    /**
	 * Posts a new game in DB
	 * 
	 * @param data CreateGameDTO
	 * 
	 * @returns New Game
	 */
    async createGame(data: CreateGameDTO): Promise<Game>
    {
        return this.prisma.game.create({
            data: {
                scoreLeft: data.scoreLeft,
                scoreRight: data.scoreRight,
                date: data.date,
            },
        });
    }

    /**
	 * Delete a game based on his id
	 * 
	 * @param idGame Game's id to delete
	 */
    async deleteGame(idGame: number)
    {
        this.prisma.game.delete(
            {
                where: { idGame },
            }
        );
    }

    /**
     * Updates the details of a specific game based on its unique ID.
     * 
     * @param idGame The unique identifier of the game to be updated.
     * @param updateData An object containing the fields to be updated. Only provided fields will be updated.
     * 
     * @returns The updated game object.
     */
    async updateGame(idGame: number, updateData: Partial<UpdateGameDTO>): Promise<Game>
    {
        return this.prisma.game.update({
            where: { idGame: idGame },
            data: updateData
        });
    }
}