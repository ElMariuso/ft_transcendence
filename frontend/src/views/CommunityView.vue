<!-- 
	TO DO

	- Create private channel: encrypt pw
	- Join private channel (pw)
	- Websocket msg
	- Online / offline players
	- players buttons functionnality:
		* PLAY
		* PROFILE
		* DM
		* add friend
		* BLOCK

		IF ADMIN
		* KICK/BAN/MUTE

 -->



<template>
	<div class="flex">

		<!-- Find Users -->
		<!-- <div class="mb-4">
		<h3 class="text-lg font-semibold">Find users</h3>
		<select class="p-2 w-1/3 border rounded-lg">
			<option v-for="usernames in communityStore.getUsernames()">{{ usernames }}</option>
		</select>
		<button @click="findUser" class="mt-2 bg-blue-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">Find</button>
		</div> -->

		<!-- Send Private Message -->
		<!-- <div class="mb-4">
		<h3 class="text-lg font-semibold">Send Private Message To</h3>
		<select class="p-2 w-1/3 border rounded-lg">
			<option v-for="usernames in communityStore.getUsernames()">{{ usernames }}</option>
		</select>
		<button @click="sendPrivateMessage" class="mt-2 bg-blue-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">Send</button>
		</div> -->



		<!-- Create Channel -->
		<div  class="mb-4 flex flex-col w-1/4">

			<div class="border-2 border-blue-500 px-4 py-2 rounded-lg">
				<h3 class="text-lg font-semibold border-b border-gray-400">Create Channel</h3>

				<input
					v-model="newChannelname"
					type="text"
					placeholder="Enter channel name"
					class="p-2 border rounded-lg mt-2 w-full"
				/>

				<select v-model="newChannelType" class="p-2 border rounded-lg mt-2 text-sm">
					<option value="public" class="">Public</option>
					<option value="private">Private</option>
				</select>

				<input
					v-model="newChannelPassword"
					type="password"
					placeholder="Enter password"
					:disabled="newChannelType==='public'"
					class="p-2 border rounded-lg mt-2 w-full"
				/>

				<div class="flex items-baseline">

					<button 
						@click="createChannel"
						class="mt-4 bg-blue-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg mr-5"
					>
						Create
					</button>
					
					<div v-if="noChannelName"> <h3 class="text-lg text-red-600 font-semibold">Name required</h3> </div>
					<div v-if="noChannelPassword"> <h3 class="text-lg text-red-600 font-semibold">Password required</h3> </div>

				</div>
			</div>

		<!-- Joined Channels -->
			<div class="mt-5 border-2 border-blue-500 px-4 py-2 rounded-lg ">
				<h3 class="text-lg font-semibold border-b border-gray-400">Open Channels</h3>

				<ul class="mt-2 h-96 overflow-y-auto">
					<li v-for="channel in openChannels" class="mb-2" >		
						<div class="text-lg flex flex-row border px-2 py-1 rounded-lg">
							<div class="w-2/3 overflow-x-auto">{{ channel.name }}</div>
							<button :id="channel.idChannel" @click="btnJoinChannel" class="flex w-1/3 text-blue-600">Join</button>
							<img :src="getChannelTypeImg(channel.idType)" alt="channType">
						</div>
					</li>
				</ul>
			</div>

		</div>


		<!--CHAT ROOM  -->
		<div class="flex flex-row w-3/4 pl-5">
			<div class="mb-4 flex flex-col w-2/3">
				<div class="border-2 border-blue-500 px-4 py-2 rounded-lg h-full">
					
					<div class="h-14 flex flex-row border-b border-gray-400">
						<div class="w-1/6 mr-5">
							<h3 class="text-lg font-semibold ">Rooms</h3>
						</div>

				
						<div class="overflow-y-auto" ref="scrollContainer">
							<ul class="flex flex-row">
								<button 
									:id="channel.idChannel"
									v-for="channel in joinedChannels"
									class="mx-1 border rounded-lg px-2 py-1 max-w-tab"
									:class="{ 
										'bg-blue-500 text-white': channel.idChannel === selectedChannelID,
										'bg-gray-300 text-black': !(channel.idChannel === selectedChannelID),
									}"
									@click="selectChannel(channel.idChannel)"
								> 
									{{channel.name}}
								</button>
							</ul>
						</div>
					
					</div>
						
					<div v-if="selectedChannelID" class="">
						<ul class="h-96 mt-10 overflow-y-auto">
							<li v-for="msg in selectedChannelMsg" class="flex flex-row">
								<p class="mr-2 text-lg text-blue-500"> {{ msg.username }}:</p>
								<p class="text-lg overflow-x-auto"> {{ msg.content }}</p>
							</li>
						</ul>
					</div>
						<div v-if="selectedChannelID" class="mt-auto">
							<input
							v-model="newMessage"
							type="text"
							placeholder="Send a message"
							class="p-2 w-5/6 border rounded-lg"
							/>
							<button @click="sendMessage" class="mt-2 w-1/6 bg-blue-500 text-white px-4 py-2 rounded-lg">Send</button>
						</div>			
				</div>
			</div>
			

			<!-- PLAYER LIST -->
			<div class="mb-4 flex flex-col w-1/3">
				<div class="border-2 border-blue-500 px-4 py-2 rounded-lg ml-5">
					<h3 class="text-lg font-semibold border-b border-gray-400">Players</h3>
					
					<div class="mt-2 h-96 overflow-y-auto">

						<ul v-if="selectedChannelID">
							
							<li 
								v-for="user in selectedChannelUsers" 
								class="text-lg  border px-2 py-1 rounded-lg "
								
								:id="user.idUser"
							>
								<div class="flex flex-row justify-between">

									<p 
										:class="{ 
											'text-green-600': user.role === 'Admin',
											'text-red-500': user.owner,
										}"	
									>
										{{ user.username }}
									</p>

									<button @click="toggleDropDown(user.idUser)">
										<img src="../assets/elipsis-h.svg" alt="options">
									</button>
								</div>
								<div 
									v-if="dropDownOpen === user.idUser"
									class="border-t pt-2"
								>
									<div class="flex justify-between">
										<img @click="" class="cursor-pointer" src="../assets/player/play.svg" alt="play">
										<img @click="" class="cursor-pointer" src="../assets/player/profile.svg" alt="profile">
										<img @click="" class="cursor-pointer" src="../assets/player/message.svg" alt="message">
										<img @click="" class="cursor-pointer" src="../assets/player/friend.svg" alt="friend">
										<img @click="" class="cursor-pointer" src="../assets/player/block.svg" alt="block">
									</div>
									<div v-if="roleInChannel === 'Admin' || roleInChannel === 'Owner'" class="flex justify-around mt-2 border-t pt-1">

										<img @click="" class="cursor-pointer" src="../assets/player/mute.svg" alt="mute">
										<img @click="" class="cursor-pointer" src="../assets/player/kick.svg" alt="kick">
										<img @click="" class="cursor-pointer" src="../assets/player/ban.svg" alt="ban">
									</div>
								</div>
									
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>




<script setup lang="ts">
import { ref, watch, onBeforeMount, getCurrentInstance } from 'vue'
import { useCommunityStore } from '../stores/CommunityStore'
import { useProfileStore } from '../stores/ProfileStore'

import { useChannelStore } from '../stores/ChannelStore'
import { storeToRefs } from 'pinia'
import { joinChannel, sendMessageTo } from '@/services/Community-helpers'

onBeforeMount(async () => {
	await communityStore.setupCommunity();
}) 


const communityStore = useCommunityStore();
const { openChannels, joinedChannels, selectedChannelMsg, selectedChannelUsers, roleInChannel } = storeToRefs(communityStore);

const profileStore = useProfileStore();
const { userID } = storeToRefs(profileStore);

const noChannelName = ref(false);
const noChannelType = ref(false);
const noChannelPassword = ref(false);
const newChannelname = ref('');
const newChannelPassword = ref('');
const newChannelType = ref('public');

const selectedChannelID = ref(null);
const scrollContainer = ref(null);

const newMessage = ref('');

const selectedUserID = ref(null);
const dropDownOpen = ref(null);


async function btnJoinChannel(event) {

	const idChannel = +event.target.id;
	console.log('Clicked button with id:', idChannel + typeof idChannel);

	// UNTESTED + needs to add PW for private channel join
	await joinChannel(userID.value, idChannel)

	await communityStore.setupCommunity();
}

async function createChannel() {
	noChannelName.value = false;
	noChannelType.value = false;
	noChannelPassword.value = false;

	if (newChannelname.value.trim() == '')
		noChannelName.value = true;
	else if (newChannelType.value.trim() == '')
		noChannelType.value = true;
	else if (newChannelPassword.value.trim() == '' && newChannelType.value.trim() == 'private')
		noChannelPassword.value = true;
	else if (newChannelType.value.trim() == 'public')
		await communityStore.setupNewChannel(newChannelname.value, 2, newChannelPassword.value)
	else if (newChannelType.value.trim() == 'private')
		await communityStore.setupNewChannel(newChannelname.value, 1, newChannelPassword.value)

	await communityStore.setupCommunity();
}

async function selectChannel(channelID: string) {

	// Websocket connect here ?

	selectedChannelID.value = channelID;

	await communityStore.updateSelectedChannel(channelID);

	// scrollToSelectedTab();
}

// const scrollToSelectedTab = () => {
//   if (selectedChannelID.value) {
//     scrollContainer.value.scrollTop = selectedChannelID.value.offsetTop - scrollContainer.value.offsetTop;
//   };
// };

async function sendMessage() {
	// Also websocket pb, ping all connected users ?
	let body = {
		content: newMessage.value,
		idUser: userID.value,
		idChannel: selectedChannelID.value,
	}
	try {
		const res = await sendMessageTo(body);
		// update msg UI
	} catch (error) {
		console.error('Error sending message', error);
	}

	await communityStore.updateSelectedChannel(selectedChannelID.value);
}

function toggleDropDown(playerID) {
	selectedUserID.value = playerID;
	if (dropDownOpen.value != playerID)
		dropDownOpen.value = playerID;
	else
		dropDownOpen.value = null;
}

function getChannelTypeImg(channType) {
	if (channType === 2)
		return "src/assets/public.svg";
	else if (channType === 1)
		return "src/assets/private.svg";
}


// **************************************************

const channelStore = useChannelStore()
const showUsers = ref(false);

// watch(availableChannels,() => {
// 	updateopenChannels++;
// })


// const setupUsernames = async () => {
//   await communityStore.setupUsernames()
// //   showUsers.value = true // Set a flag to indicate that data is loaded
// }
// setupUsernames()

// const setupAvailableChannels = async () => {
//   await communityStore.setupAvailableChannels()
//   showUsers.value = true // Set a flag to indicate that data is loaded
// }
// setupAvailableChannels()

// async function renderChannels() {
// 	let res = await communityStore.getAvailableChannels();
	
// 	// while(!(res = communityStore.getAvailableChannels())) {
// 	// 	console.log("undef")
// 	// }

// 	return res;
// }



// const setupChannel = async () => {
//   await channelStore.setupChannel()
//   showchannel.value = true // Set a flag to indicate that data is loaded
// }

////////////////
// async function boop(test) {
// 	console.log("booped")
// 	// console.log(test)
// 	channelStore.setChannelId(test)
// 	// await setupChannel()
// 	// console.log("bop")
// }
////////////////

</script>