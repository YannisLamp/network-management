import { openDaylightInstance as axios } from './axiosConfig';
import handleError from './handleError';

export const openDaylightApi = {
    getNodes,
    getTopology,
};

function getNodes() {
    // https://wiki.opendaylight.org/view/Topology_Processing_Framework:Developer_Guide:Use_Case_Tutorial#Show_all_Underlay_Topologies
    //'/restconf/operational/opendaylight-inventory:nodes/'
    //restconf/operational/network-topology:network-topology
    //    /restconf/config/network-topology:network-topology/topology/openflow-topo
    // restconf/operational/network-topology:network-topology/topology/unification-with-filtration:1
    //http://127.0.0.1:8080/controller/nb/v2/statistics/default/flow
    // /restconf/operational/network-topology:network-topology/topology/flow:1
    //GET  http://<controller-ip>:8080/restconf/operational/opendaylight-inventory:nodes/node/{node-id}/table/{table-id}
    return axios.get('/restconf/operational/opendaylight-inventory:nodes')
        .then(
            response => {
                console.log('openDaylight NODES response:');
                console.log(response);
                return response.data;
            },
            error => {
                console.log('Error in opendaylight getNodes');
                handleError(error)
            }
        );
}

// Apo panw ta pairnoume ola
function getFlowTables(nodeId, tableId) {
    return axios.get('/restconf/operational/opendaylight-inventory:nodes/node/' + nodeId + '/table/' + tableId)
        .then(
            response => {
                console.log('openDaylight response:');
                console.log(response);
                return response.data;
            },
            error => {
                console.log('Error in opendaylight getNodes');
                handleError(error)
            }
        );
}


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
