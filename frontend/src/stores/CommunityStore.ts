import { defineStore } from 'pinia'
import { ref } from 'vue'
// import axios from 'axios';
import jwt_decode from 'jwt-decode';

import { getUsernamesData } from '@/services/Community-helpers'
import { getAvailableChannelsData } from '@/services/Community-helpers'
import { postNewChannelsData } from '@/services/Community-helpers'
// import { getActivePinia } from 'node_modules/pinia/dist/pinia';

/*

V-list off all users
  --> '/users/usernames'
  --> Remove username from list ?

-send private message 
  --> 

-create channel
  --> @post in channel.controller

V-list of all available channel
  --> '/userchannels/:id' (user id)

-access to private/protected channels ?
  --> invites ?
  --> password ?

*/


export const useCommunityStore = defineStore('community', () => {

	const userID = ref(0)
	const usernames = ref(['test', 'retest']);
	const availableChannels = ref(['test', 'retest']);

	/////////////////// USERNAMES ////////////////////////

	async function setupUsernames() {
		const token = localStorage.getItem('token')
		const id = jwt_decode(token).sub;
		userID.value = id;

		try {
			const userData = await getUsernamesData(id);
			setUsernames(userData);
		} catch (error) {
			console.error("Error setting up Usernames:", error);
		}
	}

	function setUsernames(newList : any) {
		usernames.values = newList;
	}

	function getUsernames() {
		return usernames.values;
	}

	/////////////////// AVAILABLE CHANNELS ////////////////////////

	async function setupAvailableChannels() {
		const token = localStorage.getItem('token')
		const id = jwt_decode(token).sub;
		userID.value = id;

		try {
			const userData = await getAvailableChannelsData(id);
			setAvailableChannels(userData);
		} catch (error) {
			console.error("Error setting up available channels:", error);
		}
	}

	function setAvailableChannels(newList : any) {
		availableChannels.values = newList;
	}

	function getAvailableChannels() {
		return availableChannels.values;
	}

	/////////////////// CREATE CHANNEL ////////////////////////

	async function setupNewChannel(name : string, type :number, password : string) {
		const token = localStorage.getItem('token')
		const id = jwt_decode(token).sub;
		userID.value = id;
		// var y: number = +userID.value;

		try {
			const userData = await postNewChannelsData(id, name, type, password);
			console.log(name);
			console.log(type);
			console.log(password);
			setAvailableChannels(userData);
		} catch (error) {
			console.error("Error creating a new channel:", error);
		}
	}

	return {usernames, availableChannels, getUsernames, getAvailableChannels, setupUsernames, setupAvailableChannels, setupNewChannel}
})