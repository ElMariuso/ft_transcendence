import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post } from '@nestjs/common';
import { GameService } from 'src/Service/game.service';
import { GameDTO } from 'src/DTO/game/game.dto';
import { CreateGameDTO } from 'src/DTO/game/createGame.dto';

import { ERROR_MESSAGES, MESSAGES } from 'src/globalVariables';
// import { UpdateGameDTO } from 'src/DTO/game/updateGame.dto';

@Controller('games')
export class GameController
{
	constructor(private readonly gameService: GameService) {}

	/**
	 * Get all Games
	 * 
	 * @returns all Games
	 */
	@Get()
	async getAllGames()
	{
		return this.gameService.findAllGames();
	}

	/**
	 * Gets a Game by his id
	 * 
	 * @param id Game's id to find
	 * 
	 * @returns GameDTO or null
	 */
	@Get(':id')
	async findGameById(@Param('id') id: string) : Promise<GameDTO | null>
	{
		try
		{
			let newId = parseInt(id, 10);

			return this.gameService.findGameById(newId);
		}
		catch (error)
		{
			throw new InternalServerErrorException(ERROR_MESSAGES.GAME.GETGAME_FAILED);
		}
	}

	/**
	 * Gets all games for a specific user
	 * 
	 * @param id User's id
	 * 
	 * @returns GameDTO []
	 * 
	 * @throw HTTPException with status NOT_FOUND if the user is not found
	 * @throw HTTPException with status INTERNAL_SERVER_EXCEPTION if getting the list failed
	 */
	@Get('allGamesUser/:id')
	async getAllGamesByUserId(@Param('id') id: string) : Promise<GameDTO[]>
	{
		try
		{
			let newId = parseInt(id, 10);

			return this.gameService.getAllGamesByUserId(newId);
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);

			throw new InternalServerErrorException(ERROR_MESSAGES.GAME.GETALLGAMEUSER_FAILED);
		}
	}

	/**
	 * Gets Games Stats for a specific user
	 * 
	 * @param id User's id
	 * 
	 * @returns Number of games, the number of wins, the number of looses
	 * 
	 * @throw HTTPException with status NOT_FOUND if the user is not found
	 * @throw HTTPException with status INTERNAL_SERVER_EXCEPTION if getting the stats failed
	 */
	@Get('stats/:id')
	async getGameStatsByUserId(@Param('id') id: string) : Promise<{ nbGames: number, nbWin: number, nbLoose: number }>
	{
		try
		{
			let newId = parseInt(id, 10);

			return this.gameService.getGameStatsByUserId(newId);
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);

			throw new InternalServerErrorException(ERROR_MESSAGES.GAME.GETGAMESTATS_FAILED);
		}
	}

	/**
	 * Create a new Game in database
	 * 
	 * @param createGameDTO DTO containing data to create the new Game
	 * 
	 * @returns GameDTO
	 * 
	 * @throw HTTPException with status INTERNAL_SERVER_EXCEPTION if the creation of the game failed
	 */
	@Post()
	async createGame(@Body() createGameDTO : CreateGameDTO): Promise<GameDTO>
	{
		try
		{
			return this.gameService.createGame(createGameDTO);
		}
		catch(error)
		{
			throw new InternalServerErrorException(ERROR_MESSAGES.GAME.CREATEGAME_FAILED);
		}
	}

	/**
	 * Delete a Game by his id
	 * 
	 * @param id Game's id to delete
	 * 
	 * @returns Message in a string
	 * 
	 * @throw HTTPException with status NOT_FOUND if the Game is not found
	 * @throw HTTPException with status INTERNAL_SERVER_EXCEPTION if the deletion failed
	 */
	@Delete('/delete/:id')
	async deleteGameById(@Param('id') id: string) : Promise<String>
	{
		try
		{
			let newId = parseInt(id, 10);

			this.gameService.deleteGame(newId);
			
			return MESSAGES.GAME.DELETE_SUCCESS;
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);

			throw new InternalServerErrorException(ERROR_MESSAGES.GAME.DELETEGAME_FAILED);
		}
	}

}

