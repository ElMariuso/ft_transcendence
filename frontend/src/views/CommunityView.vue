<!-- 
	Create channel (pub/private/protected)

	Join channel 

	send private msg -> list of other users
			 - friend list ?
			 - users of selected channel -> button to play/view profile/ send msg

 -->

<template>
<div v-if="showUsers">

  <h2 class="text-lg font-semibold">Community</h2>

  <div class="p-4">
	<!-- Find Users -->
    <!-- <div class="mb-4">
      <h3 class="text-lg font-semibold">Find users</h3>
	  <select class="p-2 w-1/3 border rounded-lg">
        <option v-for="usernames in communityStore.getUsernames()">{{ usernames }}</option>
      </select>
      <button @click="findUser" class="mt-2 bg-blue-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">Find</button>
    </div> -->

	<!-- Send Private Message -->
    <div class="mb-4">
      <h3 class="text-lg font-semibold">Send Private Message To</h3>
	  <select class="p-2 w-1/3 border rounded-lg">
        <option v-for="usernames in communityStore.getUsernames()">{{ usernames }}</option>
      </select>
      <button @click="sendPrivateMessage" class="mt-2 bg-blue-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">Send</button>
    </div>

    <!-- Create Channels -->
    <div  class="mb-4">
      <h3 class="text-lg font-semibold">Create Channels</h3>
      <input
	    v-model="newChannelname"
        type="text"
        placeholder="Enter channel name"
        class="p-2 w-1/3 border rounded-lg mt-2"
      />
	  <select v-model="newChannelType" class="p-2 w-1/6 border rounded-lg">
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
	   <input
	    v-model="newChannelPassword"
        type="text"
        placeholder="Enter password"
        class="p-2 w-1/3 border rounded-lg mt-2"
      />
      <button @click="createChannel" class="mt-2 bg-blue-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">
		Create
      </button>
	  <div v-if="noChannelName">
		<h3 class="text-lg text-red-600 font-semibold">You need to enter a name to create a channel</h3>
	  </div>
	  <div v-if="noChannelType">
		<h3 class="text-lg text-red-600 font-semibold">You need to select a type to create a channel</h3>
	  </div>
	  <div v-if="noChannelPassword">
		<h3 class="text-lg text-red-600 font-semibold">Private channel need a password</h3>
	  </div>
	</div>

    <!-- Joined Channels -->
    <div>
      <h3 class="text-lg font-semibold w-1/3">Available Channels</h3>
      <ul class="mt-2 w-1/3">
		<li v-for="channel in communityStore.getAvailableChannels()" class="mb-2">
		  <router-link @click="boop(channel.idChannel)" :to="'/channel'">
			<nav class="text-lg mr-5">
              <section>{{ channel.name }}</section>
            </nav>
		  </router-link>
        </li>
      </ul>
    </div>
  </div>

</div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useCommunityStore } from '../stores/CommunityStore'
import { useChannelStore } from '../stores/ChannelStore'

const communityStore = useCommunityStore()
const channelStore = useChannelStore()
const showUsers = ref(false);

const noChannelName = ref(false);
const noChannelType = ref(false);
const noChannelPassword = ref(false);
const newChannelname = ref('');
const newChannelPassword = ref('');
const newChannelType = ref('');


const setupUsernames = async () => {
  await communityStore.setupUsernames()
//   showUsers.value = true // Set a flag to indicate that data is loaded
}
setupUsernames()

const setupAvailableChannels = async () => {
  await communityStore.setupAvailableChannels()
  showUsers.value = true // Set a flag to indicate that data is loaded
}
setupAvailableChannels()

async function createChannel() {
	let bodyInfo = {};
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
	newChannelname.value = '';
	newChannelType.value = '';
	newChannelPassword.value = '';
}


async function boop(test) {
	console.log("booped")
	// console.log(test)
	channelStore.setChannelId(test)
	// await setupChannel()
	// console.log("bop")
}

////////////////
////////////////


</script>


<style scoped>
/* Add Tailwind CSS classes if not already included */

</style>