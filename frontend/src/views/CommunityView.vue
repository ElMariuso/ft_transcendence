<template>
<!-- <div v-if="showUsers"> -->
	<div class="flex flex-row ">

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
					type="text"
					placeholder="Enter password"
					:disabled="newChannelType==='public'"
					class="p-2  border rounded-lg mt-2 w-full"
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
				<h3 class="text-lg font-semibold border-b border-gray-400">Channels</h3>

				<div>

				</div>
				<div class="mt-2 h-96 overflow-y-auto"  >
					<ul v-if="channelsLoaded" >
						
						<li  v-for="channel in list" class="mb-2" >
							
								<nav class="text-lg mr-5">
									<section>{{ channel.name }}</section>
								</nav>
							
						</li>

						
					<!-- TESTING -->
						<!-- <li class="mb-2">
							<div class="text-lg flex flex-row border px-2 py-1 rounded-lg">
								<div class="w-2/3">Channel 1</div>
								<button class="flex w-1/3 text-blue-600">Join</button>
							</div>
						</li>
						<li class="mb-2">
							<div class="text-lg flex flex-row border px-2 py-1 rounded-lg">
								<div class="w-2/3">Channel 2</div>
								<button class="flex w-1/3 text-red-600">Quit</button>
							</div>
						</li> -->

					</ul>

					<div v-else>
						<p>Loading...</p>

					</div>
				</div>
			</div>
		</div>
			
		<!-- <div v-if=1 class="flex flex-row w-3/4 pl-5">
			<div class="mb-4 flex flex-col w-2/3">
				<div class="border-2 border-blue-500 px-4 py-2 rounded-lg h-full ">
					<div class="flex flex-row border-b border-gray-400">
						<div class="w-1/6 mr-5">
							<h3 class="text-lg font-semibold ">Rooms</h3>

						</div>
						<div class="w-5/6 flex flex-row overflow-y-auto">

							<ul class="w-5/6 flex flex-row overflow-y-auto">
								<li class="mx-2 border rounded-lg px-2 py-1 bg-blue-500 text-white max-w-tab"> <button> tabgdrgdgdg</button> </li>



								<li class="mx-2 border rounded-lg px-2 py-1"> <button> tab</button> </li>
								<li class="mx-2"> <button> tab</button> </li>
								<li class="mx-2"> <button> tab</button> </li>
								

							</ul>
			
						</div>
					</div>
			

						<div>
							test
						</div>
						<div>
							test
						</div>
						<div>
							test
						</div>

						
				<div class="mt-auto">
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
			
			<div class="mb-4 flex flex-col w-1/3">
				<div class="border-2 border-blue-500 px-4 py-2 rounded-lg ml-5">
					<h3 class="text-lg font-semibold border-b border-gray-400">Players</h3>
	
					<ul class="mt-2 h-96 overflow-y-auto">
						

					<li class="mb-2">
						<div class="text-lg flex flex-row border px-2 py-1 rounded-lg">
							<button @click="toggleStuff" class="w-2/3">User 1</button>	
						</div>
					</li>
					<li class="mb-2">
						<div class="text-lg flex flex-row border px-2 py-1 rounded-lg">
							<button @click="toggleStuff" class="w-2/3">User 1</button>	
						</div>
					</li>
					</ul>
				</div>
			</div>

		</div> -->

	</div>
<!-- </div> -->
</template>

<!-- PLAY -->
						<!-- PROFILE -->
						
						<!-- 'Settings' -->
							<!-- DM -->
							<!-- add friend -->
							<!-- BLOCK -->

							<!-- IF ADMIN -->
							<!-- KICK/BAN/MUTE -->


<script setup lang="ts">
import { ref, watch, onBeforeMount, getCurrentInstance } from 'vue'
import { useCommunityStore } from '../stores/CommunityStore'
import { useChannelStore } from '../stores/ChannelStore'
import { storeToRefs } from 'pinia'

onBeforeMount(async () => {
	await communityStore.setupCommunity();
}) 

const communityStore = useCommunityStore();
const updateChannelsKey = ref(0);
const updateChannels = ref(false);


const { channelsList, channelsLoaded, getChannels } = storeToRefs(communityStore);
const list = channelsList;

// watch(updateChannels, (newVal) => {
// 	console.log("In WAtcher")
// 	if (newVal) {

// 		// channelsLoaded.value = true;
// 		updateChannelsKey.value++;
// 		updateChannels.value = false;
// 	}
// });

// function load() {
// 	channelsLoaded.value = true;
// }

// onUpdated(async () => {
// 	console.log("Here ?")
//   if (isChannelsLoaded.value) {
//     // Implement the logic to reload the component's data
//     // This can include making an API request to fetch fresh data
//     // Update channelsList with the new data
//     // Call your method to reload the component's data here
// 	// list.value = communityStore.channelsList;
// 		list.value = communityStore.channelsList;
//     // reloadComponentData();
//   }
// });

// // Function to reload component data
// function reloadComponentData() {
//   // Implement the logic to reload the component's data here
//   // This can include making an API request to fetch fresh data
//   // Update channelsList with the new data
// }






// const {channelsList, getChannelsList} = storeToRefs(communityStore);



// console.log(getChannelsList);


// const { availableChannels, getChannels } = storeToRefs(communityStore)

// const updateChannelsList = ref(0);

// const renderedChannels = computed(() => {
// 	availableChannels;
// } 
// );

const channelStore = useChannelStore()
const showUsers = ref(false);

const noChannelName = ref(false);
const noChannelType = ref(false);
const noChannelPassword = ref(false);
const newChannelname = ref('');
const newChannelPassword = ref('');
const newChannelType = ref('public');

// watch(availableChannels,() => {
// 	updateChannelsList++;
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




function getChannelsfn() {
	console.log("VALS\n " + getChannels.value)
	return getChannels;
}

function updateChannelsList() {
	list.value = getChannels;
	const instance = getCurrentInstance();
  	instance.proxy.forceUpdate();

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
	
	// updateChannels.value = true;
	updateChannelsList();
}

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