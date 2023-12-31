import jwt_decode, {JwtPayload} from 'jwt-decode';
import Cookies from 'js-cookie';
import { defineStore } from 'pinia'
import { getAllChannels, getSubscribedChannels, postNewChannelsData, getChannelMsg, getChannelUsers, getChannel } from '@/services/Community-helpers'
import { useLadderStore } from "@/stores/UserProfileStore";
import { Channel, Msg, UserInChannel, ChallengeState, AcceptedChallengeState } from '@/models/community.model'

interface CommunityStoreState {
	openChannels: Array<Channel>; // Replace SomeType with the actual type of openChannels
	joinedChannels: Array<Channel>; // Replace SomeType with the actual type of joinedChannels
	selectedChannelMsg:  Array<Msg>; // Replace SomeType with the actual type of selectedChannelMsg
	selectedChannelUsers:  Array<UserInChannel>; // Replace SomeType with the actual type of selectedChannelUsers
	roleInChannel: string; // Replace string with the actual type of roleInChannel
	challengeStates: Map<number, ChallengeState>; // Replace SomeKeyType and SomeValueType with the actual types
	challengesStatesForOpponent: Map<number, ChallengeState>; // Replace SomeKeyType and SomeValueType with the actual types
	acceptedChallengesStates: AcceptedChallengeState | null; // Replace SomeType with the actual type
	channelType: number;
	bannedChannel: Array<Channel>; // Replace SomeType with the actual type of bannedChannel
	tmpbannedChannel: Array<Channel>;
}

export const useCommunityStore = defineStore('community', {
	state: (): CommunityStoreState => ({
		openChannels: [],
		joinedChannels: [],
		selectedChannelMsg: [],
		selectedChannelUsers: [],
		roleInChannel: 'Member',
		challengeStates: new Map(),
		challengesStatesForOpponent: new Map(),
		acceptedChallengesStates: null,
		channelType: 0,
		bannedChannel: [],
		tmpbannedChannel: []
	}),
	actions: {
		updateAcceptedChallengeState(newState: any) {
			this.acceptedChallengesStates = newState;
		},
		getAcceptedChallengeState() {
			return this.acceptedChallengesStates;
		},
		updateChallengeState(userId: any, newState: any) {
            this.challengeStates.set(userId, newState);
        },
        getChallengeState(userId: any) {
            return this.challengeStates.get(userId);
        },
		updateChallengeStateForOpponent(userId: any, newState: any) {
			this.challengesStatesForOpponent.set(userId, newState);
		},
		getChallengeStateForOpponent(userId: any) {
			return this.challengesStatesForOpponent.get(userId);
		},
		async setupCommunity() {
			const token: any = Cookies.get('token');
			const decodedToken: JwtPayload = jwt_decode(token);
			const id: any = decodedToken.sub;
	
			try {
				const channelsJoined = await getSubscribedChannels(id);
				const allChannels = await getAllChannels();
	
				this.joinedChannels = channelsJoined;
					
				const resChannels = allChannels.filter((channel: any) => {
					return !channelsJoined.some((joinedChannel: any) => channel.idChannel === joinedChannel.idChannel);
				});
	
				this.openChannels = resChannels;

				let j = 0;
				this.tmpbannedChannel = [];

				for(let i = 0; this.openChannels[i] ; i++)
				{
					const users = await getChannelUsers(String(this.openChannels[i].idChannel));
					const user: UserInChannel = users.find((user: UserInChannel) => user.idUser === id);
					if (user && user.role == "Banned")
					{
						this.tmpbannedChannel[j] = this.openChannels[i]
						j++;
					}
				}
				this.bannedChannel = this.tmpbannedChannel;

			} catch (error) {
				console.error("Error setting up available channels:", error);
			}
		},
		async updateSelectedChannel(channelID: any) {
			const token: any = Cookies.get('token');
			const decodedToken: JwtPayload = jwt_decode(token);
			const id: any = decodedToken.sub;
			
			const ladderStore = useLadderStore();


			try {
				if (channelID)
				{
					const channel = await getChannel(channelID);
					if (!channel)
					{	
						this.channelType = 0;
						this.selectedChannelMsg = [];
						this.roleInChannel = "Member";
						this.selectedChannelUsers = [];
						return ;
					}
					this.channelType = channel.idType;

					const messages = await getChannelMsg(channelID);

					const filteredMessages = messages.filter(message => {
						return !ladderStore.blocked.some(blockedUser => blockedUser.idUser === message.idUser);
					  });

					this.selectedChannelMsg = filteredMessages;
				
					const users = await getChannelUsers(channelID);
					const user = users.find((user: any) => user.idUser === id);
					if (user) {
						if (user.owner)
							this.roleInChannel = "Owner";
						else
							this.roleInChannel = user.role;
					}
					this.selectedChannelUsers = users;
				}
			} catch (error) {
				console.error("Error updating channels:", error);
			}
		},
		async setupNewChannel(name: string, type: number, password: string) {
			const token: any = Cookies.get('token');
			const decodedToken: JwtPayload = jwt_decode(token);
			const id: any = decodedToken.sub;
	
			try {
				await postNewChannelsData(id, name, type, password);
			} catch (error) {
				console.error("Error creating a new channel:", error);
			}
		}
	}
});