<!-- 
	Create channel (pub/private/protected)

	Join channel 

	send private msg -> list of other users
			 - friend list ?
			 - users of selected channel -> button to play/view profile/ send msg

 -->

<template>
  <div class="p-4">
    <!-- Search for Other People's Profile -->
    <div class="mb-4">
      <h3 class="text-lg font-semibold">Search for Profiles</h3>
      <input
        type="text"
        placeholder="Enter username to search"
        class="p-2 w-1/3 border rounded-lg"
      />
      <button @click="searchProfile" class="mt-2 bg-blue-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">Search</button>
    </div>

	<!-- Send Private Message -->
    <div class="mb-4">
      <h3 class="text-lg font-semibold">Send Private Message</h3>
      <input
        type="text"
        placeholder="Enter recipient's username"
        class="p-2 w-1/3 border rounded-lg"
      />
      <button @click="sendPrivateMessage" class="mt-2 bg-blue-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">Send</button>
    </div>

    <!-- Create Channels -->
    <div  class="mb-4">
      <h3 class="text-lg font-semibold">Create Channels</h3>
      <input
        type="text"
        placeholder="Enter channel name"
        class="p-2 w-1/3 border rounded-lg mt-2"
      />
	  <!-- <select v-model="channelType" class="p-2 w-1/6 border rounded-lg"> -->
	  <select class="p-2 w-1/6 border rounded-lg">
        <option value="public">Public</option>
        <option value="private">Private</option>
        <option value="protected">Protected</option>
      </select>
      <button @click="createChannel" class="mt-2 bg-blue-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">Create</button>
    </div>

    <!-- Join Channels -->
    <div class="mb-4">
      <h3 class="text-lg font-semibold">Join Channels</h3>
      <!-- <select v-model="selectedChannel" class="p-2 w-1/3 border rounded-lg"> -->
	  <select class="p-2 w-1/3 border rounded-lg">
        <option v-for="channel in channels.availableChannels" :key="channel.id" :value="channel.id">{{ channel.name }}</option>
      </select>
      <button @click="joinChannel" class="mt-2 bg-blue-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">Join</button>
    </div>

    <!-- Joined Channels -->
    <div>
      <h3 class="text-lg font-semibold w-1/3">Joined Channels</h3>
      <ul class="mt-2 w-1/3">
        <li v-for="channel in channels.joinedChannels" :key="channel.id">
          <router-link :to="'/channel/' + channel.id">
            <nav class="text-lg mr-5">
              <section>{{ channel.name }}</section>
            </nav>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	 data() {
    return {
	channels: {
    joinedChannels: [
      { id: 1, name: 'General' },
      { id: 2, name: 'Random' },
      { id: 3, name: 'Meme' },
    ],
    availableChannels: [
      { id: 1, name: 'Public Channel 1' },
      { id: 2, name: 'Public Channel 2' },
      { id: 3, name: 'Private Channel 1' },
	  { id: 3, name: 'Protected Channel 1' },
    ],
    },
    };
  },
});
</script>


<style scoped>
/* Add Tailwind CSS classes if not already included */

</style>