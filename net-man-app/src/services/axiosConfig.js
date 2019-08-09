import axios from 'axios';

export const pythonServerInstance = axios.create({
    baseURL: 'http://localhost:5000/',
    timeout: 180000, //180 seconds
});


//headers.common['Authorization'] = base64EncodedPassword;
const base64EncodedPassword = "Basic " + btoa('admin:admin');
export const openDaylightInstance = axios.create({
    baseURL: 'http://localhost:8181/',
    headers: { 'Authorization': base64EncodedPassword }
});

