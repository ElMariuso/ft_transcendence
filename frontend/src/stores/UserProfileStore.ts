import { defineStore } from 'pinia'
import { ref } from 'vue'
// import axios from 'axios';
import jwt_decode from 'jwt-decode';

import { getLadderData } from '@/services/UserProfile-helpers'
import { getAllUserData } from '@/services/UserProfile-helpers'
import { getStatsData } from '@/services/UserProfile-helpers'
import { getAchievementsData } from '@/services/UserProfile-helpers'
import { getGamesData } from '@/services/UserProfile-helpers'
import { getFriendsData } from '@/services/UserProfile-helpers'

export const useLadderStore = defineStore('ladder', () => {

	const userID = ref(0)
	const ladder = ref(['test', 'retest']);
	const users = ref(['test', 'retest']);
	const achievements = ref(['test', 'retest']);
	const history = ref(['test', 'retest']);
	const friends = ref(['test', 'retest']);
	const nbWin = ref(0);
	const nbLoose = ref(0);

	/////////////////// ID ////////////////////////

	function setId(newId : number) {

		// console.log(newId);
		if (newId == 0)
		{
			// console.log("YOOOOOO");
			const token = localStorage.getItem('token')
			const id = jwt_decode(token).sub;
			userID.value = id;
		}
		else
		{
			userID.value = newId;
		}
	}

	/////////////////// LADDER ////////////////////////

	async function setupLadder() {
		// const token = localStorage.getItem('token')
		// const id = jwt_decode(token).sub;
		// userID.value = id;

		try {
			const userData = await getLadderData(userID.value);
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

	/////////////////// ALL USERS ////////////////////////

	async function setupAllUsers() {

		try {
			const userData = await getAllUserData();
			setUsers(userData);
		} catch (error) {
			console.error("Error setting up all users:", error);
		}
	}

	function setUsers(newList : any) {
		users.values = newList;
	}

	function getUsers() {
		return users.values;
	}
	
	/////////////////// ACHIEVEMENTS ////////////////////////

	async function setupAchievements() {
		// const token = localStorage.getItem('token')
		// const id = jwt_decode(token).sub;
		// userID.value = id;

		try {
			const userData = await getAchievementsData(userID.value);
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
		// const token = localStorage.getItem('token')
		// const id = jwt_decode(token).sub;
		// userID.value = id;

		try {
			const userData = await getStatsData(userID.value);
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
		// const token = localStorage.getItem('token')
		// const id = jwt_decode(token).sub;
		// userID.value = id;

		try {
			const userData = await getGamesData(userID.value);
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
		// const token = localStorage.getItem('token')
		// const id = jwt_decode(token).sub;
		// userID.value = id;

		try {
			const userData = await getFriendsData(userID.value);
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

	return {history, ladder, friends, nbWin, nbLoose, achievements, setId, getGamesHistory, getLadder, getFriends, getAchievements, setupGamesHistory, setupLadder, setupFriends, setupStats, setupAchievements, setupAllUsers, getUsers}
})