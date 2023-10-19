import { Controller, Get, InternalServerErrorException, NotFoundException, Param } from "@nestjs/common";

import { ERROR_MESSAGES } from "src/globalVariables";
import { AchievementService } from "src/Service/achievement.service";

@Controller('achievements')
export class AchievementController
{
	constructor(
		private readonly achievementService: AchievementService,
	) {}

	/**
	 * Gets all achievements
	 * 
	 * @returns Achievement []
	 */
	@Get()
	async getAllAchievements()
	{
		return await this.achievementService.findAllAchievement();
	}

	/**
	 * Gets all gained achievements for a specific user
	 * 
	 * @param idUser User's id
	 * 
	 * @returns Achievement []
	 */
	@Get(':id')
	async getAllAchievementsByUserId(@Param('id') id: string)
	{
		try
		{
			const newId = parseInt(id, 10);

			return await this.achievementService.findAchievementsByUserId(newId);
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);

			throw new InternalServerErrorException(ERROR_MESSAGES.ACHIEVEMENT.GETALLBYUSERID_FAILED);
		}
	}
}