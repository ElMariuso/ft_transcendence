<template>
	<div class="flex">

		<!-- Create Channel -->
		<div  class="mb-4 flex flex-col w-1/4">

			<div class="border-2 border-blue-500 px-4 py-2 rounded-lg">
				<h3 class="text-lg font-semibold border-b border-gray-400">Private message</h3>

				<input
					v-model="newUsername"
					type="text"
					placeholder="Enter user name"
					class="p-2 border rounded-lg mt-2 w-full"
				/>

				<div class="flex items-baseline">

					<button 
						@click="privateMessage('')"
						class="mt-4 bg-blue-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg mr-5"
					>
						Send
					</button>
					
					<div v-if="badUserName"> <h3 class="text-lg text-red-600 font-semibold">User not found</h3> </div>
					<div v-if="alone"> <h3 class="text-lg text-red-600 font-semibold">Try talking with someone, not yourself</h3> </div>
					<div v-if="block"> <h3 class="text-lg text-red-600 font-semibold">One of you blocked the other...</h3> </div>

				</div>
			</div>

			<div class="border-2 border-blue-500 px-4 py-2 rounded-lg">
				<h3 class="text-lg font-semibold border-b border-gray-400">Create Channel</h3>

				<input
					v-model="newChannelname"
					type="text"
					placeholder="Enter channel name"
					class="p-2 border rounded-lg mt-2 w-full"
				/>

				<select v-model="newChannelType" class="p-2 border rounded-lg mt-2 text-sm">
					<option value="public" class="">Public</option>
					<option value="private">Private</option>
				</select>

				<input
					v-model="newChannelPassword"
					type="password"
					placeholder="Enter password"
					:disabled="newChannelType==='public'"
					class="p-2 border rounded-lg mt-2 w-full"
				/>

				<div class="flex items-baseline">

					<button 
						@click="createChannel"
						class="mt-4 bg-blue-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg mr-5"
					>
						Create
					</button>
					
					<div v-if="noChannelName"> <h3 class="text-lg text-red-600 font-semibold">Name required</h3> </div>
					<div v-if="noChannelPassword"> <h3 class="text-lg text-red-600 font-semibold">Password required</h3> </div>

				</div>
			</div>

		<!-- Open Channels -->
			<div class="mt-5 border-2 border-blue-500 px-4 py-2 rounded-lg ">
				<h3 class="text-lg font-semibold border-b border-gray-400">Open Channels</h3>

				<ul class="mt-2 h-96 overflow-y-auto">
					<li v-for="channel in openChannels">		
						<div v-if="channel.idType !== 3" class="mb-2 border px-2 py-1 rounded-lg text-lg flex flex-row ">
							<div class="w-2/3 overflow-x-auto">{{ channel.name }}</div>
							<button 
								v-if="!isBanned(channel.idChannel)"
								:id="String(channel.idChannel)" 
								:channType="channel.idType" 
								@click="btnJoinChannel" 
								class="flex w-1/3"
								:class="{
									'text-blue-600': pwInput[channel.idChannel] || channel.idType !== 1,
									'text-gray-600': !pwInput[channel.idChannel] && channel.idType === 1,
								}"
								:disabled="!pwInput[channel.idChannel] && channel.idType === 1"
								
							>
								Join
							</button>
							<span v-if="isBanned(channel.idChannel)" class="text-red-600"> Banned </span>
							<img v-if="!isBanned(channel.idChannel)" :src="getChannelTypeImg(channel.idType)" alt="channType">
						</div>
						<div v-if="!isBanned(channel.idChannel)" class="flex justify-end">
							<input
								v-if="channel.idType === 1"
								v-model="pwInput[channel.idChannel]"
								type="password"
								placeholder="Enter password"
								class="px-2 border rounded-lg"
							/>
						</div>
					</li>
				</ul>
			</div>

		</div>


		<!--CHAT ROOM  -->
		<div class="flex flex-row w-3/4 pl-5">
			<div class="mb-4 flex flex-col w-2/3">
				<div class="border-2 border-blue-500 px-4 py-2 rounded-lg h-full">
					
					<div class="flex flex-row border-b border-gray-400">
						<div class="w-1/6 mr-5">
							<h3 class="text-lg font-semibold ">Rooms</h3>
						</div>

				
						<div class="overflow-y-auto" ref="scrollContainer">
							<ul class="flex flex-row">
								<button 
									:id="String(channel.idChannel)"
									v-for="channel in joinedChannels"
									class="mx-1 border rounded-lg px-2 py-1 max-w-tab min-w-tab truncate"
									:class="{ 
										'bg-blue-500 text-white': channel.idChannel === selectedChannelID,
										'bg-gray-300 text-black': !(channel.idChannel === selectedChannelID),
									}"
									@click="selectChannel(channel.idChannel)"
								> 
									{{channel.name}}
								</button>
							</ul>
						</div>
					
					</div>

					<div v-if="selectedChannelID" class="h-12 border-b px-2">
						<div class="chatDropDown flex justify-end py-2">
							<div @click="toggleDropdownChatSettings" class="cursor-pointer p-2">
								<img  src="../assets/gear.svg" alt="settings"/>
							</div>
							<div v-if="dropdownOpenChatSettings" class="absolute mt-10 w-48 bg-white border rounded-lg shadow-lg">
								
								<div v-if="roleInChannel === 'Owner' && channelType !== 3" >
									<a class="block px-2 py-1"> Change password: </a>
									<div class="flex flex-row justify-around block px-2 py-1 border-b">
										<input v-model="channelNewPw" type="password" placeholder="new pw" class="w-4/5 border rounded-lg px-2"/>
										<button @click="changeChannelPw"> <img src="../assets/confirm.svg" alt="Confirm"></button>
									</div>
									
									<a @click="removePW" class="block px-2 py-1 cursor-pointer hover:text-blue-500 border-b"> 
										Remove password
									</a>
								</div>
									
								<!-- Leave/delete channel -->
								<a 
									@click="leaveOrDeleteChannel" 
									class="block px-2 py-1 cursor-pointer hover:text-red-500"
								> 
									<span v-if="channelType !== 3">{{ roleInChannel === "Owner" ? 'Delete Channel' : 'Leave Channel' }} </span>
									<span v-if="channelType === 3">{{'Delete Channel'}}</span>
								</a>
							</div>
						</div>
					</div>
						
					<div v-if="selectedChannelID" class="">
						<ul class="h-chat overflow-y-auto">
							<li v-for="msg in selectedChannelMsg" class="flex flex-row">
								<p class="mr-2 text-lg text-blue-500"> {{ msg.username }}:</p>
								<p class="text-lg overflow-x-auto"> {{ msg.content }}</p>
							</li>
						</ul>
					</div>
					<span v-if="block2" class="text-lg text-red-600 font-semibold">One of you blocked the other... </span>
					<span v-if="muted" class="text-lg text-red-600 font-semibold">You might be muted, please wait a little </span>
						<div v-if="selectedChannelID" class="flex">
							<input
								v-model="newMessage"
								type="text"
								placeholder="Send a message"
								class="px-2 mr-2 w-5/6 border rounded-lg"
								@keyup.enter="newMessage && sendMessage()"
								
							/>
							<button 
								@click="sendMessage" 
								:disabled="!newMessage" 
								class="px-2 py-3 mr-2 w-1/6 bg-blue-500 text-white border rounded-lg"
								:class="{ 'bg-blue-500 text-white': newMessage, 'bg-gray-500': !newMessage }"
							>
								Send
							</button>
						</div>			
				</div>
			</div>
			

			<!-- PLAYER LIST -->
			<div class="mb-4 flex flex-col w-1/3">
				<div class="border-2 border-blue-500 px-4 py-2 rounded-lg ml-5">
					<h3 class="text-lg font-semibold border-b border-gray-400">Players</h3>
					
					<div class="mt-2 h-96 overflow-y-auto">

						<ul v-if="selectedChannelID">
							
							<li 
								v-for="user in selectedChannelUsers" 
								class="text-lg px-2 py-1 rounded-lg "
								
								:id="String(user.idUser)"
							>
							  <div v-if="user.role === 'Banned' && (roleInChannel === 'Admin' || roleInChannel === 'Owner')" class="text-lg border px-2 py-1 rounded-lg ">
								<div class="flex flex-row justify-between">
								  {{ user.username }}
								  	<div v-if="isChallengeActive(user.idUser).value" class="bg-white spinner-wrapper">
										<div class="spinner"> </div>
									</div>
								  <button v-if="String(user.idUser) !== userID" @click="toggleDropDown(user.idUser)">
									<img src="../assets/elipsis-h.svg" alt="options">
								  </button>
								</div>

								<div 
									v-if="dropDownOpen === user.idUser"
									class="border-t pt-2"
								>
									<div class="flex justify-between">>
										<img @click="playerUnBan" class="cursor-pointer" title="unban" src="../assets/player/unlock.svg" alt="unban">
									</div>
								</div>
							  </div>

							  <div v-if="user.role !== 'Banned'" class="text-lg border px-2 py-1 rounded-lg ">
								<div v-if="isAcceptedChallengeActive(user.idUser).value" class="bg-green-500 rounded-lg p-2 flex justify-between items-center">
									<button @click="sendConfirmChallenge()" class="bg-white p-1 rounded">Ready</button>
									<span>{{ countReadyPlayers }} / 2</span>
								</div>
								<div v-else class="flex flex-row justify-between">

									<div class="flex" v-if="channelType !== 3">
										<p 
											:class="{ 
												'text-green-600': user.role === 'Admin',
												'text-red-500': user.owner,
											}"	
											
										>
											{{ user.username }}
										</p>
										<button 
											v-if="roleInChannel === 'Owner' && user.role !== 'Admin'"
											@click="promoteUser(user.idUser)"
										>
											<img src="../assets/player/promote.svg" title="promote" class="px-1 py-1" alt="promote">
										</button>
									</div>
									<p v-if="channelType === 3" class="text-green-600">{{ user.username }}</p>

									<button v-if="String(user.idUser) != userID" @click="toggleDropDown(user.idUser)">
										<img src="../assets/elipsis-h.svg" alt="options">
									</button>
								</div>
								<div 
									v-if="dropDownOpen === user.idUser"
									class="border-t pt-2"
								>
									<div class="flex justify-between">
										<div v-if="isChallengeActiveForOpponent(user.idUser).value" class="flex">
											<span>Waiting</span>
										</div>
										<div v-else-if="!isChallengeActive(user.idUser).value" class="flex">
											<img @click="playerPlay(user.idUser)" class="cursor-pointer mr-2" title="play" src="../assets/player/play.svg" alt="play" >
											<router-link :to="'/otherprofile/id=' + user.idUser">
												<img class="cursor-pointer mr-2" title="profile" src="../assets/player/profile.svg" alt="profile">
											</router-link>
											<img v-if="channelType !== 3" @click="privateMessage(user.username)" class="cursor-pointer mr-2" title="message" src="../assets/player/message.svg" alt="message">
											<img v-if="!isFriendOrBlocked(user.idUser)" @click="sendFriendRequest(user.username)" class="cursor-pointer mr-2" title="friend" src="../assets/player/friend.svg" alt="friend">
											<img @click="playerBlock(user.username)" class="cursor-pointer mr-2" title="block" src="../assets/player/block.svg" alt="block">
										</div>
										<div v-else class="flex">
											<img @click="answerToChallenge(user.idUser, 1)" class="cursor-pointer mr-2" title="accept" src="../assets/accept.svg" alt="accept">
											<img @click="answerToChallenge(user.idUser, 0)" class="cursor-pointer mr-2" title="refuse" src="../assets/refuse.svg" alt="refuse">
										</div>
									</div>
									<div v-if="(channelType !== 3 && (roleInChannel === 'Admin' || roleInChannel === 'Owner') && !user.owner)" class="flex justify-between mt-2 border-t pt-1">

										<!-- Mute -->
										<div class="flex flex-row">
											<button @click="playerMute" :disabled="!muteTime">
												<img title="mute" src="../assets/player/mute.svg" alt="mute">
											</button>
											<input
												v-model="muteTime"
												type="text"
												placeholder="seconds"
												class="p-1 w-16 border rounded-lg text-sm ml-2"
											/>								
										</div>
										
										<img @click="playerKick" class="cursor-pointer" title="kick" src="../assets/player/kick.svg" alt="kick">
										<img @click="playerBan" class="cursor-pointer" title="ban" src="../assets/player/ban.svg" alt="ban">
									</div>
								</div>
							  </div>
									
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted, computed, Ref, watch } from 'vue'
import { useCommunityStore } from '../stores/CommunityStore'
import { useProfileStore } from '../stores/ProfileStore'
import { useLadderStore } from '../stores/UserProfileStore'
import { storeToRefs } from 'pinia'
import { joinChannel, sendMessageTo, leaveCurrentChannel, deleteCurrentChannel, updateUserRole, 
	getChannelMsg, deleteMessage, mute, getChannelUsers, creatDMChannel, promote, channelPrivToPub, modifyChannelPw } from '@/services/Community-helpers'
import { askChallenge, askChallengeState, challengeAnswer, askAcceptedChallengeState, confirmChallenge } from '@/services/matchmaking-helpers'
import api from '../services/api';

interface UserIntervals {
  [friendId: number]: ReturnType<typeof setInterval>;
}

const usersIntervals = ref<UserIntervals>({});
const acceptedChallengeInterval = ref<number | null>(null);
import { getBlockedListData } from '@/services/UserProfile-helpers'

let updateAvailableChannelInterval: any;

onMounted(async () => {
    await communityStore.setupCommunity();

	acceptedChallengeInterval.value = setInterval(() => {
		let id = parseInt(profileStore.userID, 10);
        askAcceptedChallengeState(id);
    }, 1000);

	updateAvailableChannelInterval = setInterval(async () => {
	await communityStore.setupCommunity();
	}, 500);
});

const sendConfirmChallenge = async () => {
	const acceptedChallengeState = communityStore.acceptedChallengesStates;
	if (!acceptedChallengeState) return ;
	let id = parseInt(profileStore.userID, 10);
	confirmChallenge(id, profileStore.username);
};

const countReadyPlayers: Ref<number> = computed(() => {
	const acceptedChallengeState: any = communityStore.acceptedChallengesStates;
	if (!acceptedChallengeState) return 0;

	let count = 0;
	const keys = Object.keys(acceptedChallengeState.isReady);
	for (const key of keys) {
		if (acceptedChallengeState.isReady[key]) {
			count++;
		}
	}
	return count;
});

const isAcceptedChallengeActive = (idUser: number): Ref<boolean> => {
	return computed(() => {
		const acceptedChallengeState = communityStore.acceptedChallengesStates;

		if (!acceptedChallengeState || acceptedChallengeState.opponentId === -1) {
			return false;
		}
		const isOpponentActive = acceptedChallengeState.opponentId === idUser;
		return isOpponentActive;
	});
};

const answerToChallenge = async (idUser: number, response: number) => {
	const challengeState = communityStore.getChallengeState(idUser);
	if (challengeState) {
		challengeAnswer(challengeState.challengerId, challengeState.opponentId, response);
	}
};

const isChallengeActive = (idUser: number): Ref<boolean | undefined> => {
	return computed(() => {
		const challengeState = communityStore.getChallengeState(idUser);
        return challengeState && challengeState.isChallengePending;
    });
};

const isChallengeActiveForOpponent = (idUser: number): Ref<boolean | undefined> => {
	return computed(() => {
		const challengeState = communityStore.getChallengeStateForOpponent(idUser);
        return challengeState && challengeState.isChallengePending;
	});
};

const startChallengeInterval = (friendId: number) => {
    stopChallengeInterval(friendId);
    usersIntervals.value[friendId] = setInterval(() => {
        askChallengeState(Number(profileStore.userID), friendId);
    }, 1000);
};

const stopChallengeInterval = (friendId: number) => {
    if (usersIntervals.value[friendId]) {
        clearInterval(usersIntervals.value[friendId]);
        delete usersIntervals.value[friendId];
    }
};

onUnmounted(() => {
    Object.keys(usersIntervals.value).forEach(friendId => stopChallengeInterval(Number(friendId)));

	if (acceptedChallengeInterval.value !== null) {
        clearInterval(acceptedChallengeInterval.value);
        acceptedChallengeInterval.value = null;
    }
	clearInterval(updateChannelInterval);
	clearInterval(updateAvailableChannelInterval);
});

const playerPlay = async (idUser: any) => {
	const isAnyChallengeActive = isChallengeActive(Number(profileStore.userID)).value || isAcceptedChallengeActive(Number(profileStore.userID)).value

	if (!isAnyChallengeActive) {
		askChallenge(Number(profileStore.userID), idUser);
	}
}

const communityStore = useCommunityStore();
const { openChannels, bannedChannel, joinedChannels, selectedChannelMsg, selectedChannelUsers, roleInChannel, channelType } = storeToRefs(communityStore);

const profileStore = useProfileStore();
const { userID, username } = storeToRefs(profileStore);

const ladderStore = useLadderStore()

// ******** Create Channel

const noChannelName = ref(false);
const noChannelType = ref(false);
const noChannelPassword = ref(false);
const badUserName = ref(false);
const alone = ref(false);
const block = ref(false);
const block2 = ref(false);
const muted = ref(false);
const newChannelname = ref('');
const newChannelPassword = ref('');
const newChannelType = ref('public');
const newUsername = ref('');

async function privateMessage(name : string) {
	const userFound = ref(false);
	const searchIdUser = ref(0);
	badUserName.value = false;
	alone.value = false;
	block.value = false;
	let blocklist = ladderStore.getBlockedList();

	if (name != '')
		newUsername.value = name;
	
	await api.get('/users')
	.then(res => {
		for (let i = 0; res.data[i]; i++) {
			if (newUsername.value == res.data[i].username)
			{
				searchIdUser.value = res.data[i].idUser;
				userFound.value = true;
			}
		}
	});
	if (userFound.value != true)
		badUserName.value = true;
	else if (newUsername.value == ladderStore.username)
		alone.value = true;

	for (let i = 0; blocklist[i]; i++) {
		if (newUsername.value == blocklist[i].username)
			block.value = true;
	}
	if (badUserName.value == true || alone.value == true || block.value == true)
		return ;
	
	blocklist = await getBlockedListData(String(searchIdUser.value))
	for (let i = 0; blocklist[i]; i++) {
		if (ladderStore.username == blocklist[i].username)
		{	
			block.value = true;
			return ;
		};
	}

	try {
		const res = await creatDMChannel(searchIdUser.value, ladderStore.getId())
	} catch (error) {
		console.error('Error creating dm', error);
	}

	newUsername.value = "";
	await communityStore.setupCommunity();
}

async function createChannel() {
	noChannelName.value = false;
	noChannelType.value = false;
	noChannelPassword.value = false;

	if (newChannelname.value.trim() == '')
		noChannelName.value = true;
	else if (newChannelType.value.trim() == '')
		noChannelType.value = true;
	else if (newChannelPassword.value.trim() == '' && newChannelType.value.trim() == 'private')
		noChannelPassword.value = true;
	else if (newChannelType.value.trim() == 'public')
		await communityStore.setupNewChannel(newChannelname.value, 2, newChannelPassword.value)
	else if (newChannelType.value.trim() == 'private')
		await communityStore.setupNewChannel(newChannelname.value, 1, newChannelPassword.value)

	newChannelname.value = "";
	newChannelType.value = "public";
	newChannelPassword.value = "";
	await communityStore.setupCommunity();
}

// *************************************************

// *********** Open Channels

const pwInput = ref([]);

async function btnJoinChannel(event: any) {

	const idChannel = +event.target.id;
	const type = +event.target.getAttribute('channType');

	// if Private, send PW
	if (type === 1)
		await joinChannel(Number(userID.value), idChannel, pwInput.value[idChannel]);
	else
		await joinChannel(Number(userID.value), idChannel);
	await communityStore.setupCommunity();
}

function isBanned(idChannel: any)
{
	for(let i = 0; bannedChannel.value[i]; i++)
	{
		if (idChannel === bannedChannel.value[i].idChannel)
		{	
			return (true);
		}
	}
	return (false);
}

// *************************************************

// *********** CHAT ROOM

const selectedChannelID: Ref<number | null> = ref(null);
const scrollContainer = ref(null);
const newMessage = ref('');
const dropdownOpenChatSettings = ref(false);
const channelNewPw = ref('');
let updateChannelInterval: any;

// Refreshes Chat + players list
watch(selectedChannelID, (newChannelID, oldChannelID) => {
    // Clear the existing interval when selectedChannelID is reset
    if (newChannelID !== oldChannelID || newChannelID === null) {
		clearInterval(updateChannelInterval);
    }

    // Start the interval when selectedChannelID is set
	updateChannelInterval = setInterval(async () => {
		if (!(selectedChannelUsers.value.some(user => user.username === username.value)) || roleInChannel.value === 'Banned')
			selectedChannelID.value = null;
		await communityStore.updateSelectedChannel(newChannelID);
	}, 500);
});

function toggleDropdownChatSettings() {
	dropdownOpenChatSettings.value = !dropdownOpenChatSettings.value;
}

watch(dropdownOpenChatSettings, (isOpen) => {
	if (isOpen) {
		window.addEventListener('click', closeDropdownOnClick);
	} else {
		window.removeEventListener('click', closeDropdownOnClick);
	}
});

const closeDropdownOnClick = (event: any) => {
	if (dropdownOpenChatSettings.value && !event.target.closest('.chatDropDown')) {
		dropdownOpenChatSettings.value = false;
	}
};

async function selectChannel(channelID: any) {

	selectedChannelID.value = channelID;
	await communityStore.updateSelectedChannel(channelID);

	communityStore.selectedChannelUsers.forEach(user => {
        startChallengeInterval(user.idUser);
    });
}

async function checkForBlock(idChannel: any)
{
	let users = await getChannelUsers(idChannel);

	let blocklist = await getBlockedListData(users[0].idUser)
	for (let i = 0; blocklist[i]; i++) {
		if (users[1].username == blocklist[i].username)
		{	
			return (false)
		}
	}
	
	blocklist = await getBlockedListData(users[1].idUser)
	for (let i = 0; blocklist[i]; i++) {
		if (users[0].username == blocklist[i].username)
		{	
			return (false)
		}
	}
	return (true)
}

async function sendMessage() {
	block2.value = false;
	muted.value = false;

	if (channelType.value === 3)
	{
		const res = await checkForBlock(selectedChannelID.value);
		if (res == false)
		{
			newMessage.value = '';
			block2.value = true;
			return ;
		}
	}

	let body = {
		content: newMessage.value,
		idUser: userID.value,
		idChannel: selectedChannelID.value,
	}
	try {
		const res = await sendMessageTo(body);
	} catch (error: any) {
		if (error.message == "Request failed with status code 400")
			muted.value = true;
		console.error('Error sending message', error);
	}

	newMessage.value = '';

	await communityStore.updateSelectedChannel(selectedChannelID.value);
}

async function leaveOrDeleteChannel() {

	if (roleInChannel.value === "Owner" || channelType.value === 3) {
		const messages = await getChannelMsg(selectedChannelID.value);
		if (messages) {

			for (let i = 0; messages[i]; i++) {
				await deleteMessage(messages[i].idMessage); //removing all message from the channel to delete so it doesn't crash
			}
		}
		await deleteCurrentChannel(selectedChannelID.value);
	}
	else {
		try {

			await leaveCurrentChannel(userID.value, selectedChannelID.value);
		} catch (error) {
			console.log("Error leaving channel: ", error);
		}
	}
	selectedChannelID.value = null;
	await communityStore.setupCommunity();
}

async function removePW() {
	await channelPrivToPub(userID.value, selectedChannelID.value);
}

async function changeChannelPw() {
	await modifyChannelPw(userID.value, selectedChannelID.value, channelNewPw.value);
}


// *************************************************

// *********** PLAYER LIST

const selectedUserID = ref(null);
const dropDownOpen = ref(null);
const muteTime = ref(null);

function toggleDropDown(playerID: any) {
	selectedUserID.value = playerID;
	if (dropDownOpen.value != playerID)
		dropDownOpen.value = playerID;
	else
		dropDownOpen.value = null;
}

function getChannelTypeImg(channType: any) {
	if (channType === 2)
		return "src/assets/public.svg";
	else if (channType === 1)
		return "src/assets/private.svg";
}

const setAll = async () => {
	await ladderStore.setup(0)
}
setAll()

function isFriendOrBlocked(friendId: any) {
	
	let friendList = ladderStore.getFriends();
	let blockList = ladderStore.getBlockedList();

	for(let i = 0; friendList[i]; i++)
	{
		if (friendList[i].idUser == friendId)
			return (true);
	}
	for(let i = 0; blockList[i]; i++)
	{
		if (blockList[i].idUser == friendId)
			return (true);
	}
	return (false);
}

async function sendFriendRequest(usernameToFriend: any) {
	await ladderStore.sendFriendRequest(usernameToFriend);
}

async function playerBlock(usernameToBlock: any) {
	await ladderStore.blockUnblock(usernameToBlock);
}

async function playerMute() {
	await mute(selectedUserID.value, selectedChannelID.value, muteTime.value);
	muteTime.value = null;
}
async function playerKick() {
	await leaveCurrentChannel(selectedUserID.value, selectedChannelID.value);
	await communityStore.updateSelectedChannel(selectedChannelID.value);
}

async function playerUnBan() {
	await updateUserRole(String(ladderStore.getId()), selectedUserID.value, selectedChannelID.value, 2);
	await communityStore.updateSelectedChannel(selectedChannelID.value);
}

async function playerBan() {
	await updateUserRole(String(ladderStore.getId()), selectedUserID.value, selectedChannelID.value, 3);
	await communityStore.updateSelectedChannel(selectedChannelID.value);
}

async function promoteUser(idPromoted: any) {
	await promote(idPromoted, selectedChannelID.value, userID.value)
	await communityStore.updateSelectedChannel(selectedChannelID.value);
}
</script>

<style scoped>
.spinner-wrapper {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 1vh;
	margin-left: 3px !important;
}
  
.spinner {
    width: 0.75rem;
    height: 0.75rem;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #3498db;
    border-radius: 50%;
    animation: spin 2s linear infinite;
}
  
@keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
}

.checkmark {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: #fff;
    stroke-miterlimit: 10;
    box-shadow: inset 0px 0px 0px #7ac142;
    animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
    position: relative;
    transform: rotate(-45deg);
}

.checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: green;
    fill: none;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
    100% {
        stroke-dashoffset: 0;
    }
}

@keyframes scale {
    0%, 100% {
        transform: none;
    }
    50% {
        transform: scale3d(1.1, 1.1, 1);
    }
}

@keyframes fill {
    100% {
        box-shadow: inset 0px 0px 0px 30px green;
    }
}
</style>