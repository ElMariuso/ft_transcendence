import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios';
import jwt_decode from 'jwt-decode';


export const useProfileStore = defineStore('profile', () => {

	
	const avatar = ref("./src/assets/default_avatar.png")
	const username = ref("username")
	const twoFactorAuth = ref(false)

	async function setupProfile() {
		const token = localStorage.getItem('token')
		const userID = jwt_decode(token).sub;

		await axios.get('/users/' + userID, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		}).then(res => {
			setUsername(res.data.username);
			setAvatar(res.data.avatar);
			setTwoFactorAuth(res.data.isTwoFactorAuth);
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

	return {avatar, username, twoFactorAuth, setAvatar, setUsername, setTwoFactorAuth, setupProfile}
})