import { defineStore } from 'pinia'
import { ref } from 'vue'
// import axios from 'axios';
import jwt_decode from 'jwt-decode';

import { getLadderData } from '@/services/UserProfile-helpers'
import { getStatsData } from '@/services/UserProfile-helpers'
import { getAchievementsData } from '@/services/UserProfile-helpers'
import { getGamesData } from '@/services/UserProfile-helpers'
import { getFriendsData } from '@/services/UserProfile-helpers'

export const useLadderStore = defineStore('ladder', () => {

	const userID = ref(0)
	const ladder = ref(['test', 'retest']);
	const achievements = ref(['test', 'retest']);
	const history = ref(['test', 'retest']);
	const friends = ref(['test', 'retest']);
	const nbWin = ref(0);
	const nbLoose = ref(0);

	/////////////////// LADDER ////////////////////////

	async function setupLadder() {
		const token = localStorage.getItem('token')
		const id = jwt_decode(token).sub;
		userID.value = id;

		try {
			const userData = await getLadderData(id);
			setLadder(userData);
		} catch (error) {
			console.error("Error setting up Ladder:", error);
		}
	}

	function setLadder(newList : any) {
		ladder.values = newList;
	}

	function getLadder() {
		return ladder.values;
	}
	
	/////////////////// ACHIEVEMENTS ////////////////////////

	async function setupAchievements() {
		const token = localStorage.getItem('token')
		const id = jwt_decode(token).sub;
		userID.value = id;

		try {
			const userData = await getAchievementsData(id);
			setAchievements(userData);
		} catch (error) {
			console.error("Error setting up achievements:", error);
		}
	}

	function setAchievements(newList : any) {
		achievements.values = newList;
	}

	function getAchievements() {
		return achievements.values;
	}

	/////////////////// STATS ////////////////////////

	async function setupStats() {
		const token = localStorage.getItem('token')
		const id = jwt_decode(token).sub;
		userID.value = id;

		try {
			const userData = await getStatsData(id);
			setStats(userData);
		} catch (error) {
			console.error("Error setting up Stats:", error);
		}
	}
	
	function setStats(newList: any) {
		nbWin.value = newList.nbWin;
		nbLoose.value = newList.nbLoose;
	}
	
	/////////////////// GAMES HISTORY ////////////////////////

	async function setupGamesHistory() {
		const token = localStorage.getItem('token')
		const id = jwt_decode(token).sub;
		userID.value = id;

		try {
			const userData = await getGamesData(id);
			setGamesHistory(userData);
		} catch (error) {
			console.error("Error setting up match history:", error);
		}
	}

	function setGamesHistory(newList : any) {
		history.values = newList;
	}

	function getGamesHistory() {
		return history.values;
	}
	

	/////////////////// FRIENDS ////////////////////////

	async function setupFriends() {
		const token = localStorage.getItem('token')
		const id = jwt_decode(token).sub;
		userID.value = id;

		try {
			const userData = await getFriendsData(id);
			setFriends(userData);
		} catch (error) {
			console.error("Error setting up Friends:", error);
		}
	}

	function setFriends(newList: any) {
		friends.values = newList;
	}

	function getFriends() {
		return friends.values;
	}


	// console.log(ladder.value[0])

	return {history, ladder, friends, nbWin, nbLoose, achievements, getGamesHistory, getLadder, getFriends, getAchievements, setupGamesHistory, setupLadder, setupFriends, setupStats, setupAchievements}
})