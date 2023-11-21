import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFriendStore = defineStore('friends', () => {
	
	const friendsList = ref([]);

	async function setupFriends() {
		
	}

	return {
		friendsList,
		setupFriends,
	};
})