import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';
import { defineStore } from 'pinia'
import { getAllChannels, getSubscribedChannels, postNewChannelsData, getChannelMsg, getChannelUsers, getChannel } from '@/services/Community-helpers'

export const useCommunityStore = defineStore('community', {
	state: () => ({
		openChannels: [],
		joinedChannels: [],
		selectedChannelMsg: [],
		selectedChannelUsers: [],
		roleInChannel: 'Member',
		challengeStates: new Map(),
		challengesStatesForOpponent: new Map(),
		acceptedChallengesStates: null,
		channelType: 0,
		bannedChannel: []
	}),
	actions: {
		updateAcceptedChallengeState(newState) {
			this.acceptedChallengesStates = newState;
		},
		getAcceptedChallengeState() {
			return this.acceptedChallengesStates;
		},
		updateChallengeState(userId, newState) {
            this.challengeStates.set(userId, newState);
        },
        getChallengeState(userId) {
            return this.challengeStates.get(userId);
        },
		updateChallengeStateForOpponent(userId, newState) {
			this.challengesStatesForOpponent.set(userId, newState);
		},
		getChallengeStateForOpponent(userId) {
			return this.challengesStatesForOpponent.get(userId);
		},
		async setupCommunity() {
			const token = Cookies.get('token');
			const id = jwt_decode(token).sub;
	
			try {
				const allChannels = await getAllChannels();
				const channelsJoined = await getSubscribedChannels(id);
	
				this.joinedChannels = channelsJoined;
					
				const resChannels = allChannels.filter((channel) => {
					return !channelsJoined.some((joinedChannel) => channel.idChannel === joinedChannel.idChannel);
				});
	
				this.openChannels = resChannels;

				let j = 0;
				this.bannedChannel = [];

				for(let i = 0; this.openChannels[i] ; i++)
				{
					const users = await getChannelUsers(this.openChannels[i].idChannel);
					const user = users.find(user => user.idUser === id);
					if (user && user.role == "Banned")
					{
						this.bannedChannel[j] = this.openChannels[i]
						j++;
					}
				}

			} catch (error) {
				console.error("Error setting up available channels:", error);
			}
		},
		async updateSelectedChannel(channelID) {
			const token = Cookies.get('token');
			const id = jwt_decode(token).sub;
	
			try {
				const channel = await getChannel(channelID);
				this.channelType = channel.idType;

				const messages = await getChannelMsg(channelID);
				this.selectedChannelMsg = messages;
				
				const users = await getChannelUsers(channelID);
				const user = users.find(user => user.idUser === id);
				if (user) {
					if (user.owner)
						this.roleInChannel = "Owner";
					else
						this.roleInChannel = user.role;
				}
				this.selectedChannelUsers = users;
			} catch (error) {
				console.error("Error fetching channel's messages:", error);
			}
		},
		async setupNewChannel(name: string, type: number, password: string) {
			const token = Cookies.get('token');
			const id = jwt_decode(token).sub;
	
			try {
				await postNewChannelsData(id, name, type, password);
			} catch (error) {
				console.error("Error creating a new channel:", error);
			}
		}
	}
});