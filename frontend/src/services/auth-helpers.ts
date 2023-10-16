import api from './api';
import jwt_decode from 'jwt-decode';

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
        const response = await api.get('/users/' + userID);
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
	try {
		const response = await api.get('/auth/42/redirect');
		if (response && response.data) {
            return response.data;
        } else {
            throw new Error('Unexpected format');
        }
	} catch (error) {
		console.error('Error getting redirection url:', error);
		throw error;
	}
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
    // The status object to store and return the authentication and JWT validity status.
	const status = {
		isAuth: false,
		jwtValid: false,
	};
	const token = localStorage.getItem('token'); // Retrieve the token from local storage.

    // Update the isAuth status to true if the token exists.
	status.isAuth = !!token;
    // If a token exists, further operations to fetch the user data and verify JWT are performed.
	if (token) {
		try {
            // Decode the token to obtain the userID and TwoFactorAuthEnabled status.
			const { sub: userID, TwoFactorAuthEnabled } = jwt_decode(token);
			
            // Attempt to fetch and set the user data using the decoded userID.
			try {
				const userData = await getUserData(userID);
				profileStore.setUsername(userData.username);
				profileStore.setAvatar(userData.avatar);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}

            // If Two Factor Authentication is enabled, verify the JWT and update the jwtValid status.
			if (TwoFactorAuthEnabled) {
				try {
					status.jwtValid = await verifyJWT();
					if (status.jwtValid) {
						console.log(status.jwtValid);
					}
				} catch (error) {
					console.error("JWT verification failed:", error);
				}
			}
            // Update the authState in the authStore to true.
			authStore.authState = true;
		} catch (error) {
			console.error("JWT decode failed:", error);
		}
    }
    // Return the status object containing isAuth and jwtValid status.
	return status;
}