<template>
<div v-if="showUsers, showUser, showAchievements, showUsersList, showFriendRequest, showFriendList, showBlockedList">

	<!-- Profile Header -->
	<div class="col-3 bg-white p-4 rounded-lg shadow-lg">
	  <div class="text-center">
		<div class="mr-4 text-lg" :key="updateAvatarKey">
			<img :src="avatarImg" alt="avatar" class="w-20 h-20 mx-auto rounded-full">
		</div>
		<h2 class="text-2xl font-semibold mt-4 mb-3">{{ ladderStore.username }}</h2>
	  </div>
	</div>

<div class="flex gap-2 justify-around">
	
	<div class="mt-6 col-3">

		<!-- Player Ladder -->
    	<h3 class="text-lg font-semibold">Player Ladder</h3>
		<div class="mt-2 flex w- pr-4">
          <ul>
            <li v-for="player in ladderStore.getLadder()" class="mb-2">
              <span :class="{ 'text-red-600 font-bold': player.username === ladderStore.username }">
			  	<div>{{ player.username }}</div>
			  	<div class="ml-2">{{ player.points }} pts</div>
			  </span>
            </li>
          </ul>
        </div>
    </div>

	<div class="col-3">

		<!-- Stats -->
		<div class="mt-6">
		  <h3 class="text-lg font-semibold">Stats</h3>
		  <div class="mt-2">
			<p><span class="font-semibold">All-Time Wins:</span> {{ ladderStore.nbWin }}</p>
			<p><span class="font-semibold">All-Time Losses:</span> {{ ladderStore.nbLoose }}</p>
		  </div>
		</div>
	
		<!-- Achievements -->
		<div class="mt-6">
		  <h3 class="text-lg font-semibold">Achievements</h3>
		  <div class="mt-2">
            <li v-for="Achievements in ladderStore.getAchievements()" class="mb-2">
			  <span class="font-semibold">{{ Achievements.name }} : </span>
			  <div class="ml-2">{{ Achievements.content }}</div>
            </li>
          </div>
		</div>
	
		<!-- Match History -->
		<div class="mt-6">
		  <h3 class="text-lg font-semibold">Match History</h3>
		  <div class="mt-2">
            <li v-for="match in ladderStore.getGamesHistory()" class="mb-2">
			  <span class="font-semibold">{{ match }}</span>
            </li>
          </div>
		</div>
	</div>

	<div class="col-3">

		<!-- Search Users -->
		<div class="mt-6">
    	  <h3 class="text-lg font-semibold">Search User</h3>
    	  <ul class="mt-2">
			<input
		      v-model="searchUsername"
    	      type="text"
    	      placeholder="Enter username"
    	      class="p-2 border rounded-lg mt-2"
    		/>
			<button @click="FindUser" class="mt-2 bg-blue-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">Find</button>
    	  </ul>
		  <div v-if="userNotFound">
			<h3 class="text-lg text-red-600 font-semibold">User not found</h3>
		  </div>
		  <div v-if="userFound">
			<router-link :to="'/otherprofile/id=' + searchIdUser">
			  <button class="mt-2 bg-green-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">View profile</button>
			</router-link>
			<button v-if="!alreadyFriend && !alreadyBlocked && !cannotSendFriendRequest" @click="sendFriendRequest" class="mt-2 bg-blue-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">Send friend request</button>
			<button v-if="!alreadyFriend && !alreadyBlocked" @click="Block" class="mt-2 bg-red-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">Block</button>
			<button v-if="!alreadyFriend && alreadyBlocked" @click="Block" class="mt-2 bg-red-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">Unblock</button>
			<div v-if="cannotSendFriendRequest" class="text-lg text-red-600 font-semibold"> You cannot send another friend request to this user </div>
		  </div>
    	</div>

		<!-- Friend invitations -->
		<div class="mt-6">
		  <h3 class="text-lg font-semibold">Friend invitations</h3>
		  <div class="mt-2">
            <li v-for="Invite in ladderStore.getFriendsInvite()" class="mb-2">
			  <span class="font-semibold">
				{{ Invite.username }}
				<button @click="Accept(Invite.idUser)" class="mt-2 bg-green-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">Accept</button>
				<button @click="Decline(Invite.idUser)" class="mt-2 bg-red-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">Decline</button>
			  </span>
            </li>
          </div>
		</div>

		<!-- Friend list -->
		<div class="mt-6">
		  <h3 class="text-lg font-semibold">Friend list</h3>
		  <div class="mt-2">
            <li v-for="Friends in ladderStore.getFriends()" class="mb-2">
			  <span class="font-semibold">{{ Friends.username }}</span>
			  <button @click="Unfriend(Friends.idUser)" class="ml-2 bg-red-500 hover:bg-sky-700 text-white px-3 py-1 rounded-lg">Unfriend</button>
			  <span :class="{ 'text-green-600 ': getStatus(Friends.idUser) === isOnline(), 'text-yellow-600 ': getStatus(Friends.idUser) === isPlaying(), 'text-red-600 ': getStatus(Friends.idUser) === isOffline()}">
				<div class="ml-3">{{  getStatus(Friends.idUser) }}</div>
			  </span>
            </li>
          </div>
		</div>

	</div>


</div>
</div>
</template>


<script setup>
import { ref, watch } from 'vue'
import { useProfileStore } from '../stores/ProfileStore'
import { useLadderStore } from '../stores/UserProfileStore'
import api from '../services/api';
import jwt_decode from 'jwt-decode';
import { storeToRefs } from 'pinia'
import Cookies from 'js-cookie';
import { deleteBlock } from '@/services/UserProfile-helpers'
import { getPlayerStatus } from '@/services/matchmaking-helpers'

const profileStore = useProfileStore()
const ladderStore = useLadderStore()

const showUsers = ref(false);
const showUser = ref(false);
const showAchievements = ref(false);
const showFriendRequest = ref(false);
const showFriendList = ref(false);
const showUsersList = ref(true);
const showBlockedList = ref(true);

const { avatarUpdated } = storeToRefs(profileStore)
const avatarImg = ref(getAvatarImg());
const updateAvatarKey = ref(0);
const searchIdUser = ref(0);
const userNotFound = ref(false);
const userFound = ref(false);
const searchUsername = ref('');
const alreadyFriend = ref(false);
const alreadyBlocked = ref(false);
const cannotSendFriendRequest = ref(false);

watch(searchUsername, async () => {
	userNotFound.value = false;
	userFound.value = false;
	alreadyFriend.value = false;
	alreadyBlocked.value = false;
	cannotSendFriendRequest.value = false;
})

const setId = async () => {
	let uri = window.location.href.split('id=');
	await ladderStore.setId(uri[1])
}
setId()

const setupLadder = async () => {
  await ladderStore.setupLadder()
  showUsers.value = true // Set a flag to indicate that data is loaded
}
setupLadder()

const setupUser = async () => {
  await ladderStore.setupUser()
  showUser.value = true // Set a flag to indicate that data is loaded
}
setupUser()

const setupAllUsers = async () => {
  await ladderStore.setupAllUsers()
  showUsersList.value = true // Set a flag to indicate that data is loaded
}
setupAllUsers()

const setupFriends = async () => {
  await ladderStore.setupFriends()
  showFriendList.value = true // Set a flag to indicate that data is loaded
}
setupFriends()

const setupStats = async () => {
  await ladderStore.setupStats()
}
setupStats()

const setupAchievements = async () => {
  await ladderStore.setupAchievements()
  showAchievements.value = true // Set a flag to indicate that data is loaded
}
setupAchievements()

const setupGamesHistory = async () => {
  await ladderStore.setupGamesHistory()
}
setupGamesHistory()

const setupFriendsInvite = async () => {
  await ladderStore.setupFriendsInvite()
  showFriendRequest.value = true // Set a flag to indicate that data is loaded
}
setupFriendsInvite()

const setupBlockedList = async () => {
  await ladderStore.setupBlockedList()
  showBlockedList.value = true // Set a flag to indicate that data is loaded
}
setupBlockedList()

function getAvatarImg() {
	let uri = window.location.href.split('id=');
	if (uri[1] == 0)
		uri[1] = 1;
	return "http://localhost:3000/users/avatar/" + uri[1];
}

async function FindUser() {

	userNotFound.value = false;
	userFound.value = false;
	alreadyFriend.value = false;
	let friendlist = ladderStore.getFriends();
	let blocklist = ladderStore.getBlockedList();

	await api.get('/users')
	.then(res => {
		for (let i = 0; res.data[i]; i++) {
			if (searchUsername.value == res.data[i].username)
			{
				searchIdUser.value = res.data[i].idUser;
				userFound.value = true;
			}
		}
		if (userFound.value != true)
			userNotFound.value = true;
	});
	//youself
	if (searchUsername.value == ladderStore.username)
		alreadyFriend.value = true;
	//friendlist
	for (let i = 0; friendlist[i]; i++) {
		if (searchUsername.value == friendlist[i].username)
			alreadyFriend.value = true;
	}
	//blocklist
	for (let i = 0; blocklist[i]; i++) {
		if (searchUsername.value == blocklist[i].username)
			alreadyBlocked.value = true;
	}
}

async function sendFriendRequest() {
	
	const userData = await ladderStore.sendFriendRequest(searchUsername.value);
	if (userData == "error caught")
		cannotSendFriendRequest.value = true;
}

async function Block() {

	let blocklist = ladderStore.getBlockedList();
	let idBlocked;

	for (let i = 0; blocklist[i]; i++) {
		if (searchUsername.value == blocklist[i].username)
			idBlocked = blocklist[i].idUser;
	}
	
	if (alreadyBlocked.value == false)
	{
		try {
    	    const response = await api.post('/users/' + ladderStore.getId() + '/blockUser', {
				"username": searchUsername.value,
					})
    	} catch (error) {
        	console.error('Error blocking a user:', error);
        	throw error;
    	}
		refreshPage();
	}
	else
	{
		await deleteBlock(ladderStore.getId(), idBlocked);
		refreshPage();
	}
}

const refreshPage = () => {
  location.reload(); // Reloads the current page
};

async function Accept(idFriend) {

 	try {
        const response = await api.put('/users/' + ladderStore.getId() + '/acceptFriendship', {
			"idFriend": idFriend,
				})
    } catch (error) {
    	console.error('Error accepting a friend request:', error);
    	throw error;
    }
	refreshPage();
}

async function Decline(idFriend) {

 	try {
        const response = await api.put('/users/' + ladderStore.getId() + '/refuseFriendship', {
			"idFriend": idFriend,
			})
    } catch (error) {
    	console.error('Error refusing a friend request:', error);
    	throw error;
    }
	refreshPage();
}

async function Unfriend(idFriend) {

	ladderStore.removeFriend(idFriend)
	refreshPage();
}

function isOnline() {
	return ("Online")
}

function isOffline() {
	return ("Offline")
}

function isPlaying() {
	return ("Playing")
}

function getStatus(idUser) {
	let res = getPlayerStatus(idUser);
	if (res.ids == 2)
		return("Playing")
	if (res.ids == 0)
		return ("Online")
	return ("Offline")
}

</script>

<style scoped>
/* Add Tailwind CSS classes if not already included */

</style>
