import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthenticationStore = defineStore('auth', () => {
	const authState = ref(false)

	function logout() {
		authState.value = false;
	}

	return {authState, logout}
})