import api from './api';


/**
 * Asynchronous function to retrieve message data from the API.
 * 
 * This function sends a GET request to the `/channels/allMessages/{channelID}` endpoint and 
 * returns the response data. If an error occurs during the request, it logs 
 * the error message to the console and re-throws the error to be handled by 
 * the calling function.
 *
 * @param {string} channelID - The unique identifier of the channel.
 * @returns {Promise<Object>} - A promise that resolves to the message data.
 */
export const getMessageData = async (channelID) => {
    try {
        const response = await api.get('/channels/allMessages/' + channelID);
        return response.data;
    } catch (error) {
        console.error('Error fetching message data:', error);
        throw error;
    }
};

/**
 * Asynchronous function to retrieve channel data from the API.
 * 
 * This function sends a GET request to the `/channels/{channelID}` endpoint and 
 * returns the response data. If an error occurs during the request, it logs 
 * the error message to the console and re-throws the error to be handled by 
 * the calling function.
 *
 * @param {string} channelID - The unique identifier of the channel.
 * @returns {Promise<Object>} - A promise that resolves to the channel data.
 */
 export const getChannelData = async (channelID) => {
    try {
		// console.log(channelID)
        const response = await api.get('/channels/' + channelID);
        return response.data;
    } catch (error) {
        console.error('Error fetching channel data:', error);
        throw error;
    }
};

/**
 * Asynchronous function to create a new message data from the API.
 * 
 * This function sends a POST request to the `/messages` endpoint and 
 * returns the response data. If an error occurs during the request, it logs 
 * the error message to the console and re-throws the error to be handled by 
 * the calling function.
 *
 * @param {number} userID - The unique identifier of the user.
 * @param {string} content - The content of the new message.
 * @param {number} channelID - The unique identifier of the channel.
 * @returns {Promise<Object>} - A promise that resolves to the new channel data.
 */
export const postNewMessageData = async (userID, content, channelID) => {
    try {
		var id: number = +channelID;
        const response = await api.post('/messages', {
			"content": content,
			"idUser": userID,
			"idChannel": id,
				})
        return response.data;
    } catch (error) {
        console.error('Error creating a new channel data:', error);
        throw error;
    }
};