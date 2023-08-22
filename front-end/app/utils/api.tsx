import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Replace with your API base URL
});

export default api;