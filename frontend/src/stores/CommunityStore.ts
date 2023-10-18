import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios';
import jwt_decode from 'jwt-decode';

/*

-list off all users
  V--> '/users/usernames'
  --> Remove username from list ?

-send private message 
  --> 

-create channel
  --> @post in channel.controller

-list of all available channel
  --> '/userchannels/:id' (user id)

-access to private/protected channels ?
  --> invites ?
  --> password ?

*/


export const useCommunityStore = defineStore('community', () => {

	const userID = ref(0)
	const usernames = ref(['test', 'retest']);
	const availableChannels = ref(['test', 'retest']);

	async function setupUsernames() : Promise<null>{
		const token = localStorage.getItem('token')
		const id = jwt_decode(token).sub;
		userID.value = ref(id);

		await axios.get('/users/usernames', {
			headers: {
				Authorization: 'Bearer ' + token
			}
		}).then(res => {
			setUsernames(res.data);
		});
		return null;
	}

	async function setupAvailableChannels() : Promise<null>{
		const token = localStorage.getItem('token')
		const id = jwt_decode(token).sub;
		userID.value = ref(id);

		await axios.get('/userchannels/' + id, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		}).then(res => {
			setAvailableChannels(res.data);
		});
		return null;
	}

/////////////////////////////////////////

	function setUsernames(newList: string[]) {
		usernames.values = newList;
	}

	function getUsernames() {
		return usernames.values;
	}

	function setAvailableChannels(newList: string[]) {
		availableChannels.values = newList;
	}

	function getAvailableChannels() {
		return availableChannels.values;
	}


	return {usernames, setupUsernames, getUsernames, availableChannels, setupAvailableChannels, getAvailableChannels}
})