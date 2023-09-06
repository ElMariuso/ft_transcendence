import axios from 'axios';

const token = axios.create({ baseURL: 'http://frontend-dev:8080/token' })

export default token;