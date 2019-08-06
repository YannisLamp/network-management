import axios from './axiosConfig';
import handleError from './handleError';

export const networkApi = {
    createNetwork,
    deleteNetwork,
    networkExists
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