<!-- 
	see and send message 

	see channel members, admin and owner

	invite other users to play a Pong game through the chat interface

	access other players profiles through the chat interface

 -->

<template>
<div v-if="showmessages, showchannel">

	<div class="flex gap-2 justify-around">
		<div class="col-3 fixed inset-0 top-[5.5rem] bottom-[4.5rem] w-5/6 pb-10 pl-8 pr-6 overflow-y-auto">
		  <div class="mt-2">
			<ul class="list-none">
			  <li v-for="message in channelStore.getMessage()" class="mb-2 hover:bg-gray-100">
				<span class="font-semibold">{{ message.username }}</span>
				<!-- <span class="ml-3">{{ message.timestamps }}</span> -->
				<span>
				  <div class="ml-3">{{ message.content }}</div>
				</span>
			  </li>
			</ul>
		  </div>
    	</div>

    	<div class="col-3 w-1/6 p-4 bg-white rounded-lg shadow-lg fixed top-[5.5rem] right-0 pb-10 pl-8 pr-6 overflow-y-auto">
	  	  <h1 class="text-3xl m-0 leading-none mb-8">{{ channelStore.channelName }}</h1>
	  	  <!-- <h1 class="text-3xl m-0 leading-none mb-8">{{ channelStore.getChannelId() }}</h1> -->
	  	  <div class="mt-2">
		  <!-- <ul class="list-disc ml-3">
			<h1 class="font-bold">Owner</h1>
			<li>
		  		<span class="font-semibold">{{ channel.owner }}</span>
			</li>
			<h1 class="mt-3 font-bold">Administrators</h1>
			<li v-for="Admin in channel.channelAdmin" :key="Admin.id">
		  		<span class="font-semibold">{{ Admin.name }}</span>
			</li>
			<h1 class="mt-3 font-bold">Members</h1>
			<li v-for="member in channel.channelMembers" :key="member.id">
		  		<span class="font-semibold">{{ member.name }}</span>
			</li>
		  </ul> -->
	      </div>
    	</div>
	</div>

	<div class="absolute inset-x-0 bottom-0 mr-6 ml-6 mb-6">
	  <input
	    v-model="newMessage"
        type="text"
        placeholder="Send a message"
        class="p-2 w-5/6 border rounded-lg"
      />
      <button @click="sendMessage" class="mt-2 w-1/6 bg-blue-500 text-white px-4 py-2 rounded-lg">Send</button>
	</div>

</div>
</template>

<script setup>
import { ref } from 'vue'
import { useChannelStore } from '../stores/ChannelStore'

const channelStore = useChannelStore()
const showmessages = ref(false);
const showchannel = ref(false);

const noMessage = ref(false);
const newMessage = ref('');

const setupMessage = async () => {
  await channelStore.setupMessage()
  showmessages.value = true // Set a flag to indicate that data is loaded
}
setupMessage()

const setupChannel = async () => {
  await channelStore.setupChannel()
  showchannel.value = true // Set a flag to indicate that data is loaded
}
setupChannel()

async function sendMessage() {
	let bodyInfo = {};
	noMessage.value = false;

	if (newMessage.value.trim() == '')
		noMessage.value = true;
	else
		await channelStore.sendNewMessage(newMessage.value)
	newMessage.value = '';
}

</script>


<style scoped>
/* Add Tailwind CSS classes if not already included */

</style>