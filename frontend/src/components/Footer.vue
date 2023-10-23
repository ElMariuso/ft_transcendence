<script setup lang="ts">
	import { ref } from 'vue';

	const listOpen: ref = ref(false)

	function toggleList() {
		console.log(listOpen.value)
		listOpen.value = !listOpen.value;
	}

	async function searchFriend(friend: string) {
		// idk
	}

</script>



<template>
	<div class="h-20 flex justify-between border border-gray-400 p-4 mt-auto">

		<div class="flex items-baseline">
		
		</div>

		<div class="">
			<button 
				@click="toggleList"
				class="bg-blue-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg"
			>
				Friends
			</button>
		</div>

		<!-- FRIENDS LIST -->
		<div v-if="listOpen" class="absolute bottom-20 right-0 w-1/3 h-1/2 bg-white border rounded-lg shadow-lg px-2 py-1 overflow-y-auto">

		   <div class="flex flex-row items-center mb-2">
				<input
					v-model="newChannelname"
					type="text"
					placeholder="Search friend"
					class="mx-2 p-2 border rounded-lg mt-2 w-full"
				/>


				<div @click="searchFriend" class="cursor-pointer p-2">
            		<img  
						src="../assets/search-icon.svg" 
						alt="Settings"
					/>
        		</div>
		   </div>

		   <ul>

			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-online.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-offline.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-busy.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>


			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-online.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-offline.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-busy.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-online.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-offline.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-busy.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-online.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-offline.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-busy.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-online.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-offline.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-busy.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-online.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-offline.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-busy.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-online.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-offline.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-busy.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-online.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-offline.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-busy.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-online.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-offline.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-busy.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-online.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-offline.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-busy.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-online.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-offline.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-busy.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-online.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-offline.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>
			<li class="flex flex-row">
				<div>friend</div>
				<img  
					src="../assets/status-busy.svg" 
					class="text-red-400"
					alt="Settings"
				/>
			</li>




		   </ul>
		   
        </div>
	  
	</div>
</template>