import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProfileStore = defineStore('profile', () => {
	const avatar = ref("./src/assets/default_avatar.png")
	const username = ref("username")

	function setAvatar(newAvatar: string) {
		avatar.value = newAvatar
	}

	function setUsername(newUsername: string) {
		username.value = newUsername
	}

	return {avatar, username, setAvatar, setUsername}
})