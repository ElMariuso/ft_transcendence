import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthenticationStore = defineStore('auth', () => {
	const authState = ref(false);
	const JWTisValid = ref(false);
	const twoFactorAuthState = ref(false);


	function logout() {
		authState.value = false;
	}

	function authenticate() {
		authState.value = true;
	}
	
	function twoFactorAuthenticate() {
		twoFactorAuthState.value = true;
	}

	function validateJWT() {
		JWTisValid.value = true;
	}

	return {authState, JWTisValid, logout, authenticate, validateJWT, twoFactorAuthState, twoFactorAuthenticate}
})