import api from './api';
// import bcrypt from 'bcrypt';
// const bcrypt = require("bcrypt")

/**
 * Asynchronous function to retrieve usernames data from the API.
 * 
 * This function sends a GET request to the `/users/usernames` endpoint and 
 * returns the response data. If an error occurs during the request, it logs 
 * the error message to the console and re-throws the error to be handled by 
 * the calling function.
 *
 * @param {string} userID - The unique identifier of the user.
 * @returns {Promise<Object>} - A promise that resolves to the usernames data.
 */
export const getUsernamesData = async (userID) => {
    try {
        const response = await api.get('/users/usernames');
        return response.data;
    } catch (error) {
        console.error('Error fetching usernames data:', error);
        throw error;
    }
};

/**
 * Asynchronous function to retrieve available channel data from the API.
 * 
 * This function sends a GET request to the `/userchannels/{userID}` endpoint and 
 * returns the response data. If an error occurs during the request, it logs 
 * the error message to the console and re-throws the error to be handled by 
 * the calling function.
 *
 * @param {string} userID - The unique identifier of the user.
 * @returns {Promise<Object>} - A promise that resolves to the available channel data.
 */
 export const getAvailableChannelsData = async (userID) => {
    try {
        const response = await api.get('/userchannels/' + userID);
        return response.data;
    } catch (error) {
        console.error('Error fetching available channel data:', error);
        throw error;
    }
};


export const getAllChannels = async () => {
    try {
        const response = await api.get('/channels/');
        return response.data;
	} catch (error) {
        console.error('Error fetching channels:', error);
        throw error;
    }
};

export const getSubscribedChannels = async (userID) => {
	try {
        const response = await api.get('/userchannels/' + userID);
        return response.data;
	} catch (error) {
        console.error('Error fetching channels:', error);
        throw error;
    }
}

export const joinChannel = async (userID: number, channelID: number, pw: string="") => {
	try {

		let body = {
			"idUser": userID,
			"idChannel": channelID,
			...(pw !== "" ? { "password": pw } : {}),
		}

		// if (pw != "")
		// 	body.password = pw;

		console.log("body")
		console.log(body)
		const res = await api.post('/userchannels/', body)
	} catch (error) {
		console.error('Error joining channel: ', error);
		throw error;
	}
}

export const getChannel = async (channelID) => {
	try {
		const res = await api.get('/channels/' + channelID);
		return res.data;
	} catch (error) {
		console.error('Error fetching specific channel', error);
		throw error;
	}
}

export const getChannelMsg = async (channelID) => {
	try {
		const res = await api.get('/channels/allMessages/' + channelID);
		return res.data;
	} catch (error) {
		console.error('Error fetching messages', error);
		throw error;
	}
}

export const getChannelUsers = async (channelID) => {
	try {
		const res = await api.get('/channels/allUsers/' + channelID);
		return res.data;
	} catch (error) {
		console.error('Error fetching channel users', error);
		throw error;
	}
}

export const sendMessageTo = async (body) => {
	try {
		const res = await api.post('/messages', body);
		return res;
	} catch (error) {
		console.error('Error posting message', error);
		throw error;
	}
}

export const creatDMChannel = async (id1 : number, id2) => {
	try {
		let body = {
			"idUser": id1,
			"idUser2": id2
		}
		const res = await api.post('/channels/createDM', body);
		return res;
	} catch (error) {
		console.error('Error creating dm', error);
		throw error;
	}
}

export const leaveCurrentChannel = async (idUser, idChannel) => {
	try {

		const res = await api.delete('/userchannels/delete/' + idUser + '/' + idChannel);
		return res;
	} catch (error) {
		console.error('Error leaving channel', error);
		throw error;
	}
}

export const updateUserRole = async (idUser, banId, idChannel, newRole) => {
	try {

		const res = await api.put('/userchannels/modifyRole/' + idUser,{
			"idMember": banId,
			"idChannel": idChannel,
			"idRole": newRole,
			})
		return res;
	} catch (error) {
		console.error('Error banning user from channel', error);
		throw error;
	}
}

export const deleteCurrentChannel = async (idChannel) => {
	try {
		const res = await api.delete('/channels/delete/' + idChannel);
		return res;
	} catch (error) {
		console.error('Error leaving channel', error);
		throw error;
	}
}

export const deleteMessage = async (idMessage) => {
	try {
		const res = await api.delete('/messages/delete/' + idMessage);
		return res;
	} catch (error) {
		console.error('Error deleting message', error);
		throw error;
	}
}

/**
 * Asynchronous function to create a new channel data from the API.
 * 
 * This function sends a POST request to the `/channels` endpoint and 
 * returns the response data. If an error occurs during the request, it logs 
 * the error message to the console and re-throws the error to be handled by 
 * the calling function.
 *
 * @param {string} userID - The unique identifier of the user.
 * @param {string} newName - The name of the new channel.
 * @param {number} newType - The type of the new channel.
 * @param {string} newPassword - The password of the new channel.
 * @returns {Promise<Object>} - A promise that resolves to the new channel data.
 */
 export const postNewChannelsData = async (userID, newName, newType, newPassword) => {
    try {
		var id: number = +userID;

		console.log("newType: " + newType)
        const response = await api.post('/channels', {
			"name": newName,
			"password": newPassword,
			"idOwner": id,
			"idType": newType
		})
        return response.data;
    } catch (error) {
        console.error('Error creating a new channel data:', error);
        throw error;
    }
};

export const channelPrivToPub = async (userID, channelID) => {
	const res = await api.put('channels/update/' + userID, {
		idChannel: channelID,
		idType: 2 // Public
	})
};

export const modifyChannelPw = async (userID, channelID, pw) => {
	const res = await api.put('channels/update/' + userID, {
		idChannel: channelID,
		idType: 1, // Private
		password: pw
	})

	console.log(res)
};

// Player actions

export const play = async () => {
	console.log("play");
	// Need game implementation
}
export const profile = async () => {
	console.log("profile");
	// Need profile implementation
}
export const message = async () => {
	console.log("message");
	// Need websocket I believe
}
export const friend = async () => {
	console.log("friend");
}
export const block = async (id, blockId) => {
	const res = await api.post('users/' + id + "/blockUser", {
		idBlock: blockId,
	});
	console.log(res);
}
export const mute = async (user, channel, time) => {
	await api.put('/userchannels/addMuteTime', {
		idUser: user,
		idChannel: channel,
		muteTime: time
	});
}

// export const kick = async () => {
// 	console.log("kick");
// }
// export const ban = async () => {
// 	console.log("ban");
// }

export const promote = async (idPromoted, idCurrentChannel, userID) => {
	const res = await api.put('/userchannels/modifyRole/' + userID, {
		idMember: idPromoted,
		idChannel: idCurrentChannel,
		idRole: 1,
	})

	console.log("Promote: ")
	console.log(res);
}
