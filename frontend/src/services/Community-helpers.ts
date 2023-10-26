import api from './api';


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
		const res = await api.post('/userchannels', {
			idUser: userID,
			idChannel: channelID,
			password: pw,
		})
	} catch (error) {
		console.error('Error joining channel: ', error);
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

export const sendMessageTo = async (body) => {
	try {
		const res = await api.post('/messages', body);
		return res;
	} catch (error) {
		console.error('Error posting message', error);
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

