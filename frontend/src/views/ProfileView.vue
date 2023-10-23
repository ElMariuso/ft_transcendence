<template>
<div v-if="showUsers">

	<div class="col-3 bg-white p-4 rounded-lg shadow-lg"> 
	  <div class="text-center">
		<img :src="profileStore.avatar" alt="avatar error" class="w-20 h-20 mx-auto rounded-full">
		<h2 class="text-2xl font-semibold mt-4 mb-3">{{ profileStore.username }}</h2>
	  </div>
	</div>

<div class="flex gap-2 justify-around">
	
	<div class="mt-6 col-3">
    	<h3 class="text-lg font-semibold">Player Ladder</h3>
		<div class="mt-2 flex w- pr-4">
          <ul>
            <li v-for="player in ladderStore.getLadder()" class="mb-2">
              <span :class="{ 'text-red-600 font-bold': player.username === profileStore.username }">
			  	<div>{{ player.username }}</div>
			  	<div class="ml-2">{{ player.points }} pts</div>
			  </span>
            </li>
          </ul>
        </div>
    </div>

	<div class="col-3">

		<div class="mt-6">
		  <h3 class="text-lg font-semibold">Stats</h3>
		  <div class="mt-2">
			<p><span class="font-semibold">All-Time Wins:</span> {{ ladderStore.nbWin }}</p>
			<p><span class="font-semibold">All-Time Losses:</span> {{ ladderStore.nbLoose }}</p>
		  </div>
		</div>
	
		<div class="mt-6">
		  <h3 class="text-lg font-semibold">Achievements</h3>
		  <div class="mt-2">
            <li v-for="Achievements in ladderStore.getAchievements()" class="mb-2">
			  <span class="font-semibold">{{ Achievements }}</span>
            </li>
          </div>
		</div>
	

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
import { ref } from 'vue'
import { useProfileStore } from '../stores/ProfileStore'
import { useLadderStore } from '../stores/UserProfileStore'

const profileStore = useProfileStore()
const ladderStore = useLadderStore()
const showUsers = ref(false);

const setupLadder = async () => {
  await ladderStore.setupLadder()
  showUsers.value = true // Set a flag to indicate that data is loaded
}
setupLadder()

const setupFriends = async () => {
  await ladderStore.setupFriends()
//   showUsers.value = true // Set a flag to indicate that data is loaded
}
setupFriends()

const setupStats = async () => {
  await ladderStore.setupStats()
//   showUsers.value = true // Set a flag to indicate that data is loaded
}
setupStats()

const setupAchievements = async () => {
  await ladderStore.setupAchievements()
//   showUsers.value = true // Set a flag to indicate that data is loaded
}
setupAchievements()

const setupGamesHistory = async () => {
  await ladderStore.setupGamesHistory()
//   showUsers.value = true // Set a flag to indicate that data is loaded
}
setupGamesHistory()


</script>

<style scoped>
/* Add Tailwind CSS classes if not already included */

</style>
