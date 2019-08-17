import pcSVG from '../assets/svg/pcIcon.svg';
import switchSVG from '../assets/svg/hub.svg';

export const getODLnodes = (topologies) => {
    const topo = topologies[0];
    let retNodes = [];
    for (let node of topo.node) 
    {
        retNodes.push(node['node-id']);
    }

    return retNodes;
}

export const getODLlinks = (topologies) => {
    const topo = topologies[0];
    let retLinks = [];
    for (let link of topo.link)
    {
        retLinks.push([link.source['source-node'], link.destination['dest-node']]);
    }

    return retLinks;
}


export const getLinksInfo = (linksTopo) => {
        
    let retLinksInfo = {};
    for (let link of linksTopo) 
    {
        const sourceNodeId = link.source['source-node'];
        const destNodeId = link.destination['dest-node'];

        const linkInfoId = sourceNodeId + "/" + destNodeId;
        retLinksInfo[linkInfoId] = {};

        retLinksInfo[linkInfoId]["sourceInfo"] = {};
        retLinksInfo[linkInfoId]["sourceInfo"]["nodeId"] = sourceNodeId;
        retLinksInfo[linkInfoId]["sourceInfo"]["portId"] = link.source['source-tp'];
        if (sourceNodeId === link.source['source-tp']) // sourceNodeId === sourceNodePortId
        { // source node is a host 
            retLinksInfo[linkInfoId]["sourceInfo"]["nodeType"] = "host";
        }
        else
        {
            retLinksInfo[linkInfoId]["sourceInfo"]["nodeType"] = "switch";
        }

        retLinksInfo[linkInfoId]["destInfo"] = {};
        retLinksInfo[linkInfoId]["destInfo"]["nodeId"] = destNodeId;
        retLinksInfo[linkInfoId]["destInfo"]["portId"] = link.destination['dest-tp'];
        if (destNodeId === link.destination['dest-tp']) // destNodeId === destNodePortId
        { // destination node is a host
            retLinksInfo[linkInfoId]["destInfo"]["nodeType"] = "host";
        }
        else
        {
            retLinksInfo[linkInfoId]["destInfo"]["nodeType"] = "switch";
        }

    }

    return retLinksInfo;
}

export const getNodesInfo = (nodesTopo, switchesDatasets) => {

    let retNodesInfo = switchesDatasets.switchesInfo;
    for (let node of nodesTopo) 
    { 
        // {<node1_id> : {}, <node2_id> : {} ...}
        const nodeId = node['node-id'];
        
        //check if node is host or switch
        if (node['termination-point'][0]['tp-id'] === nodeId) 
        {   //it is host
            retNodesInfo[nodeId] = {};
            retNodesInfo[nodeId]["id"] = nodeId;
            retNodesInfo[nodeId]["type"] = "host";
            retNodesInfo[nodeId]["ip"] = node["host-tracker-service:addresses"][0].ip;
            retNodesInfo[nodeId]["mac"] = node["host-tracker-service:addresses"][0].mac;

            retNodesInfo[nodeId]["attachedTo"] = {};
            retNodesInfo[nodeId]["attachedTo"]["portId"] = node["host-tracker-service:attachment-points"][0]["tp-id"];
            retNodesInfo[nodeId]["attachedTo"]["nodeId"] = switchesDatasets.portsToIDs[retNodesInfo[nodeId]["attachedTo"]["portId"]];
        }

    }

    return retNodesInfo;
}

export const extractSwitchesInfo = (switchesAnalytics) => {

    let retPortsToIDs = {}
    let retSwitchesInfo = {};

    // nodesAnalytics only contains switches
    for (let switchInfo of switchesAnalytics) 
    { 
        retSwitchesInfo[switchInfo.id] = {};
        retSwitchesInfo[switchInfo.id]["type"] = "switch"
        retSwitchesInfo[switchInfo.id]["switchType"] = switchInfo["flow-node-inventory:hardware"];

        retSwitchesInfo[switchInfo.id]["info"] = switchInfo; //isws peritto !!!!!!!!

        retSwitchesInfo[switchInfo.id]["connectors"] = {};
        for (let connector of switchInfo['node-connector']) 
        {
            retSwitchesInfo[switchInfo.id]["connectors"][connector.id] = connector;
            retPortsToIDs[connector.id] = switchInfo.id;
        }
    }

    return {portsToIDs: retPortsToIDs, switchesInfo: retSwitchesInfo};
}


export const getGraphLinks = (linksInfo, selectedLinksIDs) => {

    let retGraphLinks = [];
    for (const [linkId, linkInfo] of Object.entries(linksInfo)) 
    {
        // console.log(key, value);

        let color = "#d3d3d3"; //default
        if (selectedLinksIDs.includes(linkId))
        {
            color = "RoyalBlue";
        }

        const graphLink = {
            color: color,
            source: linkInfo.sourceInfo.nodeId,
            target: linkInfo.destInfo.nodeId
        }

        retGraphLinks.push(graphLink);
    }

    return retGraphLinks;
}

export const getGraphNodes = (nodesInfo, selectedNodesIDs) => {
    let retGraphNodes = [];
    // console.log("selected node id: ", selectedNodesIDs)
    for (const [nodeId, nodeInfo] of Object.entries(nodesInfo)) 
    {
        // console.log("now checking: ")
        // console.log(nodeId);

        let color = "gray"; //default
        if (selectedNodesIDs.includes(nodeId))
        {
            color = "RoyalBlue";
        }

        let svgIcon = switchSVG;
        if (nodeInfo.type === "host")
        {
            svgIcon = pcSVG;
        }
    
        const graphNode = {
            fontColor: color,
            id: nodeId,
            svg: svgIcon,
        }

        retGraphNodes.push(graphNode);
    }

    return retGraphNodes;
    
}