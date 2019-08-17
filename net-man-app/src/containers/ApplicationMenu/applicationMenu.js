import React, { Component } from 'react';
import { Container, Row, Col, Jumbotron, Spinner } from 'reactstrap';

import { Link, withRouter } from 'react-router-dom';

import styles from './applicationMenu.module.css';
import { openDaylightApi } from '../../services/openDaylightApi';
import { networkApi } from '../../services/networkApi';
import { getODLnodes, getODLlinks } from '../../utilities/ODL_utilities';
import pcSVG from '../../assets/svg/pcIcon.svg';
import switchSVG from '../../assets/svg/hub.svg';
import produce from 'immer';



class CreateNetwork extends Component {
    
    state = {
        graphNodes: null,
        graphLinks: null,
        nodesInfo: null,
        linksInfo: null
    }


    componentDidMount() {
        // alert("did mount"); peritto
        if (this.state.graphNodes)
        { // graph data have already been retrieved
            alert("already retrieved")
            return;
        }

        // alert("go to retrieve data")

        openDaylightApi.getTopology()
            .then(topologyData => {
                
                openDaylightApi.getNodes()
                    .then(nodesData => {
                        // console.log('++++++> openDaylight nodes data:');
                        // console.log(nodesData.nodes.node);
                        // console.log("----------------");
                        // console.log("=========================");


                        // console.log('++++++> openDaylight topology data:');
                        // console.log(topologyData['network-topology'].topology);
                        // console.log("----------------");
                        // console.log("=========================");

                        // topologyData['network-topology'].topology[0].node is the array of nodes
                        const topologyNodes = topologyData['network-topology'].topology[0].node;

                        // topologyData['network-topology'].topology[0].link is the array of links
                        const topologyLinks = topologyData['network-topology'].topology[0].link;

                        // nodesData.nodes.node is the array of nodes
                        const switchesAnalytics = nodesData.nodes.node;    

                        let switchesDatasets = this.extractSwitchesInfo(switchesAnalytics);
                        this.setLinksInfo(topologyLinks);
                        this.setNodesInfo(topologyNodes, switchesDatasets);
                    });
            });
    }

    setLinksInfo = (linksTopo) => {
        
        let retGraphLinks = [];
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
            // if (sourceNodeId === link.source['source-tp']) // sourceNodeId === sourceNodePortId
            // { // source node is a host that does not have ports numbers
            //     retLinksInfo[linkInfoId]["sourceInfo"]["portNumber"] = null;
            // }
            // else
            // {
            //     retLinksInfo[linkInfoId]["sourceInfo"]["portNumber"] = nodesConnectors[sourceNodeId][link.source['source-tp']];
            // }

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
            // if (destNodeId === link.destination['dest-tp']) // destNodeId === destNodePortId
            // { // destination node is a host that does not have ports numbers
            //     retLinksInfo[linkInfoId]["destInfo"]["portNumber"] = null;
            // }
            // else
            // {
            //     retLinksInfo[linkInfoId]["destInfo"]["portNumber"] = nodesConnectors[destNodeId][link.destination['dest-tp']];
            // }
            
            const graphLink = {
                source: sourceNodeId,
                target: destNodeId, 
            }
            retGraphLinks.push(graphLink);
        }

        this.setState(
            produce(draft => {
                draft.graphLinks = retGraphLinks;
                draft.linksInfo = retLinksInfo;
            })
        );
    }

    setNodesInfo = (nodesTopo, switchesDatasets) => {
        // nodesConnectors:
        // nodesTopo: includes both hosts and switches info. 
        // However, nodesTopo does not contain extensive info about switches.
        // So, will use nodesAnalytics to extract hosts' info

        let retGraphNodes = [];
        let retNodesInfo = switchesDatasets.switchesInfo;

        for (let node of nodesTopo) 
        { 
            // {<node1_id> : {}, <node2_id> : {} ...}
            const nodeId = node['node-id'];
            retNodesInfo[nodeId] = {};
            retNodesInfo[nodeId]["id"] = nodeId;

            let nodeSVGicon = null;

            //check if node is host or switch
            if (node['termination-point'][0]['tp-id'] !== nodeId) 
            {   //it is switch
                nodeSVGicon = switchSVG;
                // retNodesInfo[nodeId]["type"] = "switch";

                // retNodesInfo[nodeId]["switchType"] = nodesConnectors[nodeId]["switchType"];
                // retNodesInfo[nodeId]["info"] = nodesConnectors[nodeId]["info"]; //isws peritto !!!!!!!!
                // retNodesInfo[nodeId]["connectors"] = nodesConnectors[nodeId]["connectors"];
            }
            else
            {   //it is host
                nodeSVGicon = pcSVG;

                retNodesInfo[nodeId]["type"] = "host";
                retNodesInfo[nodeId]["ip"] = node["host-tracker-service:addresses"][0].ip;
                retNodesInfo[nodeId]["mac"] = node["host-tracker-service:addresses"][0].mac;

                retNodesInfo[nodeId]["attachedTo"] = {};
                retNodesInfo[nodeId]["attachedTo"]["portId"] = node["host-tracker-service:attachment-points"][0]["tp-id"];
                retNodesInfo[nodeId]["attachedTo"]["nodeId"] = switchesDatasets.portsToIDs[retNodesInfo[nodeId]["attachedTo"]["portId"]];
            }

            //isws na pros8esoume kai me poia nodes einai connected

            const graphNode = {
                id: nodeId,
                svg: nodeSVGicon,
            }
            retGraphNodes.push(graphNode);
        }

        this.setState(
            produce(draft => {
                draft.graphNodes = retGraphNodes;
                draft.nodesInfo = retNodesInfo;
            })
        );
    }

    // this.state.nodeConnectorData[nodeConnector.id (dld linkid)] = statistics
    extractSwitchesInfo = (switchesAnalytics) => {

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


    setGraphData = (statistics) => {
        let retNodes = [];
        let retLinks = [];
        let retNodesInfo = {};

        // console.log("------>MAKING DATA<-----------");

        // Can handle many topologies
        for (let topology of statistics) {
            // Nodes
            for (let node of topology.node) {
                // Check if node is a swicth or a host
                // Termination points have themselves as a termination point
                // console.log(node);
                // console.log("------------");

                // let nodeInfo = {};
                retNodesInfo[node['node-id']] = {};
                retNodesInfo[node['node-id']]["id"] = node['node-id'];

                let color = 'green';
                let svgIcon = pcSVG;
                //let switchNames = new Set(); 
                if (node['termination-point'][0]['tp-id'] !== node['node-id']) 
                {
                    color = 'red';
                    svgIcon = switchSVG;
                    retNodesInfo[node['node-id']]["type"] = "switch";
                    // Save switch names
                    //switchNames.add(node['node-id']);
                }
                else
                {
                    // To node["host-tracker-service:addresses"] einai array, pros to apron to evala na fernei to [0]
                    retNodesInfo[node['node-id']]["type"] = "host";
                    // nodeInfo[node['node-id']][0]["ip"] = node["host-tracker-service:addresses"].ip;
                    // nodeInfo[node['node-id']][0]["mac"] = node["host-tracker-service:addresses"].mac;
                    // Pio panw to [0] gt? Kanonika afou exei polla adresses prepei ontws na to kanoume etsi, 
                    // mesa se for kai arxikopoiimeno omws
                    retNodesInfo[node['node-id']]["ip"] = node["host-tracker-service:addresses"][0].ip;
                    retNodesInfo[node['node-id']]["mac"] = node["host-tracker-service:addresses"][0].mac;
                }

                const currNode = {
                    id: node['node-id'],
                    color: color,
                    svg: svgIcon,
                }
                retNodes.push(currNode);

            }

            // Then links
            let linkConcatToPort = {}
            for (let link of topology.link) {
                // console.log('linkInfo')
                // console.log(link);
                // console.log("=============");

                let linkSrc = link.source['source-node'];
                let linkDest = link.destination['dest-node'];
                
                if (this.state.nodeConnectorData[link['link-id']]) {
                    linkConcatToPort[linkSrc + '/' + linkDest] = this.state.nodeConnectorData[link['link-id']]['flow-node-inventory:port-number'];
                }
                

                const currLink = {
                    color: 'red',
                    source: link.source['source-node'],
                    target: link.destination['dest-node'], 
                }
                retLinks.push(currLink);
            }

            // console.log('LINK CONCAT TO PORT ')
            // console.log(linkConcatToPort);

            this.setState(
                produce(draft => {
                    draft.linkConcatToPort = linkConcatToPort;
                })
            );

        } 

        // console.log("nodes info: ");
        // console.log(retNodesInfo);

        this.setState(
            produce(draft => {
                draft.graphNodes = retNodes;
                draft.graphLinks = retLinks;
                draft.nodesInfo = retNodesInfo;
            })
        );

    }


    //will be remove only for testing purposes

    testODLAPI = () => {

        openDaylightApi.getNodes()
            .then(data => {
                alert("OPD Data received !");
                console.log(data);     
            });

    }

    getODLinfo  = () => {
        openDaylightApi.getTopology()
        .then(data => {
            console.log('openDaylight data:');
            console.log(data['network-topology'].topology);
            
            const topologies = data['network-topology'].topology;

            const nodes = getODLnodes(topologies);
            const links = getODLlinks(topologies);

            const node_source = nodes[0]; 
            const node_dest = nodes[1];

            console.log("nodes: ", nodes);
            console.log("--------------");
            console.log("links: ", links);
            console.log("--------------");
            console.log("node source: ", node_source);
            console.log("node dest: ", node_dest);
            console.log("--------------");

            const requestData = {
                nodes: nodes,
                links: links,
                node_source: node_source,
                node_dest: node_dest
            }

            console.log(requestData);
            // return;

            networkApi.getShortestPath(requestData)
            .then(data => {
                alert("Shortest path calculated");
                console.log("shortest path: ", data.shortest_path)    
            });

            
        });
    }

    //--------------------------------

    render() {

        console.log("---> Printing ODL Info <---");

        console.log("--> Graph Nodes: ", this.state.graphNodes);
        console.log("--------------------");

        console.log("--> Nodes Info: ", this.state.nodesInfo);
        console.log("--------------------");

        console.log("========================");

        console.log("--> Graph Links: ", this.state.graphLinks )
        console.log("--------------------");

        console.log("--> LinksInfo: ", this.state.linksInfo )
        console.log("--------------------");

        // console.log("--> node Connector Data: ", this.state.nodeConnectorData)
        // console.log("--------------------");

        // console.log("--> links Concat to Port: ", this.state.linkConcatToPort)
        // console.log("--------------------");
        // console.log("======================================");


        return (
            <Container fluid className={styles.MenuContainer}>

                { !this.state.graphNodes ?
                <>
                    <Row>
                        <Col className="d-flex justify-content-center">
                            <div>
                                <Spinner style={{ width: '10rem', height: '10rem' }} color="primary" />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="d-flex justify-content-center font-italic text-muted">
                            <div>
                                Retrieving OpenDaylight data ...
                            </div>
                        </Col>
                    </Row>
                </>
                :
                <Row>
                    <Col sm={6}>
                        <Link 
                            className={styles.MenuLink}
                            to={{   
                                    pathname: '/statistics', 
                                    data: { 
                                        graphNodes: this.state.graphNodes,
                                        graphLinks: this.state.graphLinks,

                                        nodesInfo: this.state.nodesInfo,
                                        linksInfo: this.state.linksInfo
                                    } 
                                }} 
                        >
                            <Jumbotron>
                                <h1 className="display-5">Application 1</h1>
                                <p 
                                    className="lead"
                                >
                                    This is a simple hero unit, a simple Jumbotron-style component 
                                    for calling extra attention to featured content or information.
                                </p>
                                <hr className="my-2" />
                                <p>
                                    It uses utility classes for typography and spacing to space content 
                                    out within the larger container.
                                </p>
                            </Jumbotron>
                        </Link>
                    </Col>

                    <Col sm={6}>
                        <Link 
                            className={styles.MenuLink}
                            to={{   
                                    pathname: '/flows', 
                                    data: { 
                                        graphNodes: this.state.graphNodes,
                                        graphLinks: this.state.graphLinks,
                                        
                                        nodesInfo: this.state.nodesInfo,
                                        linksInfo: this.state.linksInfo
                                    } 
                                }} 
                        >
                            <Jumbotron>
                                <h1 className="display-5">Application 2</h1>
                                <p 
                                    className="lead"
                                >
                                    This is a simple hero unit, a simple Jumbotron-style component 
                                    for calling extra attention to featured content or information.
                                </p>
                                <hr className="my-2" />
                                <p>
                                    It uses utility classes for typography and spacing to space content 
                                    out within the larger container.
                                </p>
                            </Jumbotron>
                        </Link>
                    </Col>
                </Row>
                }

            </Container>
        );
    }

}



export default withRouter(CreateNetwork);