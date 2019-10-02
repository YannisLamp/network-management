import { openDaylightInstance as axios } from './axiosConfig';
import handleError from './handleError';

export const openDaylightApi = {
    getNodes,
    getTopology,
    // createFlows,
    // getFlows,
    // deleteFlows
};

function getNodes() {
    return axios.get('/restconf/operational/opendaylight-inventory:nodes')
        .then(
            response => {
                return response.data;
            },
            error => {
                console.log('Error in opendaylight getNodes');
                handleError(error)
            }
        );
}

// We get everything from the Above service
// function getFlowTables(nodeId, tableId) {
//     return axios.get('/restconf/operational/opendaylight-inventory:nodes/node/' + nodeId + '/table/' + tableId)
//         .then(
//             response => {
//                 console.log('openDaylight response:');
//                 console.log(response);
//                 return response.data;
//             },
//             error => {
//                 console.log('Error in opendaylight getNodes');
//                 handleError(error)
//             }
//         );
// }


function getTopology() {
    return axios.get('/restconf/operational/network-topology:network-topology')
        .then(
            response => {
                return response.data;
            },
            error => {
                console.log('Error in opendaylight getNodes');
                handleError(error)
            }
        );
}


// function createFlows(jsonRequest) {

//     return axios.post('/flows', jsonRequest)
//         .then(
//             response => {
//                 return response.data;
//             },
//             error => {
//                 console.log('Error in flows creation');
//                 handleError(error)
//             }
//         );
// }

// function getFlows() {
//     return axios.get('/flows')
//         .then(
//             response => {
//                 console.log(response.headers);
//                 return response.data;
//             },
//             error => {
//                 console.log('Error in retrieving flows info');
//                 handleError(error)
//             }
//         );
// }


// function deleteFlows() {
//     return axios.delete('/flows')
//         .then(
//             response => {
//                 console.log(response.headers);
//                 return response.data;
//             },
//             error => {
//                 console.log('Error in flows deletion');
//                 handleError(error)
//             }
//         );
// }
