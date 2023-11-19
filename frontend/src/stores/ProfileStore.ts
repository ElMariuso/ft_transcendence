import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import jwt_decode from 'jwt-decode';
import { getUserData } from '@/services/auth-helpers'
import Cookies from 'js-cookie';

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
	const username = ref("username")
	const avatar = ref("../../upload/default_avatar.png")
	const twoFactorAuth = ref(false)
	const avatarUpdated = ref(false);

	/**
     * Asynchronous function to set up the user's profile.
     * 
     * This function retrieves the JWT token from localStorage, decodes the user ID from it, and 
     * uses it to fetch and set the user's data from the API, updating the store's reactive state properties.
	*/
	async function setupProfile(newId : number) {
		const token = Cookies.get('token')
		const id = jwt_decode(token).sub;
		userID.value = id;
		if (newId != 0)
			userID.value = newId;

		try {
			const userData = await getUserData(id);
			setUserID(id);
			username.value = userData.username;
			// setUsername(userData.username);
            setAvatar(userData.avatar);
            setTwoFactorAuth(userData.isTwoFactorAuthEnabled);
			avatarUpdated.value = true;
		} catch (error) {
			console.error("Error setting up profile:", error);
		}
	}

	function updateProfile(bodyInfo: []) {
		if (bodyInfo['username'])
			username.value = bodyInfo['username'];
		if (bodyInfo['isTwoFactorAuthEnabled'])
			twoFactorAuth.value = bodyInfo['isTwoFactorAuthEnabled'];
		if (bodyInfo['avatar']) {
			avatarUpdated.value = true;
		}
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
		// avatarImg.value = getAvatarImg();
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
	return {
		avatar, username, twoFactorAuth, userID, avatarUpdated, 
		setupProfile, updateProfile
	}
})