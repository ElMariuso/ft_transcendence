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
export const getLadderData = async (userID) => {
    try {
        const response = await api.get('/users/ladder/' + userID);
        return response.data;
    } catch (error) {
        console.error('Error fetching ladder data:', error);
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
 export const getStatsData = async (userID) => {
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
 export const getAchievementsData = async (userID) => {
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
 export const getGamesData = async (userID) => {
    try {
        const response = await api.get('/games/allGamesUser/' + userID);
        return response.data;
    } catch (error) {
        console.error('Error fetching games data:', error);
        throw error;
    }
};

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
export const getFriendsData = async (userID) => {
    try {
        const response = await api.get('/users/' + userID + '/friends');
        return response.data;
    } catch (error) {
        console.error('Error fetching friends data:', error);
        throw error;
    }
};