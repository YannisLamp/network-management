import { openDaylightInstance as axios } from './axiosConfig';
import handleError from './handleError';

export const openDaylightFlowsApi = {
    createFlow,
    getNodeFlows
};

// Make url making a custom flow in opendaylight (By PUT request)
function makeFlowUrl(nodeId, tableId, flowId) {
    let url = 'http://localhost:8181/restconf/config/opendaylight-inventory:nodes/node/';
    // nodeId: openflow:1
    url += nodeId + '/flow-node-inventory:table/';
    // tableId: unique int
    url += tableId + '/flow/';
    // flowId: unique int
    url += flowId;

    return url;
}


// flowId: unique int

// srcMacAddress: source HOST mac address 
// destMacAddress: destination HOST mac address
// (thelei sovaro tsekarisma alla emena me host mou evgale apotelesma)

// outputAtNodeConnectorId: int (gia swsto monopati tha einai to id tou node connector pou sindeei ton twrino
// node me ton epomeno node sto shortest path)

// tableId: unique int 
function makeFlowJson(flowId, srcMacAddress, destMacAddress, outputAtNodeConnectorId, tableId) {
    return {
        "flow": [
            {
                "id": flowId,
                "match": {
                    "ethernet-match": {
                        "ethernet-source": {
                            "address": srcMacAddress
                        },
                        "ethernet-destination": {
                            "address": destMacAddress
                        },
                        // ethernet-type may need to change depending on the network?
                        "ethernet-type": {
                            "type": "0x800"
                        }
                    }
                },
                "instructions": {
                    "instruction": [
                        {
                            "apply-actions": {
                                "action": [
                                    {
                                        "output-action": {
                                            "output-node-connector": outputAtNodeConnectorId
                                        },
                                        "order": "1"
                                    }
                                ]
                            },
                            "order": "1"
                        }
                    ]
                },
                "installHw": "false",
                "table_id": tableId
            }
        ]
    };
}


function createFlow(nodeId, tableId, flowId, srcMacAddress, destMacAddress, outputAtNodeConnectorId) {
    let putUrl = makeFlowUrl(nodeId, tableId, flowId);
    let putJson = makeFlowJson(flowId, srcMacAddress, destMacAddress, outputAtNodeConnectorId, tableId);

    // make actual request
    return axios.put(putUrl, putJson)
        .then(
            response => {
                // console.log('openDaylight createFlows response:');
                // console.log(response);
                return response.data;
            },
            error => {
                console.log('Error in opendaylight createFlow');
                handleError(error)
            }
        );

}

// Get all flows form an opendaylight node
function getNodeFlows(nodeId) {
    return axios.get('http://localhost:8181/restconf/config/opendaylight-inventory:nodes/node/' + nodeId)
        .then(
            response => {
                // console.log('openDaylight getNodeFlows response:');
                // console.log(response);
                return response.data;
            },
            error => {
                console.log('Error in opendaylight getNodeFlows');
                handleError(error)
            }
        );
}