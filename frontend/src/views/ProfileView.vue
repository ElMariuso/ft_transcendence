<!-- 
	
	Unique User name 
	Avatar 

	Match history

	(Achievments) NOT OBLIGATED

	? friendlist ?

	ladder

	Stats:
		- Wins & losses


	-->

<template>

	<div class="col-3 bg-white p-4 rounded-lg shadow-lg"> 
	  <div class="text-center">
		<img :src="user.avatar" alt="avatar error" class="w-20 h-20 mx-auto rounded-full" />
		<h2 class="text-2xl font-semibold mt-4 mb-3">{{ user.username }}</h2>
	  </div>
	</div>

<div class="flex gap-2 justify-around">
	
	<div class="mt-6 col-3">
    	<h3 class="text-lg font-semibold">Player Ladder</h3>
		<div class="mt-2 flex w- pr-4">
          <ul>
            <li v-for="player in user.ladder" :key="player.id" class="mb-2">
              <span :class="{ 'text-red-600 font-bold': player.name === user.username }">
			  	<div>{{ player.name }} </div>
			  	<div class="ml-2">{{ player.points }} pts</div>
			  </span>
            </li>
          </ul>
        </div>
    </div>

	<div class="col-3">

		<div class="mt-6">
		  <h3 class="text-lg font-semibold">Ratio</h3>
		  <div class="mt-2">
			<p><span class="font-semibold">All-Time Wins:</span> {{ user.wins }}</p>
			<p><span class="font-semibold">All-Time Losses:</span> {{ user.losses }}</p>
		  </div>
		</div>
	
		<div class="mt-6">
		  <h3 class="text-lg font-semibold">Match History</h3>
		  <ul class="mt-2">
			<li v-for="match in user.matchHistory" :key="match.id" class="mb-2">
			  <span class="font-semibold">{{ match.score }}</span> vs. {{ match.opponent }}
			</li>
		  </ul>
		</div>
	</div>

	<div class="col-3">
		<div class="mt-6">
		  <h3 class="text-lg font-semibold">Friend list</h3>
		  <div class="mt-2">
			  <li v-for="friend in user.friendlist" :key="friend.id" class="mb-2">
				<span class="font-semibold">{{ friend.name }}</span>
				<span :class="{ 'text-green-600 ': friend.status === user.online, 'text-yellow-600 ': friend.status === user.playing, 'text-red-600 ': friend.status === user.offline }">
				  <div class="ml-1">{{ friend.status }}</div>
				</span>
			  </li>
		  </div>
		</div>
	</div>

</div>

</template>


<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	 data() {
    return {
	user: {
    username: 'Mike',
	online: 'online',
	playing: 'playing',
	offline: 'offline',
    avatar: '../../Avatars/Blitzo.jpg',
	avatar2: '../../Avatars/Alastor.jpg',
    matchHistory: [
      { id: 1, score: '2-0', opponent: 'Opponent 1' },
      { id: 2, score: '1-2', opponent: 'Opponent 2' },
      { id: 3, score: '2-1', opponent: 'Opponent 3' },
    ],
    ladder: [
      { id: 1, name: 'Player 1', points: '16' },
      { id: 2, name: 'Mike', points: '14' },
      { id: 3, name: 'Player 2', points: '11' },
      { id: 4, name: 'The longuest nametag ever, super annoying to place', points: '8' },
    ],
	friendlist: [
      { id: 1, name: 'John', status: 'online'},
      { id: 2, name: 'Paul', status: 'playing'},
	  { id: 2, name: 'steve', status: 'offline'},
    ],
    wins: 20,
    losses: 10,
     },
    };
  },
});
</script>

<style scoped>
/* Add Tailwind CSS classes if not already included */

</style>
