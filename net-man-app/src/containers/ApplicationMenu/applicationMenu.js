import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';
import { Jumbotron } from 'reactstrap';

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
        alert("did mount");
        if (this.state.graphNodes)
        { // graph data have already been retrieved
            alert("already retrieved")
            return;
        }

        alert("go to retrieve data")

        openDaylightApi.getTopology()
            .then(data => {
                console.log('openDaylight data:');
                console.log(data['network-topology'].topology);
                
                this.setGraphData(data['network-topology'].topology);
            });
    }

    setGraphData = (statistics) => {
        let retNodes = [];
        let retLinks = [];
        let retNodesInfo = {};

        console.log("------>MAKING DATA<-----------");

        // Can handle many topologies
        for (let topology of statistics) {
            // Nodes
            for (let node of topology.node) {
                // Check if node is a swicth or a host
                // Termination points have themselves as a termination point
                console.log(node);
                console.log("------------");

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
            for (let link of topology.link) {
                console.log(link);
                console.log("=============");

                const currLink = {
                    source: link.source['source-node'],
                    target: link.destination['dest-node'], 
                }
                retLinks.push(currLink);
            }
        } 

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
        return (
            <Container fluid className={styles.MenuContainer}>
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

                    {/* <Col sm={1}/> */}

                    <Col sm={6}>
                    {/* <Link to="/topology" className={styles.MenuLink}> */}
                        <Jumbotron onClick={this.getODLinfo}>   
                        {/* <Jumbotron> */}
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
                    {/* </Link> */}
                    </Col>
                </Row>

            </Container>
        );
    }

}



export default withRouter(CreateNetwork);