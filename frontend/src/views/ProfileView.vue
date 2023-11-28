<template>
<div v-if="showProfile">

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
				
				<span class="font-semibold">{{ match.scoreLeft }} - {{ match.scoreRight }} </span>
				<div class="ml-5 text-red-500">{{ getGameResult(match.idGame) }}</div>

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
			<button v-if="!alreadyFriend && !alreadyBlocked && !cannotSendFriendRequest && !alreadyRequested" @click="sendFriendRequest" class="mt-2 bg-blue-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">Send friend request</button>
			<button v-if="!alreadyBlocked" @click="Block(searchUsername)" class="mt-2 bg-red-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">Block</button>
			<button v-if="alreadyBlocked" @click="Block(searchUsername)" class="mt-2 bg-red-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">Unblock</button>
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
			<li v-for="Friends in friendlist" :key="Friends.idUser" class="mb-2">
				<span class="font-semibold">{{ Friends.username }}</span>
				<button @click="Unfriend(Friends.idUser)" class="ml-2 bg-red-500 hover:bg-sky-700 text-white px-3 py-1 rounded-lg">Unfriend</button>
				<span :class="{
					'text-green-600': formattedFriendStatuses[Friends.idUser] === 'Online', 
					'text-yellow-600': formattedFriendStatuses[Friends.idUser] === 'In Game', 
					'text-red-600': formattedFriendStatuses[Friends.idUser] === 'Offline'
				}">
					<div class="ml-3">{{ formattedFriendStatuses[Friends.idUser] }}</div>
				</span>
			</li>			  
		  </div>		
		</div>
		<div>{{ console.log(formattedFriendStatuses) }}</div>

		<!-- Blocked list -->
		<div class="mt-6">
		  <h3 class="text-lg font-semibold">Blocked list</h3>
		  <div class="mt-2">
			<li v-for="block in blocked" :key="block.idUser" class="mb-2">
				<span class="font-semibold">{{ block.username }}</span>
				<button @click="Block(block.username)" class="ml-2 bg-red-500 hover:bg-sky-700 text-white px-3 py-1 rounded-lg">Unblock</button>
			</li>			  
		  </div>		
		</div>

	</div>


</div>
</div>
</template>


<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useProfileStore } from '../stores/ProfileStore'
import { useLadderStore } from '../stores/UserProfileStore'
import api from '../services/api';
import jwt_decode from 'jwt-decode';
import { storeToRefs } from 'pinia'
import Cookies from 'js-cookie';
//import { deleteBlock } from '@/services/UserProfile-helpers'

const profileStore = useProfileStore();
const ladderStore = useLadderStore();

const showProfile = ref(false);

const { friendlist, blocked } = storeToRefs(ladderStore);
const { avatarUpdated } = storeToRefs(profileStore)
const avatarImg = ref(getAvatarImg());
const updateAvatarKey = ref(0);
const searchIdUser = ref(0);
const userNotFound = ref(false);
const userFound = ref(false);
const searchUsername = ref('');
const alreadyFriend = ref(false);
const alreadyBlocked = ref(false);
const alreadyRequested = ref(false);
const cannotSendFriendRequest = ref(false);

let intervalId;

function getGameResult(idGame) {
	const result = ladderStore.getResult(idGame);

	if (result)
		return "Win";
	else
		return "Lose";
}

onMounted(() => {
	ladderStore.updateFriendStatuses();
	intervalId = setInterval(ladderStore.updateFriendStatuses, 1000);
});

onUnmounted(() => {
	clearInterval(intervalId);
});

const formattedFriendStatuses = computed(() => {
    const statuses = {};
    const friendsStatusMap = ladderStore.friendsStatus || new Map();
    for (const [id, status] of friendsStatusMap.entries()) {
        statuses[id] = status;
    }
    return statuses;
});

watch(searchUsername, async () => {
	userNotFound.value = false;
	userFound.value = false;
	alreadyFriend.value = false;
	alreadyBlocked.value = false;
	cannotSendFriendRequest.value = false;
	alreadyRequested.value = false;
})

const setAll = async () => {
	let uri = window.location.href.split('id=');
	await ladderStore.setup(uri[1])
	showProfile.value = true // Set a flag to indicate that data is loaded
}
setAll()


function getAvatarImg() {
	let uri = window.location.href.split('id=');
	if (uri[1] == 0)
	{	
		const token = Cookies.get('token')
		const id = jwt_decode(token).sub;
		uri[1] = id;
	}
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
	if (userData == 1)
		cannotSendFriendRequest.value = true;
	alreadyRequested.value = true;
}

async function Block(username) {

	await ladderStore.blockUnblock(username);
	if (alreadyBlocked.value == true)
		alreadyBlocked.value = false;
	else
		alreadyBlocked.value = true;
}

async function Accept(idFriend) {

 	try {
        const response = await api.put('/users/' + ladderStore.getId() + '/acceptFriendship', {
			"idFriend": idFriend,
				})
    } catch (error) {
    	console.error('Error accepting a friend request:', error);
    	throw error;
    }
	await ladderStore.updateFriendsInvite();//updating friends invite list
	await ladderStore.updateFriends();
	//refreshPage();
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
	await ladderStore.updateFriendsInvite();//updating friends invite list
	await ladderStore.updateFriends();
	// refreshPage();
}

async function Unfriend(idFriend) {
	try {
		await ladderStore.removeFriend(idFriend)
	} catch (error) {
		console.error('Error unfriending someone', error);
	}
	await ladderStore.updateFriends();
}

</script>

<style scoped>
/* Add Tailwind CSS classes if not already included */

</style>
