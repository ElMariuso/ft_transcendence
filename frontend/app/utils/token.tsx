import axios from 'axios';

const token = axios.create({ baseURL: 'http://frontend:8080/token' })

export default token;