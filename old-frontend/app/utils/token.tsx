import axios from 'axios';

const token = axios.create({ baseURL: 'http://localhost:8080/token' })

export default token;