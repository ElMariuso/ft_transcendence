import api from './api';
import jwt_decode from 'jwt-decode';
// import axios from 'axios';

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
export const getUserData = async (userID) => {
    try {
        const response = await api.get('/users/user/' + userID);
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

/**
 * Asynchronous function to verify the JSON Web Token (JWT).
 * 
 * This function sends a GET request to the `/auth/jwt/verify` endpoint and 
 * returns the response data. If an error occurs during the request, it logs 
 * the error message to the console and re-throws the error to be handled by 
 * the calling function.
 * 
 * @returns {Promise<Object>} - A promise that resolves to the verification response data.
 */
export const verifyJWT = async () => {
    try {
        const response = await api.get('/auth/jwt/verify');
        return response.data;
    } catch (error) {
        console.error('Error verifying JWT:', error);
        throw error;
    }
};

/**
 * Asynchronous function to retrieve the redirect URL for 42 OAuth authentication.
 * 
 * This function sends a GET request to the `/auth/42/redirect` endpoint and 
 * returns the response data, which should include the URL to which the user 
 * needs to be redirected to initiate the OAuth authentication process with 42. 
 * If an error occurs during the request, it logs the error message to the console 
 * and re-throws the error to be handled by the calling function.
 * 
 * @returns {Promise<Object>} - A promise that resolves to the redirection data.
 */
export const getRedirectURL = async() => {
	return "http://localhost:3000/auth/42/redirect";

	// try {
	// 	const response = await api.get('/auth/42/redirect');
	// 	console.log(response)
	// 	if (response && response.data) {
    //         return response.data;
    //     } else {
    //         throw new Error('Unexpected format');
    //     }
	// } catch (error) {
	// 	console.error('Error getting redirection url:', error);
	// 	throw error;
	// }
};

/**
 * Asynchronous function to check the JWT and update the user profile.
 * 
 * This function checks the validity of the JWT, and if valid, fetches and updates 
 * the user profile. It alters the `authStore` and `profileStore` based on the 
 * obtained data. It returns the authentication status and JWT validity status.
 * 
 * @param {Object} authStore - The store to manage authentication status.
 * @param {Object} profileStore - The store to manage user profile data.
 * @returns {Promise<Object>} - A promise that resolves to the status object containing `isAuth` and `jwtValid` boolean flags.
 */
export async function checkJWT(authStore, profileStore) {
	
	// Retrieve the token from local storage.
	const token = localStorage.getItem('token'); 

    // If a token exists, further operations to fetch the user data and verify JWT are performed.
	if (token) {
		try {
            // Decode the token to obtain the userID, twoFactorAuthEnabled status and 2fa One Time Password.
			const { sub: userID, twoFactorAuthEnabled, twoFactorAuthOTP } = jwt_decode(token);
			
			await api.get('/auth/jwt/verify', {})
			.then(res => {
				if (res.data)
					authStore.validateJWT();
			});

			if (!authStore.JWTisValid)
				return ;

			if (twoFactorAuthEnabled) {
				if (twoFactorAuthOTP) {
					
				}
			}

			// Attempt to fetch and set the user data using the decoded userID.
			try {
				const userData = await getUserData(userID);
				profileStore.setUsername(userData.username);
				profileStore.setAvatar(userData.avatar);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
			
            // Update the authState in the authStore to true.
			authStore.login();
		} catch (error) {
			console.error("JWT decode failed:", error);
		}
    }
	return ;
}