import axios from './axiosConfig';
import handleError from './handleError';

export const networkApi = {
    createNetwork,
    deleteNetwork
};

function createNetwork(ip, port, topologyType, switchType,
        nodes, switches, mac, defaultTopo) {
    
    // JSON for API
    const jsonRequest = {
        ip,
        port,
        topologyType,
        switchType,
        nodes,
        switches,
        mac,
        defaultTopo
    }

    return axios.post('/network', jsonRequest)
        .then(
            response => {
                console.log(response.headers);
                //history.push('/');
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
                //history.push('/');
            },
            error => {
                console.log('Error in network deletion');
                handleError(error)
            }
        );
}