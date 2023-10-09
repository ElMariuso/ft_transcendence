import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthenticationStore = defineStore('auth', () => {
	const isAuthenticated = ref(false)
	return {isAuthenticated}
})