import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post } from '@nestjs/common';
import { GameService } from 'src/Service/game.service';
import { GameDTO } from 'src/DTO/game/game.dto';
import { CreateGameDTO } from 'src/DTO/game/createGame.dto';
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
		let newId = parseInt(id, 10);

		return this.gameService.findGameById(newId);
	}

	/**
	 * Create a new Game in database
	 * 
	 * @param createGameDTO DTO containing data to create the new Game
	 * 
	 * @returns GameDTO
	 * 
	 * @throws HTTPException INTERNAL_SERVER_EXCEPTION if the creation of the Game failed
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
			throw new InternalServerErrorException('Game creation failed');
		}
	}

	/**
	 * Delete a Game by his id
	 * 
	 * @param id Game's id to delete
	 * 
	 * @returns Message in a string
	 * 
	 * @throws HTTPException with status NOT_FOUND if the Game is not found
	 */
	@Delete('/delete/:id')
	async deleteGameById(@Param('id') id: string) : Promise<String>
	{
		let newId = parseInt(id, 10);

		const deletedGame = this.gameService.deleteGame(newId);

		if (!deletedGame)
			throw new NotFoundException("Game not found");
		
		return "Game deleted successfully";
	}

}

