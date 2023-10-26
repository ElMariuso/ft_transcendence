import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

// import { useProfileStore } from '../stores/ProfileStore'

import { getUsernamesData } from '@/services/Community-helpers'
// import { getAvailableChannelsData } from '@/services/Community-helpers'
import { 
	getAllChannels, 
	getSubscribedChannels, 
	postNewChannelsData, 
	getChannelMsg } from '@/services/Community-helpers'

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
	
	const openChannels = ref([]);
	const joinedChannels = ref([]);
	const selectedChannelMsg = ref([]);

	// const usernamesList = ref(['test', 'retest']);
	// const getChannels = computed(() => availableChannels.values)
	// const userID = ref(0);


	async function setupCommunity() {
	
	// ****** TESTING
		// try {
		// 	const allChannels = await getAllChannels();
			
		// 	openChannels.value = allChannels;
		// } catch (error) {
		// 	console.error("Error setting up available channels:", error);
		// }
	// **********

	// ******* CORRECT VERSION
		const token = Cookies.get('token');
		const id = jwt_decode(token).sub;

		try {
				const allChannels = await getAllChannels();
				const channelsJoined = await getSubscribedChannels(id);

				console.log(channelsJoined)
				joinedChannels.value = channelsJoined;
				console.log(joinedChannels)
					
				const resChannels = allChannels.filter((channel) => {
					return !channelsJoined.some((joinedChannel) => channel.idChannel === joinedChannel.idChannel);
				});

				console.log(joinedChannels)
				openChannels.value = resChannels;
			} catch (error) {
					console.error("Error setting up available channels:", error);
			}
		// ***********************
	}

	async function updateSelectedChannelMsg(channelID) {
		try {
			const messages = await getChannelMsg(channelID);

			// Order by timestamp ?

			selectedChannelMsg.value = messages;
		} catch (error) {
			console.error("Error fetching channel's messages:", error);
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
		const token = Cookies.get('token');
		const id = jwt_decode(token).sub;

		try {
			await postNewChannelsData(id, name, type, password);
		} catch (error) {
			console.error("Error creating a new channel:", error);
		}
	}

	return {
		openChannels, joinedChannels, selectedChannelMsg,
		setupNewChannel, setupCommunity, updateSelectedChannelMsg
		// getUsernames, getAvailableChannels, setupUsernames, setupAvailableChannels, setupNewChannel
	}
})