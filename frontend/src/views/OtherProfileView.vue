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

		<!-- Friend invitations -->
		<!-- <div class="mt-6">
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
		</div> -->

		<!-- Friend list -->
		<div class="mt-6">
			<h3 class="text-lg font-semibold">Friend list</h3>
			<div class="mt-2">
			  <li v-for="Friends in friendlist" :key="Friends.idUser" class="mb-2">
				  <span class="font-semibold">{{ Friends.username }}</span>
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

	</div>


</div>
</div>
</template>


<script setup>
import { ref, onMounted, onUnmounted, computed  } from 'vue'
import { useProfileStore } from '../stores/ProfileStore'
import { useLadderStore } from '../stores/UserProfileStore'
import api from '../services/api';
import jwt_decode from 'jwt-decode';
import { storeToRefs } from 'pinia'
import Cookies from 'js-cookie';
import { getPlayerStatus } from '@/services/matchmaking-helpers'

const profileStore = useProfileStore()
const ladderStore = useLadderStore()
const { friendlist } = storeToRefs(ladderStore);

const showProfile = ref(false);

const { avatarUpdated } = storeToRefs(profileStore)
const avatarImg = ref(getAvatarImg());
const updateAvatarKey = ref(0);
const searchIdUser = ref(0);
const userNotFound = ref(false);
const userFound = ref(false);

let intervalId;

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

function getGameResult(idGame) {
	const result = ladderStore.getResult(idGame);

	if (result)
		return "Win";
	else
		return "Lose";
}

// const refreshPage = () => {
//   location.reload(); // Reloads the current page
// };

//  	try {
//         const response = await api.put('/users/' + ladderStore.getId() + '/acceptFriendship', {
// 			"idFriend": idFriend,
// 				})
//     } catch (error) {
//     	console.error('Error accepting a friend request:', error);
//     	throw error;
//     }
// 	await ladderStore.updateFriendsInvite();//updating friends invite list
// 	await ladderStore.updateFriends();
// 	// refreshPage();
// }

// async function Decline(idFriend) {

//  	try {
//         const response = await api.put('/users/' + ladderStore.getId() + '/refuseFriendship', {
// 			"idFriend": idFriend,
// 			})
//     } catch (error) {
//     	console.error('Error refusing a friend request:', error);
//     	throw error;
//     }
// 	await ladderStore.updateFriendsInvite();//updating friends invite list
// 	await ladderStore.updateFriends();
// 	// refreshPage();
// }

</script>

<style scoped>
/* Add Tailwind CSS classes if not already included */

</style>
