<!-- 
	TO DO

	- Websocket msg
	- Online / offline players
	- players buttons functionnality:
		* PLAY
		* PROFILE
		* DM
		* add friend
		* BLOCK

		IF ADMIN
		* KICK/BAN/MUTE

 -->



<template>
	<div class="flex">

		<!-- Find Users -->
		<!-- <div class="mb-4">
		<h3 class="text-lg font-semibold">Find users</h3>
		<select class="p-2 w-1/3 border rounded-lg">
			<option v-for="usernames in communityStore.getUsernames()">{{ usernames }}</option>
		</select>
		<button @click="findUser" class="mt-2 bg-blue-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">Find</button>
		</div> -->

		<!-- Send Private Message -->
		<!-- <div class="mb-4">
		<h3 class="text-lg font-semibold">Send Private Message To</h3>
		<select class="p-2 w-1/3 border rounded-lg">
			<option v-for="usernames in communityStore.getUsernames()">{{ usernames }}</option>
		</select>
		<button @click="sendPrivateMessage" class="mt-2 bg-blue-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">Send</button>
		</div> -->



		<!-- Create Channel -->
		<div  class="mb-4 flex flex-col w-1/4">

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
					<li v-for="channel in openChannels" class="mb-2 border px-2 py-1 rounded-lg" >		
						<div class="text-lg flex flex-row ">
							<div class="w-2/3 overflow-x-auto">{{ channel.name }}</div>
							<button 
								:id="channel.idChannel" 
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
							<img :src="getChannelTypeImg(channel.idType)" alt="channType">
						</div>
						<div class="flex justify-end">
							<input
								v-if="channel.idType === 1"
								v-model="pwInput[channel.idChannel]"
								type="text"
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
									:id="channel.idChannel"
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
						<div class="flex justify-end py-2">

							<button
								@click="leaveOrDeleteChannel"
								class="border rounded-lg px-2 py-1 bg-red-200"
							>
								{{ roleInChannel === "Owner" ? 'Delete Channel' : 'Leave Channel' }}
							</button>
						</div>
					</div>
						
					<div v-if="selectedChannelID" class="">
						<ul class="h-128 overflow-y-auto">
							<li v-for="msg in selectedChannelMsg" class="flex flex-row">
								<p class="mr-2 text-lg text-blue-500"> {{ msg.username }}:</p>
								<p class="text-lg overflow-x-auto"> {{ msg.content }}</p>
							</li>
						</ul>
					</div>
						<div v-if="selectedChannelID" class="mt-auto">
							<input
								v-model="newMessage"
								type="text"
								placeholder="Send a message"
								class="p-2 w-5/6 border rounded-lg"
							/>
							<button @click="sendMessage" class="mt-2 w-1/6 bg-blue-500 text-white px-4 py-2 rounded-lg">Send</button>
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
								class="text-lg  border px-2 py-1 rounded-lg "
								
								:id="user.idUser"
							>
								<div v-if="isAcceptedChallengeActive(user.idUser).value" class="bg-green-500 rounded-lg p-2 flex justify-between items-center">
									<button @click="sendConfirmChallenge()" class="bg-white p-1 rounded">R</button>
									<span>{{ countReadyPlayers }} / 2</span>
								</div>
								<div v-else class="flex flex-row justify-between">

									<div class="flex items-center">
										<p :class="{'text-green-600': user.role === 'Admin', 'text-red-500': user.owner, }"	>
											{{ user.username }}
										</p>
										<div v-if="isChallengeActive(user.idUser).value" class="spinner-wrapper">
											<div class="spinner"></div>
										</div>
									</div>

									<button v-if="user.idUser != userID" @click="toggleDropDown(user.idUser)">
										<img src="../assets/elipsis-h.svg" alt="options">
									</button>
								</div>
								<div 
									v-if="dropDownOpen === user.idUser"
									class="border-t pt-2"
								>
									<div class="flex justify-between">
										<div v-if="isChallengeActiveForOpponent(user.idUser).value">
											<span>Waiting</span>
										</div>
										<div v-else-if="!isChallengeActive(user.idUser).value">
											<img @click="playerPlay(user.idUser)" class="cursor-pointer" title="play" src="../assets/player/play.svg" alt="play" >
											<router-link :to="'/otherprofile/id=' + user.idUser">
												<img class="cursor-pointer" title="profile" src="../assets/player/profile.svg" alt="profile">
											</router-link>
											<img @click="playerMessage" class="cursor-pointer" title="message" src="../assets/player/message.svg" alt="message">
											<img v-if="!isFriend(user.idUser)" @click="sendFriendRequest(user.username)" class="cursor-pointer" title="friend" src="../assets/player/friend.svg" alt="friend">
											<img @click="playerBlock(user.username)" class="cursor-pointer" title="block" src="../assets/player/block.svg" alt="block">
										</div>
										<div v-else>
											<button @click="answerToChallenge(user.idUser, 1)">A</button>
											<button @click="answerToChallenge(user.idUser, 0)">R</button>
										</div>
									</div>
									<!-- <div v-else class="flex justify-between">
									</div> -->
									<div v-if="roleInChannel === 'Admin' || roleInChannel === 'Owner'" class="flex justify-between mt-2 border-t pt-1">

										<div class="flex flex-row">

											<input
												v-model="muteTime"
												type="text"
												placeholder="seconds"
												class="p-1 w-16 border rounded-lg text-sm mr-2"
											/>
								
											<button @click="playerMute" :disabled="!muteTime">
												<img title="mute" src="../assets/player/mute.svg" alt="mute">
											</button>
										</div>
										<img @click="playerKick" class="cursor-pointer" title="kick" src="../assets/player/kick.svg" alt="kick">
										<img @click="playerBan" class="cursor-pointer" title="ban" src="../assets/player/ban.svg" alt="ban">
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
import { ref, onUnmounted, onMounted, computed, Ref } from 'vue'
import { useCommunityStore } from '../stores/CommunityStore'
import { useProfileStore } from '../stores/ProfileStore'
import { useLadderStore } from '../stores/UserProfileStore'
import { storeToRefs } from 'pinia'
import { joinChannel, sendMessageTo, leaveCurrentChannel, deleteCurrentChannel, banUserFromChannel, getChannelMsg, deleteMessage, mute, block } from '@/services/Community-helpers'
import { askChallenge, askChallengeState, challengeAnswer, askAcceptedChallengeState, confirmChallenge } from '@/services/matchmaking-helpers'

const usersIntervals = ref({});
const acceptedChallengeInterval = ref<number | null>(null);

onMounted(async () => {
    await communityStore.setupCommunity();

	acceptedChallengeInterval.value = setInterval(() => {
        askAcceptedChallengeState(profileStore.userID);
    }, 1000);
});

const sendConfirmChallenge = async () => {
	const acceptedChallengeState = communityStore.acceptedChallengesStates;
	if (!acceptedChallengeState) return ;

	confirmChallenge(profileStore.userID, profileStore.username);
};

const countReadyPlayers: Ref<number> = computed(() => {
	const acceptedChallengeState = communityStore.acceptedChallengesStates;
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

const isChallengeActive = (idUser: number): Ref<boolean> => {
	return computed(() => {
        const challengeState = communityStore.getChallengeState(idUser);
        return challengeState && challengeState.isChallengePending;
    });
};

const isChallengeActiveForOpponent = (idUser: number): Ref<boolean> => {
	return computed(() => {
		const challengeState = communityStore.getChallengeStateForOpponent(idUser);
        return challengeState && challengeState.isChallengePending;
	});
};

const startChallengeInterval = (friendId) => {
    stopChallengeInterval(friendId);
    usersIntervals.value[friendId] = setInterval(() => {
        askChallengeState(profileStore.userID, friendId);
    }, 1000);
};

const stopChallengeInterval = (friendId) => {
    if (usersIntervals.value[friendId]) {
        clearInterval(usersIntervals.value[friendId]);
        delete usersIntervals.value[friendId];
    }
};

onUnmounted(() => {
    Object.keys(usersIntervals.value).forEach(friendId => stopChallengeInterval(friendId));

	if (acceptedChallengeInterval.value !== null) {
        clearInterval(acceptedChallengeInterval.value);
        acceptedChallengeInterval.value = null;
    }
});

const communityStore = useCommunityStore();
const { openChannels, joinedChannels, selectedChannelMsg, selectedChannelUsers, roleInChannel } = storeToRefs(communityStore);

const profileStore = useProfileStore();
const { userID } = storeToRefs(profileStore);

const ladderStore = useLadderStore()

// ******** Create Channel

const noChannelName = ref(false);
const noChannelType = ref(false);
const noChannelPassword = ref(false);
const newChannelname = ref('');
const newChannelPassword = ref('');
const newChannelType = ref('public');

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

async function btnJoinChannel(event) {

	const idChannel = +event.target.id;
	const type = +event.target.getAttribute('channType');

	// if Private, send PW
	if (type === 1)
		await joinChannel(userID.value, idChannel, pwInput._value[idChannel]);
	else
		await joinChannel(userID.value, idChannel);
	await communityStore.setupCommunity();
}

// *************************************************

// *********** CHAT ROOM

const selectedChannelID = ref(null);
const scrollContainer = ref(null);
const newMessage = ref('');

async function selectChannel(channelID: string) {

	// Websocket connect here ?
	selectedChannelID.value = channelID;
	await communityStore.updateSelectedChannel(channelID);

	communityStore.selectedChannelUsers.forEach(user => {
        startChallengeInterval(user.idUser);
    });
	// scrollToSelectedTab();
}

// const scrollToSelectedTab = () => {
//   if (selectedChannelID.value) {
//     scrollContainer.value.scrollTop = selectedChannelID.value.offsetTop - scrollContainer.value.offsetTop;
//   };
// };

async function sendMessage() {
	// Also websocket pb, ping all connected users ?
	let body = {
		content: newMessage.value,
		idUser: userID.value,
		idChannel: selectedChannelID.value,
	}
	try {
		const res = await sendMessageTo(body);
		// update msg UI
	} catch (error) {
		console.error('Error sending message', error);
	}

	newMessage.value = '';

	await communityStore.updateSelectedChannel(selectedChannelID.value);
}

async function leaveOrDeleteChannel() {

	if (roleInChannel.value === "Owner") {
		// Confirmation popup, then
		const messages = await getChannelMsg(selectedChannelID.value);
		for (let i = 0; messages[i]; i++) {
			await deleteMessage(messages[i].idMessage);//removing all message from the channel to delete so it doesn't crash
		}
		const res = await deleteCurrentChannel(selectedChannelID.value);
		console.log(res);
		console.log("OWNER")
	}
	else {
		console.log("NOT OWNER")
		// roleInChannel IF OWNER, DO SMTH ELSE (delete? ADD popup are you sure ?)
		const res = await leaveCurrentChannel(userID.value, selectedChannelID.value);
		console.log(res);
	}
	selectedChannelID.value = null;
	await communityStore.setupCommunity();
}

// *************************************************

// *********** PLAYER LIST

const selectedUserID = ref(null);
const dropDownOpen = ref(null);
const muteTime = ref(null);

function toggleDropDown(playerID) {
	selectedUserID.value = playerID;
	if (dropDownOpen.value != playerID)
		dropDownOpen.value = playerID;
	else
		dropDownOpen.value = null;
}

function getChannelTypeImg(channType) {
	if (channType === 2)
		return "src/assets/public.svg";
	else if (channType === 1)
		return "src/assets/private.svg";
}

function playerPlay(idUser) {
	askChallenge(profileStore.userID, idUser);
}

// async function playerProfile() {
// 	console.log("profile");
// 	// Need profile implementation
// }
// async function playerMessage() {
// 	console.log("message");
// 	// Need websocket I believe
// }
// async function playerFriend() {
// 	console.log("friend");
// }

// async function playerBlock() {
// 	console.log("block");

// 	await block(userID.value, selectedUserID.value);
	
// }

const setAll = async () => {
	await ladderStore.setup(0)
	// showProfile.value = true // Set a flag to indicate that data is loaded
}
setAll()

function isFriend(friendId) {
	
	let friendList = ladderStore.getFriends();

	for(let i = 0; friendList[i]; i++)
	{
		if (friendList[i].idUser == friendId)
			return (true);
	}
	return (false);
}

async function sendFriendRequest(usernameToFriend) {
	
	const userData = await ladderStore.sendFriendRequest(usernameToFriend);
	// if (userData == "error caught")
	// 	cannotSendFriendRequest.value = true;
}

async function playerBlock(usernameToBlock) {

	await ladderStore.blockUnblock(usernameToBlock);
	console.log("Block / unblock")
	// refreshPage();
}

async function playerMute() {
	console.log("mute");

	// Adds to DB but doesnt mute ... (:
	await mute(selectedUserID.value, selectedChannelID.value, muteTime.value);
}
async function playerKick() {
	console.log("kick");

	const res = await leaveCurrentChannel(selectedUserID.value, selectedChannelID.value);
	console.log(res);
	await communityStore.updateSelectedChannel(selectedChannelID.value);
}

async function playerBan() {
	console.log("ban");

	await banUserFromChannel(ladderStore.getId(), selectedUserID.value, selectedChannelID.value);
	//await leaveCurrentChannel(selectedUserID.value, selectedChannelID.value);
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