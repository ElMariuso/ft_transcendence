import { defineStore } from 'pinia'
import { ref } from 'vue'
// import axios from 'axios';
import jwt_decode from 'jwt-decode';

import { getMessageData } from '@/services/Channel-helpers'
import { getChannelData } from '@/services/Channel-helpers'
import { postNewMessageData } from '@/services/Channel-helpers'


export const useChannelStore = defineStore('channel', () => {

	const channelID = ref("-1");
	const message = ref(['test', 'retest']);
	const channelName = ref("defaultchannelname");
	const idOwner = ref(0);
	const userID = ref(0)

	/////////////////// CHANNEL ID ////////////////////////

	function setChannelId(newId: Number) {
		channelID.value = newId.toString();
	}

	function getChannelId() {
		return channelID.value;
	}

	/////////////////// GET MESSAGE ////////////////////////

	async function setupMessage() {
		// const token = localStorage.getItem('token')
		// const id = jwt_decode(token).sub;
		// userID.value = id;

		// console.log (channelID.value);
		if (channelID != "-1")
		{
			try {
				const userData = await getMessageData(channelID.value);
				setMessage(userData);
			} catch (error) {
				console.error("Error setting up message:", error);
			}
		}
	}

	function setMessage(newList : any) {
		message.values = newList;
	}

	function getMessage() {
		return message.values;
	}

	/////////////////// POST MESSAGE ////////////////////////

	async function sendNewMessage(content : string) {
		const token = localStorage.getItem('token')
		const id = jwt_decode(token).sub;
		userID.value = id;

		try {
			const userData = await postNewMessageData(id, content, channelID.value);
		} catch (error) {
			console.error("Error creating a new message:", error);
		}
	}

	/////////////////// CHANNEL ////////////////////////

	async function setupChannel() {
		// const token = localStorage.getItem('token')
		// const id = jwt_decode(token).sub;
		// userID.value = id;

		// console.log (channelID.value);

		
		if (channelID != "-1")
		{
			console.log("Setup channel value != -1")
			console.log(channelID.value)
			try {
				const userData = await getChannelData(channelID.value);
				setChannelName(userData.name);
				setChannelidOwner(userData.idOwner);
			} catch (error) {
				console.error("Error setting up Channel:", error);
			}
		}
	}

	function setChannelName(newChannelname: string) {
		// console.log ("newChannelname");
		channelName.value = newChannelname;
		// console.log (channelName.value);
	}

	function setChannelidOwner(newChannelidOwner: number) {
		// console.log ("newChannelidOwner");
		idOwner.value = newChannelidOwner;
		// console.log (idOwner.value);
	}


	return {channelName, setChannelId, getChannelId, setupMessage, getMessage, sendNewMessage, setupChannel}
})