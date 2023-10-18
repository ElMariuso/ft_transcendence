import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios';
import jwt_decode from 'jwt-decode';


export const useChannelStore = defineStore('channel', () => {

	// const userID = ref(0)
	// const usernames = ref(['test', 'retest']);
	// const friends = ref(['test', 'retest']);
	const channelID = ref(0)

	// async function setupChannel() : Promise<null>{
	// 	const token = localStorage.getItem('token')
	// 	const id = jwt_decode(token).sub;
	// 	userID.value = ref(id);

	// 	await axios.get('/users/usernames', {
	// 		headers: {
	// 			Authorization: 'Bearer ' + token
	// 		}
	// 	}).then(res => {
	// 		setList(res.data);
	// 	});
	// 	return null;
	// }

	// async function setupFriends() : Promise<null>{
	// 	const token = localStorage.getItem('token')
	// 	const id = jwt_decode(token).sub;
	// 	userID.value = ref(id);

	// 	if (id) {

	// 		await axios.get('/users/' + id + '/friends', {
	// 			headers: {
	// 				Authorization: 'Bearer ' + token
	// 			}
	// 		}).then(res => {
	// 			setFriends(res.data);
	// 		});
	// 	}
	// 	return null;
	// }

	function setChannelId(newId: Number) {
		channelID.value = newId;
	}

	function getChannelId() {
		return channelID.values;
	}

	// function setFriends(newList: string[]) {
	// 	friends.values = newList;
	// }

	// function getFriends() {
	// 	return friends.values;
	// }

	// function setList(newList: string[]) {
	// 	usernames.values = newList;
	// }

	// function getUsernames() {
	// 	return usernames.values;
	// }

	return {setChannelId, getChannelId}
})