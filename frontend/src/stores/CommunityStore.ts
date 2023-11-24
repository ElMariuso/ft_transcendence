import { defineStore } from 'pinia'
import { ref } from 'vue'
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

import { 
	getAllChannels, 
	getSubscribedChannels, 
	postNewChannelsData, 
	getChannelMsg,
	getChannelUsers } from '@/services/Community-helpers'

export const useCommunityStore = defineStore('community', () => {
	
	const openChannels = ref([]);
	const joinedChannels = ref([]);
	const selectedChannelMsg = ref([]);
	const selectedChannelUsers = ref([]);
	const roleInChannel = ref('Member');

	async function setupCommunity() {
	
		const token = Cookies.get('token');
		const id = jwt_decode(token).sub;

		try {
			const allChannels = await getAllChannels();
			const channelsJoined = await getSubscribedChannels(id);

			joinedChannels.value = channelsJoined;
				
			const resChannels = allChannels.filter((channel) => {
				return !channelsJoined.some((joinedChannel) => channel.idChannel === joinedChannel.idChannel);
			});

			openChannels.value = resChannels;
		} catch (error) {
			console.error("Error setting up available channels:", error);
		}
	}

	async function updateSelectedChannel(channelID) {
		const token = Cookies.get('token');
		const id = jwt_decode(token).sub;

		try {
			const messages = await getChannelMsg(channelID);
			selectedChannelMsg.value = messages;
			
			const users = await getChannelUsers(channelID);
			const user = users.find(user => user.idUser === id);
			if (user) {

				if (user.owner)
				roleInChannel.value = "Owner";
				else
				roleInChannel.value = user.role;
			}
			selectedChannelUsers.value = users;
		} catch (error) {
			console.error("Error fetching channel's messages:", error);
		}
	}

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
		openChannels, joinedChannels, selectedChannelMsg, selectedChannelUsers, roleInChannel,
		setupNewChannel, setupCommunity, updateSelectedChannel
	};
})