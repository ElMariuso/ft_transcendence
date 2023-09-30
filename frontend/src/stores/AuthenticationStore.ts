import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthenticationStore = defineStore('auth', () => {
	const authState = ref(false)

	return {authState}
})