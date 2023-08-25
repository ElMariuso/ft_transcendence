import axios from 'axios';

const token = axios.create({ baseURL: 'http://localhost:3001/token' })

export default token;