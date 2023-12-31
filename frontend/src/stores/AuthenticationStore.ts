import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Authentication Store Module.
 *
 * This module utilizes Pinia's `defineStore` method to establish a store named 'auth'.
 * The primary role of this store is to manage the state pertaining to authentication
 * across the application. The store encapsulates a reactive state named `isAuthenticated`
 * and exposes it to the rest of the application. `isAuthenticated` will be utilized to
 * track and reactively update the authentication status of the user in the UI across
 * the application.
 */
export const useAuthenticationStore = defineStore('auth', () => {
	// Define a reactive state `isAuthenticated` using `ref`, initializing it as `false`
	const isAuthenticated = ref(false);
	const JWTisValid = ref(false);
	const twoFactorAuthState = ref(false);
	const firstAuth = ref(0);
	
	/**
	 * Authenticated the user by setting `isAuthenticated` to true.
	 */
	function login() {
		isAuthenticated.value = true;
	}

	/**
     * Unauthenticate the user by setting `isAuthenticated` to false.
     */
	function logout() {
		isAuthenticated.value = false
	}

	// Return the state to expose it for component usage
	function twoFactorAuthenticate() {
		twoFactorAuthState.value = true;
	}

	function validateJWT() {
		JWTisValid.value = true;
	}

	return { isAuthenticated, login, logout , JWTisValid, validateJWT, twoFactorAuthState, twoFactorAuthenticate, firstAuth }
})