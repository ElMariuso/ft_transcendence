import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import jwt_decode from 'jwt-decode';
import { useProfileStore } from '../stores/ProfileStore'

import { getUsernamesData } from '@/services/Community-helpers'
// import { getAvailableChannelsData } from '@/services/Community-helpers'
import { getAllChannels } from '@/services/Community-helpers'
import { postNewChannelsData } from '@/services/Community-helpers'

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

	const profileStore = useProfileStore();
	const channelsList = ref([]);
	const channelsLoaded = ref(false);
	const getChannels = computed(() => channelsList);
	
	
	// const getChannelsList = computed(() => channelsList.values);

	// const usernamesList = ref(['test', 'retest']);
	// const getChannels = computed(() => availableChannels.values)
	// const userID = ref(0);


	async function setupCommunity() {
		try {
			const channels = await getAllChannels();
			// console.log(channels)
			channelsList.value = channels;
			channelsLoaded.value = true;
		} catch (error) {
			console.error("Error setting up available channels:", error);
		}
	}


	/////////////////// USERNAMES ////////////////////////

	// async function setupUsernames() {
	// 	const token = localStorage.getItem('token')
	// 	const id = jwt_decode(token).sub;
	// 	userID.value = id;

	// 	try {
	// 		const userData = await getUsernamesData(id);
	// 		setUsernames(userData);
	// 	} catch (error) {
	// 		console.error("Error setting up Usernames:", error);
	// 	}
	// }

	// function setUsernames(newList : any) {
	// 	usernames.values = newList;
	// }

	// function getUsernames() {
	// 	return usernames.values;
	// }

	/////////////////// AVAILABLE CHANNELS ////////////////////////

	// async function setupAvailableChannels() {
	// 	const token = localStorage.getItem('token')
	// 	const id = jwt_decode(token).sub;
	// 	userID.value = id;

	// 	try {
	// 		const userData = await getAvailableChannelsData(id);
	// 		setAvailableChannels(userData);
	// 	} catch (error) {
	// 		console.error("Error setting up available channels:", error);
	// 	}
	// }

	// function setAvailableChannels(newList : any) {
	// 	availableChannels.values = newList;
	// }

 	// function getAvailableChannels() {
	// 	console.log(availableChannels.values)
	// 	return availableChannels.values;
	// }

	/////////////////// CREATE CHANNEL ////////////////////////

	async function setupNewChannel(name : string, type :number, password : string) {
		const token = localStorage.getItem('token')
		const id = jwt_decode(token).sub;
		channelsLoaded.value = false;
		try {
			const newChannelsList = await postNewChannelsData(id, name, type, password);
			// console.log(name);
			// console.log(type);
			// console.log(password);

			// availableChannels.values = userData;
			channelsList.value = newChannelsList;
			// setAvailableChannels(userData);
			channelsLoaded.value = true;
			
		} catch (error) {
			console.error("Error creating a new channel:", error);
		}
	}

	return {
		channelsList, channelsLoaded, getChannels,
		setupNewChannel, setupCommunity
		// getUsernames, getAvailableChannels, setupUsernames, setupAvailableChannels, setupNewChannel
	}
})