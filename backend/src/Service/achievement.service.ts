import { Injectable, NotFoundException } from "@nestjs/common";
import { ERROR_MESSAGES } from "src/globalVariables";
import { AchievementQuery } from "src/Query/achievement.query";
import { FriendQuery } from "src/Query/friend.query";
import { GameQuery } from "src/Query/game.query";
import { MessageQuery } from "src/Query/message.query";
import { UserQuery } from "src/Query/user.query";

@Injectable()
export class AchievementService
{
	constructor(
		private readonly achievementQuery: AchievementQuery,
		private readonly gameQuery: GameQuery,
		private readonly friendQuery: FriendQuery,
		private readonly messageQuery: MessageQuery,
		private readonly userQuery: UserQuery
	) {}

	/**
	 * Gets all achievements
	 * 
	 * @returns Achievement[]
	 */
	async findAllAchievement()
	{
		return await this.achievementQuery.findAllAchievements();
	}

	/**
	 * Gets all gained achievements for a specific user
	 * 
	 * @param idUser User's id
	 * 
	 * @returns Achievement []
	 */
	async findAchievementsByUserId(idUser: number)
	{
		const checkUser = await this.userQuery.findUserById(idUser);

		if (!checkUser)
			throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);

		return await this.achievementQuery.findAchievementsByUserId(idUser);
	}

	/**
	 * Check achievements
	 * 
	 * @param idUser User's id
	 * @param contexte Contexte of Achievements (1 - Game, 2 - Friend, 3 - Message)
	 */
	async checkAchievement(idUser: number, contexte: number)
	{
		const checkUser = await this.userQuery.findUserById(idUser);

		if (!checkUser)
			throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);

		const achievements = await this.achievementQuery.findAchievementsByUserId(idUser);
		
		if (achievements.length == 4)
			return ;

		const ids =  achievements.map(value => value.idAchievement);

		if (!ids.includes(1) && contexte === 1)
		{
			const games = await this.gameQuery.findAllGamesByUserId(idUser);
			if (games.length != 0)
				this.earnAchievement(idUser, 1);
		}
		if (!ids.includes(2) && contexte === 2)
		{
			const friends = await this.friendQuery.getFriends(idUser);
			if (friends.length != 0)
				this.earnAchievement(idUser, 2);
		}
		if (!ids.includes(3) && contexte === 3)
		{
			const messages = await this.messageQuery.findAllMessagesByUserId(idUser);
			if (messages.length != 0)
				this.earnAchievement(idUser, 3);
		}
		if (!ids.includes(4))
		{
			const random = Math.floor(Math.random() * 100) + 1;
			if (random === 42)
				this.earnAchievement(idUser, 4);
		}
	}

	/**
	 * Store the new achievement
	 * 
	 * @param idUser User's id
	 * @param idAchievement Achievement's id
	 * 
	 * @returns New Link
	 */
	 private async earnAchievement(idUser: number, idAchievement: number)
	 {
		 return await this.achievementQuery.earnAchievement(idUser, idAchievement);
	 }
}