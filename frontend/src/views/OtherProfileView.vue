<template>
<div v-if="showUsers, showUser, showAchievements, showUsersList">

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
    	<h3 class="text-lg font-semibold">Player Ladder OI</h3>
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

		<!-- Friend list -->
		<div class="mt-6">
		  <h3 class="text-lg font-semibold">Friend list</h3>
		  <div class="mt-2">
            <li v-for="Friends in ladderStore.getFriends()" class="mb-2">
			  <span class="font-semibold">{{ Friends.username }}</span>
			  <!-- <span :class="{ 'text-green-600 ': friend.status === user.online, 'text-yellow-600 ': friend.status === user.playing, 'text-red-600 ': friend.status === user.offline }">
				  <div class="ml-1">{{ friend.status }}</div>
				</span> -->
            </li>
          </div>
		</div>

	</div>


</div>
</div>
</template>


<script setup>
import { ref, nextTick } from 'vue'
import { useProfileStore } from '../stores/ProfileStore'
import { useLadderStore } from '../stores/UserProfileStore'
import api from '../services/api';
import jwt_decode from 'jwt-decode';
import { storeToRefs } from 'pinia'
import Cookies from 'js-cookie';

import { useRouter } from 'vue-router';

const profileStore = useProfileStore()
const ladderStore = useLadderStore()
const showUsers = ref(false);
const showUser = ref(false);
const showAchievements = ref(false);
const showUsersList = ref(true);
const ownProfile = ref(true);

const { avatarUpdated } = storeToRefs(profileStore)
const avatarImg = ref(getAvatarImg());
const updateAvatarKey = ref(0);
const searchIdUser = ref(0);
const userNotFound = ref(false);
const userFound = ref(false);
const router = useRouter();
const searchUsername = ref('');

const setId = async () => {
	let uri = window.location.href.split('id=');
	if (uri[1] != 0)
		ownProfile.value = false;
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

function getAvatarImg() {
	let uri = window.location.href.split('id=');
	if (uri[1] == 0)
		uri[1] = 1;
	return "http://localhost:3000/users/avatar/" + uri[1];

}

async function FindUser() {

	userNotFound.value = false;
	userFound.value = false;
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
}


</script>

<style scoped>
/* Add Tailwind CSS classes if not already included */

</style>
