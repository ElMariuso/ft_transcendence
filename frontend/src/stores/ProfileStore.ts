import { defineStore } from 'pinia'
import { ref } from 'vue'
import jwt_decode from 'jwt-decode';
import { getUserData } from '@/services/auth-helpers'

/**
 * Vue Store: Profile
 * 
 * The `useProfileStore` function is a store used to manage and interact with the user's profile data 
 * within the Vue application. Utilizing Vue's Pinia store, it allows components to reactively access 
 * and modify the user's data, ensuring a consistent state across the application.
 */
export const useProfileStore = defineStore('profile', () => {
		// Reactive state properties to hold user data such as avatar, username, two factor authentication status, and user ID
	const userID = ref('0')
	const avatar = ref("./src/assets/default_avatar.png")
	const username = ref("username")
	const twoFactorAuth = ref(false)
	// const twoFactorAuthSecret = ref('')

	/**
     * Asynchronous function to set up the user's profile.
     * 
     * This function retrieves the JWT token from localStorage, decodes the user ID from it, and 
     * uses it to fetch and set the user's data from the API, updating the store's reactive state properties.
     */
	async function setupProfile() {
		const token = localStorage.getItem('token')
		const id = jwt_decode(token).sub;
		userID.value = id;

		try {
			const userData = await getUserData(id);
			setUsername(userData.username);
            setAvatar(userData.avatar);
            setTwoFactorAuth(userData.isTwoFactorAuth);
		} catch (error) {
			console.error("Error setting up profile:", error);
		}
		const id = jwt_decode(token).sub;		
		
		console.log("Profile store req")
		await axios.get('/users/user/' + id, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		}).then(res => {
			setTwoFactorAuth(res.data.isTwoFactorAuthEnabled);
			setUsername(res.data.username);
			setAvatar(res.data.avatar);
			// setTwoFactorAuthSecret(res.data.twoFactorAuthSecret)
		});
	}

	function setUserID(newID: string) {
		userID.value = newID
	}

	/**
     * Function to set the user's avatar.
     * 
     * @param {string} newAvatar - The new avatar URL.
     */
	function setAvatar(newAvatar: string) {
		avatar.value = newAvatar
	}

	/**
     * Function to set the user's username.
     * 
     * @param {string} newUsername - The new username.
     */
	function setUsername(newUsername: string) {
		username.value = newUsername
	}

	/**
     * Function to set the user's two-factor authentication status.
     * 
     * @param {boolean} val - The two-factor authentication status.
     */
	function setTwoFactorAuth(val: boolean) {
		twoFactorAuth.value = val
	}

	// Exporting reactive properties and methods to be accessible within components
	// function setTwoFactorAuthSecret(secret: string) {
	// 	twoFactorAuthSecret.value = secret
	// }


	return {avatar, username, twoFactorAuth, userID, setAvatar, setUsername, setTwoFactorAuth, setupProfile, setUserID}
})