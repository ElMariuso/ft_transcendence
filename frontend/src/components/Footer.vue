<script setup lang="ts">
	import { ref, computed, watch } from 'vue';
	import { useAuthenticationStore } from '@/stores/AuthenticationStore';
	import { useFriendStore } from '@/stores/FriendStore';
	import { useProfileStore } from '@/stores/ProfileStore';
	import { storeToRefs } from 'pinia'
	import { 
		addNewFriend,
		getFriendInvitations,
		acceptFriendInvitation,
		refuseFriendInvitation,
		deleteFriend, } from '@/services/friends-helpers'

	const authStore = useAuthenticationStore();
	const friendStore = useFriendStore();
	const { friendsList, blockedList, friendRequests } = storeToRefs(friendStore);
	
	const profileStore = useProfileStore();
	const { userID } = storeToRefs(profileStore);

	const newFriendName = ref('');
	const showFriendsTab = ref(true);
	
	// storeToRefs ?
	const isAuthenticated = computed(() => authStore.isAuthenticated);

	watch(isAuthenticated, async () => {
		if (isAuthenticated)
			await friendStore.setupFriends();
	})

	const listOpen = ref(false)

	function toggleList() {
		console.log(listOpen.value)
		listOpen.value = !listOpen.value;
	}

  
	function getFriendStatus(event) {
		const idFriend = +event.target.id;

		// if (isOnline) {
		// 	return ("../assets/status-online.svg");
		// }
		// else if (isOffline) {
		// 	return ("../assets/status-offline.svg");
		// }
		// else if (isBusy) {
		// 	return ("../assets/status-busy.svg");
		// }

		// TESTING
		return ("../assets/status-online.svg");

	}

	async function addFriendBtn() {
		const res = await addNewFriend(userID, newFriendName.value);
		
		console.log(res)

		// return res;
	}

	async function getFriendInvitationList() {
		const res = await getFriendInvitations(userID);

		console.log(res)
	}

	async function acceptFriendBtn(event) {
		const idFriend = +event.target.id;

		const res = await acceptFriendInvitation(idFriend);
		console.log(res);
	}

	async function refuseFriendBtn(event) {
		const idFriend = +event.target.id;

		const res = await refuseFriendInvitation(userID, idFriend);

		console.log(res);
	}

	async function deleteFriendBtn(event) {
		const idFriend = +event.target.id;

		const res = await deleteFriend(userID, idFriend);
	}

	function toggleFriendsTab() {
		showFriendsTab.value = !showFriendsTab.value;
	}
			
	
</script>



<template>
	<div class="h-20 flex justify-between border border-gray-400 p-4 mt-auto">

		<div class="flex items-baseline">
		
		</div>

		<div v-if="isAuthenticated" class="">
			<button 
				@click="toggleList"
				class="bg-blue-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg"
			>
				Social
			</button>
		</div>


		<!-- TODO: ADD TAB FOR BLOCKEDS LIST -->
		<!-- FRIENDS LIST -->
		<div v-if="listOpen" class="absolute bottom-20 right-0 w-1/3 h-1/2 bg-white border rounded-lg shadow-lg px-2 py-1 overflow-y-auto">
		   	
			<div class="flex flex-row">
				<button 
					@click="toggleFriendsTab()" 
					class="" 
					:class="{
						'bg-gray-400': showFriendsTab,
						'bg-blue-500': !showFriendsTab,
					}"
				>
					Friends
				</button>
				<button 
					@click="toggleFriendsTab()" 
					class=""
					:class="{
						'bg-gray-400': !showFriendsTab,
						'bg-blue-500': showFriendsTab,
					}"
				>
					Blocked
				</button>
				
			</div>

			<!-- FRIENDS LIST -->
			<div v-if="showFriendsTab">	
				
				<!-- Show friends requests at the top ? -->
				<div class="h-20 overflow-y-auto">
					<li v-for="request in friendRequests">
						<div :id="request.idUser">
							{{ request.username }}
						</div>
					</li>
				</div>

				<div class="flex flex-row items-center mb-2">
					<input
						v-model="newFriendName"
						type="text"
						placeholder="Search friend"
						class="mx-2 p-2 border rounded-lg mt-2 w-full"
					/>
					<div @click="addFriendBtn" class="cursor-pointer p-2">
						<img  
							src="../assets/search-icon.svg" 
							alt="Settings"
						/>
					</div>
				</div>
				<ul>
					<li 
						v-for="friend in friendsList"
						class="flex flex-row"
						:id="friend.idUser"
					
					>
						<div> {{ friend.username }}</div>

						<!-- status -->
						<img  
							src="getFriendStatus()" 
							alt="Status"
						/>
					</li>
				</ul>
			</div>

			<!-- BLOCKED LIST -->
			<div v-else>
				<li
					v-for="blocked in blockedList"
					:id="blocked.idUser"
				>
					{{ blocked.username }}
				</li>
			</div>
        </div>
	  
	</div>
</template>