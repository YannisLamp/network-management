import { pythonServerInstance as axios } from './axiosConfig';
import handleError from './handleError';

export const networkApi = {
    createNetwork,
    deleteNetwork,
    networkExists,
    calcShortestPath,
    getShortestPath,
    deleteShortestPath,
    pingAll
};

function createNetwork(jsonRequest) {

    return axios.post('/network', jsonRequest)
        .then(
            response => {
                return response.data;
            },
            error => {
                console.log('Error in network creation');
                handleError(error)
            }
        );
}

function deleteNetwork() {
    return axios.delete('/network')
        .then(
            response => {
                console.log(response.headers);
                return response.data;
            },
            error => {
                console.log('Error in network deletion');
                handleError(error)
            }
        );
}

function networkExists() {
    return axios.get('/network')
        .then(
            response => {
                console.log(response.headers);
                return response.data;
            },
            error => {
                console.log('Error in network check');
                handleError(error)
            }
    );
}

function calcShortestPath(jsonRequest) {
    return axios.post('/shortest_path', jsonRequest)
        .then(
            response => {
                return response.data;
            },
            error => {
                console.log('Error in shortest path');
                handleError(error)
            }
        );
}

function getShortestPath() {
    return axios.get('/shortest_path')
        .then(
            response => {
                console.log(response.headers);
                return response.data;
            },
            error => {
                console.log('Error in retrieving shortest path');
                handleError(error)
            }
    );
}


function deleteShortestPath() {
    return axios.delete('/shortest_path')
        .then(
            response => {
                console.log(response.headers);
                return response.data;
            },
            error => {
                console.log('Error in shortest path deletion');
                handleError(error)
            }
        );
}


function pingAll() {
    return axios.post('/pingall')
        .then(
            response => {
                return response.data;
            },
            error => {
                console.log('Error in pingall');
                handleError(error)
            }
        );
}