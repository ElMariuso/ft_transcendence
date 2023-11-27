import api from './api';


/**
 * Asynchronous function to retrieve ladder data from the API.
 * 
 * This function sends a GET request to the `/users/ladder/{userID}` endpoint and 
 * returns the response data. If an error occurs during the request, it logs 
 * the error message to the console and re-throws the error to be handled by 
 * the calling function.
 *
 * @param {string} userID - The unique identifier of the user.
 * @returns {Promise<Object>} - A promise that resolves to the ladder data.
 */
export const getLadderData = async (userID : string) => {
    try {
        const response = await api.get('/users/ladder/' + userID);
        return response.data;
    } catch (error) {
        console.error('Error fetching ladder data:', error);
        throw error;
    }
};

/**
 * Asynchronous function to retrieve user data from the API.
 * 
 * This function sends a GET request to the `/users/{userID}` endpoint and 
 * returns the response data. If an error occurs during the request, it logs 
 * the error message to the console and re-throws the error to be handled by 
 * the calling function.
 *
 * @param {string} userID - The unique identifier of the user.
 * @returns {Promise<Object>} - A promise that resolves to the user data.
 */
 export const getUserData = async (userID : string) => {
    try {
        const response = await api.get('/users/user/' + userID);
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

/**
 * Asynchronous function to retrieve all user data from the API.
 * 
 * This function sends a GET request to the `/users` endpoint and 
 * returns the response data. If an error occurs during the request, it logs 
 * the error message to the console and re-throws the error to be handled by 
 * the calling function.
 *
 * @returns {Promise<Object>} - A promise that resolves to all the users data.
 */
 export const getAllUserData = async () => {
    try {
        const response = await api.get('/users/');
        return response.data;
    } catch (error) {
        console.error('Error fetching all users data:', error);
        throw error;
    }
};

/**
 * Asynchronous function to retrieve stats data from the API.
 * 
 * This function sends a GET request to the `/games/stats/{userID}` endpoint and 
 * returns the response data. If an error occurs during the request, it logs 
 * the error message to the console and re-throws the error to be handled by 
 * the calling function.
 *
 * @param {string} userID - The unique identifier of the user.
 * @returns {Promise<Object>} - A promise that resolves to the stats data.
 */
 export const getStatsData = async (userID : string) => {
    try {
        const response = await api.get('/games/stats/' + userID);
        return response.data;
    } catch (error) {
        console.error('Error fetching stats data:', error);
        throw error;
    }
};

/**
 * Asynchronous function to retrieve achievements data from the API.
 * 
 * This function sends a GET request to the `/achievements/{userID}` endpoint and 
 * returns the response data. If an error occurs during the request, it logs 
 * the error message to the console and re-throws the error to be handled by 
 * the calling function.
 *
 * @param {string} userID - The unique identifier of the user.
 * @returns {Promise<Object>} - A promise that resolves to the achievements data.
 */
 export const getAchievementsData = async (userID : string) => {
    try {
        const response = await api.get('/achievements/' + userID);
        return response.data;
    } catch (error) {
        console.error('Error fetching achievements data:', error);
        throw error;
    }
};

/**
 * Asynchronous function to retrieve games data from the API.
 * 
 * This function sends a GET request to the `/games/allGamesUser/{userID}` endpoint and 
 * returns the response data. If an error occurs during the request, it logs 
 * the error message to the console and re-throws the error to be handled by 
 * the calling function.
 *
 * @param {string} userID - The unique identifier of the user.
 * @returns {Promise<Object>} - A promise that resolves to the games data.
 */
 export const getGamesData = async (userID : string) => {
    try {
        const response = await api.get('/games/allGamesUser/' + userID);
        return response.data;
    } catch (error) {
        console.error('Error fetching games data:', error);
        throw error;
    }
};

export const getGamesResults = async (userID) => {
	try {
		const res = await api.get('/games/gamesResult/' + userID);
		console.log(res.data)
		return res.data;
	} catch (error) {
        console.error('Error fetching games results:', error);
        throw error;
    }
}

/**
 * Asynchronous function to retrieve friends data from the API.
 * 
 * This function sends a GET request to the `/users/{userID}/friends` endpoint and 
 * returns the response data. If an error occurs during the request, it logs 
 * the error message to the console and re-throws the error to be handled by 
 * the calling function.
 *
 * @param {string} userID - The unique identifier of the user.
 * @returns {Promise<Object>} - A promise that resolves to the friends data.
 */
export const getFriendsData = async (userID : string) => {
    try {
        const response = await api.get('/users/' + userID + '/friends');
        return response.data;
    } catch (error) {
        console.error('Error fetching friends data:', error);
        throw error;
    }
};

/**
 * Asynchronous function to retrieve friends invite data from the API.
 * 
 * This function sends a GET request to the `/users/{userID}/getInvitations` endpoint and 
 * returns the response data. If an error occurs during the request, it logs 
 * the error message to the console and re-throws the error to be handled by 
 * the calling function.
 *
 * @param {string} userID - The unique identifier of the user.
 * @returns {Promise<Object>} - A promise that resolves to the friends invite data.
 */
 export const getFriendsInviteData = async (userID : string) => {
    try {
        const response = await api.get('/users/' + userID + '/getInvitations');
        return response.data;
    } catch (error) {
        console.error('Error fetching friends invite data:', error);
        throw error;
    }
};

/**
 * Asynchronous function to send a friend request data from the API.
 * 
 * This function sends a POST request to the `/users/{userID}/addFriend` endpoint and 
 * returns the response data. If an error occurs during the request, it logs 
 * the error message to the console and re-throws the error to be handled by 
 * the calling function.
 *
 * @param {string} userID - The unique identifier of the user.
 * @param {string} username - Username of the user to invite.
 * @returns {Promise<Object>} - A promise that resolves to the new channel data.
 */
 export const postFriendsInviteData = async (userID : string, username : string) => {
    try {
        const response = await api.post('/users/' + userID + '/addFriend', {
			"username": username,
				})
        return response.data;
    } catch (error) {
		console.error('Error creating a new friend request data:', error);
      	throw error;
    }
};

/**
 * Asynchronous function to retrieve blocked list data from the API.
 * 
 * This function sends a GET request to the `/users/{userID}/blocked` endpoint and 
 * returns the response data. If an error occurs during the request, it logs 
 * the error message to the console and re-throws the error to be handled by 
 * the calling function.
 *
 * @param {string} userID - The unique identifier of the user.
 * @returns {Promise<Object>} - A promise that resolves to the blocked list data.
 */
 export const getBlockedListData = async (userID : string) => {
    try {
        const response = await api.get('/users/' + userID + '/blocked');
        return response.data;
    } catch (error) {
        console.error('Error fetching blocked list data:', error);
        throw error;
    }
};

/**
 * Asynchronous function to delete a friend data from the API.
 * 
 * This function sends a GET request to the `/users/{userID}/blocked` endpoint and 
 * returns the response data. If an error occurs during the request, it logs 
 * the error message to the console and re-throws the error to be handled by 
 * the calling function.
 *
 * @param {string} userID - The unique identifier of the user.
 * @param {number} idFriend - The unique identifier of the friend to remove.
 * @returns {Promise<Object>} - A promise that resolves to the blocked list data.
 */
 export const deleteFriend = async (userID : string, idFriend : number) => {
    try {
        const response = await api.post('/users/' + userID + '/deleteFriendship',{
				"idFriend": idFriend,
				})
        return response.data;
    } catch (error) {
        console.error('Error deleting a friend data:', error);
        throw error;
    }
};

export const postBlock = async (userID : string, usernameToBlock : string) => {
	try {
        const response = await api.post('/users/' + userID + '/blockUser', {
			"username": usernameToBlock,
				})
		return response;
	} catch (error) {
    	console.error('Error blocking a user:', error);
		throw error;
	}
}

export const deleteBlock = async (userID : string, idBlock : number) => {
	try {
		const res = await api.post('/users/' + userID + '/deleteBlock', {
			"idBlock" : idBlock,
			})
		return res;
	} catch (error) {
		console.error('Error deleting block', error);
		throw error;
	}
}