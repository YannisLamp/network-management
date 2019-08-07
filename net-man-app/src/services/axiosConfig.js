import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/',
    timeout: 180000, //180 seconds
});

export default instance;