import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios';
import jwt_decode from 'jwt-decode';


export const useProfileStore = defineStore('profile', () => {
	
	const avatar = ref("./src/assets/default_avatar.png")
	const username = ref("username")
	const twoFactorAuth = ref(false)
	const userID = ref('0')

	async function setupProfile() {
		const token = localStorage.getItem('token')
		const id = jwt_decode(token).sub;		
		
		await axios.get('/users/user/' + id, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		}).then(res => {
			setUsername(res.data.username);
			setAvatar(res.data.avatar);
			setTwoFactorAuth(res.data.isTwoFactorAuthEnabled);
		});
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

	function setUserID(newID: string) {
		userID.value = newID
	}

	return {avatar, username, twoFactorAuth, userID, setAvatar, setUsername, setTwoFactorAuth, setupProfile, setUserID}
})