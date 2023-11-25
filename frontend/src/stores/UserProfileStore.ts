import { defineStore } from 'pinia'
import { ref } from 'vue'
// import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

import { getLadderData } from '@/services/UserProfile-helpers'
import { getUserData } from '@/services/UserProfile-helpers'
import { getAllUserData } from '@/services/UserProfile-helpers'
import { getStatsData } from '@/services/UserProfile-helpers'
import { getAchievementsData } from '@/services/UserProfile-helpers'
import { getGamesData } from '@/services/UserProfile-helpers'
import { getFriendsData } from '@/services/UserProfile-helpers'
import { getFriendsInviteData } from '@/services/UserProfile-helpers'
import { postFriendsInviteData } from '@/services/UserProfile-helpers'
import { getBlockedListData } from '@/services/UserProfile-helpers'
import { deleteFriend } from '@/services/UserProfile-helpers'
import { postBlock } from '@/services/UserProfile-helpers'
import { deleteBlock } from '@/services/UserProfile-helpers'
import { getGamesResults } from '@/services/UserProfile-helpers'

import { getPlayerStatus } from '@/services/matchmaking-helpers';


export const useLadderStore = defineStore('ladder', () => {

	const userID = ref(0)
	const ladder = ref([]);
	const users = ref([]);
	const achievements = ref([]);
	const history = ref([]);
	const friendlist = ref([]);
	const invite = ref([]);
	const blocked = ref([]);
	const nbWin = ref(0);
	const nbLoose = ref(0);
	const username = ref("username")
	const avatar = ref("../../upload/default_avatar.png")
	const friendsStatus = ref({});
	const gamesResults = ref(null);

	/////////////////// SETUP ////////////////////////

	async function setup(newId : number) {

		await setId(newId);
		await setupUser();
		await setupLadder();
		await setupAllUsers();
		await setupAchievements();
		await setupStats();
		await setupGamesHistory();
		await setupFriends();
		await setupFriendsInvite();
		await setupBlockedList();
	}

	/////////////////// ID ////////////////////////

	function setId(newId : number) {

		if (newId == 0)
		{
			const token = Cookies.get('token')
			const id = jwt_decode(token).sub;
			userID.value = id;
		}
		else
		{
			userID.value = newId;
		}
	}

	function getId() {
		return userID.value;
	}

	/////////////////// USERNAME AND AVATAR ////////////////////////

	async function setupUser() {

		try {
			const userData = await getUserData(userID.value);
			setUser(userData);
		} catch (error) {
			console.error("Error setting up Username:", error);
		}
	}

	function setUser(newList : any) {
		username.value = newList.username;
		avatar.value = newList.avatar;
	}

	/////////////////// LADDER ////////////////////////

	async function setupLadder() {

		try {
			const userData = await getLadderData(userID.value);
			setLadder(userData);
		} catch (error) {
			console.error("Error setting up Ladder:", error);
		}
	}

	function setLadder(newList : any) {
		ladder.value = newList;
	}

	function getLadder() {
		return ladder.value;
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
		users.value = newList;
	}

	function getUsers() {
		return users.value;
	}
	
	/////////////////// ACHIEVEMENTS ////////////////////////

	async function setupAchievements() {

		try {
			const userData = await getAchievementsData(userID.value);
			setAchievements(userData);
		} catch (error) {
			console.error("Error setting up achievements:", error);
		}
	}

	function setAchievements(newList : any) {
		achievements.value = newList;
	}

	function getAchievements() {
		return achievements.value;
	}

	/////////////////// STATS ////////////////////////

	async function setupStats() {

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

		try {
			const userData = await getGamesData(userID.value);
			setGamesHistory(userData);

			const results = await getGamesResults(userID.value);
			console.log("res")
			console.log(results)

			setGamesResults(results);

		} catch (error) {
			console.error("Error setting up match history:", error);
		}
	}

	function setGamesHistory(newList: any) {
		history.value = newList;
	}

	function setGamesResults(results: any) {
		gamesResults.value = results;
	}

	function getResult(idGame: any) {
		for (let i = 0; gamesResults.value[i]; i++) {
			if (gamesResults.value[i].idGame === idGame)
				return gamesResults.value[i].isWinner;
		}
	}

	function getGamesHistory() {
		return history.value;
	}
	

	/////////////////// FRIENDS ////////////////////////

	async function setupFriends() {

		try {
			const userData = await getFriendsData(userID.value);
			setFriends(userData);
		} catch (error) {
			console.error("Error setting up Friends:", error);
		}
	}

	function setFriends(newList: any) {
		friendlist.value = newList;
	}

	function getFriends() {
		return friendlist.value;
	}

	async function removeFriend(idFriend: number) {

		try {
			await deleteFriend(userID.value, idFriend);
		} catch (error) {
			console.error("Error removing a friend :", error);
		}
	}

	async function updateFriends() {

		try {
			const userData = await getFriendsData(userID.value);
			setFriends(userData);
		} catch (error) {
			console.error("Error updating up Friends:", error);
		}
	}

	/////////////////// FRIENDS INVITE ////////////////////////

	async function setupFriendsInvite() {

		try {
			const userData = await getFriendsInviteData(userID.value);
			setFriendsInvite(userData);
		} catch (error) {
			console.error("Error setting up Friends Invite:", error);
		}
	}

	function setFriendsInvite(newList: any) {
		invite.value = newList;
	}

	function getFriendsInvite() {
		return invite.value;
	}

	async function sendFriendRequest(username: string) {

		try {
			await postFriendsInviteData(userID.value, username);
		} catch (error) {
			console.error("Error posting new Friends Invite:", error);
		}
	}

	async function updateFriendsInvite() {

		try {
			const userData = await getFriendsInviteData(userID.value);
			setFriendsInvite(userData);
		} catch (error) {
			console.error("Error updating Friends Invite:", error);
		}
	}

	/////////////////// BLOCKED LIST ////////////////////////

	async function setupBlockedList() {

		try {
			const userData = await getBlockedListData(userID.value);
			setBlockedList(userData);
		} catch (error) {
			console.error("Error setting up Blocked list:", error);
		}
	}

	function setBlockedList(newList: any) {
		blocked.value = newList;
	}

	function getBlockedList() {
		return blocked.value;
	}

	async function blockUnblock(usernameToBlock: string) {

		let blocklist = getBlockedList();
		let idBlocked;
		let alreadyBlocked = false;

		for (let i = 0; blocklist[i]; i++) {
			if (usernameToBlock == blocklist[i].username)
			{	
				idBlocked = blocklist[i].idUser;
				alreadyBlocked = true;
			}
		}
	
		if (alreadyBlocked == false)
			await postBlock(getId(), usernameToBlock);
		else
			await deleteBlock(getId(), idBlocked);
		await setupBlockedList();//updating blocked list
	}

	function updateFriendStatuses() {
		friendlist.value.forEach(friend => {
			getPlayerStatus(friend.idUser);
		});
	}

	return {username, avatar, history, ladder, friendlist, nbWin, nbLoose, achievements, friendsStatus, setup, getId, setupUser, setId, getGamesHistory, getLadder, getFriends, getAchievements, setupGamesHistory, setupLadder, setupFriends, updateFriends, setupStats, setupAchievements, setupAllUsers, getUsers, setupFriendsInvite, getFriendsInvite, sendFriendRequest, updateFriendsInvite, setupBlockedList, getBlockedList, removeFriend, blockUnblock, updateFriendStatuses, getResult }
})