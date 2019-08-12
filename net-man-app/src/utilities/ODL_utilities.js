

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
    for (let link of topo.links)
    {
        retLinks.push([link.source['source-node'], link.destination['dest-node']]);
    }

    return retLinks;
}