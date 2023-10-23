import axios from 'axios';
import Cookies from 'js-cookie';

/**
 * Axios instance for API calls.
 *
 * An axios instance is created to configure API calls throughout the application.
 * The instance is configured with a base URL, so that relative paths can be used
 * in API requests, and with a content type header to specify that we send JSON.
 * The interceptors defined below will ensure that a token, if available, is
 * automatically included in the authorization header of all requests.
 */
const instance = axios.create({
    baseURL: 'http://localhost:3000' // Base URL for all requests
});

/**
 * Axios Request Interceptor.
 *
 * Before a request is sent, retrieve the token from localStorage, and if it exists,
 * append it to the request headers. This means that all API requests will be
 * automatically authenticated if the token is present.
 *
 * @param {Object} config - The axios request configuration
 * @returns {Object} - The modified configuration with the Authorization header, if the token is available
 */
instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token'); // Retrieve token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Set Authorization header
    }
    return config; // Return the updated configuration
  },
  (error) => {
    // Handle request error here and return a rejected Promise to ensure that 
    // the error can be handled by the request catch block
    return Promise.reject(error);
  }
);


/* Export the axios instance for global use in the project */
export default instance;