import { defineStore } from 'pinia'
import { ref } from 'vue'

const useAuthenticationStore = defineStore('auth', () => {
	const isAuthenticated = ref(false)
	return {isAuthenticated}
})

export default useAuthenticationStore;