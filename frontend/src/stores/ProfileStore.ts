import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios';
import jwt_decode from 'jwt-decode';


export const useProfileStore = defineStore('profile', () => {
	
	const userID = ref('0')
	const avatar = ref("./src/assets/default_avatar.png")
	const username = ref("username")
	const twoFactorAuth = ref(false)
	// const twoFactorAuthSecret = ref('')

	async function setupProfile() {
		const token = localStorage.getItem('token')
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

	function setAvatar(newAvatar: string) {
		avatar.value = newAvatar
	}

	function setUsername(newUsername: string) {
		username.value = newUsername
	}

	function setTwoFactorAuth(val: boolean) {
		twoFactorAuth.value = val
	}

	// function setTwoFactorAuthSecret(secret: string) {
	// 	twoFactorAuthSecret.value = secret
	// }


	return {avatar, username, twoFactorAuth, userID, setAvatar, setUsername, setTwoFactorAuth, setupProfile, setUserID}
})