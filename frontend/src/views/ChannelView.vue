<!-- 
	see and send message 

	see channel members, admin and owner

	invite other users to play a Pong game through the chat interface

	access other players profiles through the chat interface

 -->

<template>
<div class="flex gap-2 justify-around">
	<div class="col-3 fixed inset-0 top-[5.5rem] bottom-[4.5rem] w-5/6 pb-10 pl-8 pr-6 overflow-y-auto">
		<div class="mt-2">
			<ul class="list-none">
			  <li v-for="message in channel.messageHistory" :key="message.id" class="mb-2 hover:bg-gray-100">
				<span class="font-semibold">{{ message.sender }}</span>
				<span>
				  <div class="ml-3">{{ message.text }}</div>
				</span>
			  </li>
			</ul>
		  </div>
    </div>

    <div class="col-3 w-1/6 p-4 bg-white rounded-lg shadow-lg fixed top-[5.5rem] right-0 pb-10 pl-8 pr-6 overflow-y-auto">
	  <h1 class="text-3xl m-0 leading-none mb-8">{{ channel.name }}</h1>
	  <!-- <h1 class="text-3xl m-0 leading-none mb-8">{{ channelStore.getChannelId() }}</h1> -->
	  <div class="mt-2">
		<ul class="list-disc ml-3">
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
		</ul>
	  </div>
    </div>
</div>

	<div class="absolute inset-x-0 bottom-0 mr-6 ml-6 mb-6">
	  <input
        type="text"
        placeholder="Send a message"
        class="p-2 w-5/6 border rounded-lg"
      />
      <button @click="searchProfile" class="mt-2 w-1/6 bg-blue-500 text-white px-4 py-2 rounded-lg">Send</button>
	</div>

</template>


<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	 data() {
    return {
	channel: {
    name: 'General',
	owner: 'xXx_daRkl0Rd_xXx',
	channelAdmin: [
      { id: 1, name: 'Marc' },
      { id: 2, name: 'Luke' },
    ],
    channelMembers: [
      { id: 1, name: 'John' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Arthur' },
    ],
    messageHistory: [
      { id: 1, sender: 'John', text: 'Hey' },
      { id: 2, sender: 'Arthur', text: 'Welcome' },
      { id: 3, sender: 'Bob', text: 'Yo' },
	  { id: 4, sender: 'Arthur', text: '-_-' },
      { id: 5, sender: 'Bob', text: '?_?' },
	  { id: 6, sender: 'Marc', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' },
	  { id: 6, sender: 'Marc', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' },
	  { id: 6, sender: 'Marc', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' },
	  { id: 6, sender: 'Marc', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' },
	  { id: 6, sender: 'Marc', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' },
	  { id: 6, sender: 'Marc', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' },
	  { id: 6, sender: 'Marc', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' },
    ],
    },
    };
  },
});

</script>


<style scoped>
/* Add Tailwind CSS classes if not already included */

</style>