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
     * Creates a new game in the database. If certain properties are not provided, 
     * they will default to a preset value (e.g., scoreLeft and scoreRight default to 0, date defaults to the current date).
     * 
     * @param data? Optional data for the game. Any missing properties will use default values.
     * 
     * @returns The created game object.
     */
    async createGame(data?: Partial<CreateGameDTO>): Promise<Game>
    {
        const defaultData: CreateGameDTO = {
            scoreLeft: 0,
            scoreRight: 0,
            date: new Date(),
        };

        const gameData = {
            ...defaultData,
            ...data,
        };

        return this.prisma.game.create({
            data: gameData,
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