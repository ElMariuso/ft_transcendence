import api from './api';

/**
 * Asynchronous function to join a matchmaking queue.
 *
 * This function sends a POST request to the `/matchmaking/join` endpoint
 * along with playerData as payload. If successful, it returns the response
 * data. In case of an error during the request, it logs the error message to
 * the console and re-throws the error to be handled by the calling function.
 *
 * @param {Object} playerData - The data of the player joining the queue.
 * @returns {Promise<Object>} - A promise that resolves to the response data.
 */
const joinQueue = async (playerData) => {
    try {
        const response = await api.post('/matchmaking/join', playerData);
        return response.data;
    } catch (error) {
        console.error('Error joining queue:', error);
        throw error;
    }
};

/**
 * Asynchronous function to leave a matchmaking queue.
 *
 * This function sends a POST request to the `/matchmaking/leave` endpoint
 * along with playerId as payload. If successful, it returns the response
 * data. If an error occurs during the request, it logs the error message to
 * the console and re-throws the error to be handled by the calling function.
 *
 * @param {string} playerId - The unique identifier of the player.
 * @returns {Promise<Object>} - A promise that resolves to the response data.
 */
const leaveQueue = async (playerId) => {
    try {
        const response = await api.post('/matchmaking/leave', playerId);
        return response.data;
    } catch (error) {
        console.error('Error leaving queue:', error);
        throw error;
    }
};

/**
 * Asynchronous function to get the status of the matchmaking queue.
 *
 * This function sends a GET request to the `/matchmaking/status` endpoint
 * and returns the response data. If an error occurs during the request, it
 * logs the error message to the console and re-throws the error to be handled
 * by the calling function.
 *
 * @returns {Promise<Object>} - A promise that resolves to the status of the queue.
 */
const getQueueStatus = async () => {
    try {
        const response = await api.get('/matchmaking/status');
        return response.data;
    } catch (error) {
        console.error('Error getting queue status:', error);
        throw error;
    }
};

// Exporting the functions for use in other parts of the application.
export { joinQueue, leaveQueue, getQueueStatus };