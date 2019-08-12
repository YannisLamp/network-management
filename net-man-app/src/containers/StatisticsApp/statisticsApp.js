import React, { Component } from 'react';
import { Container, Row, Col, Table, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';

//import styles from './statisticsApp.module.css';
import { openDaylightApi } from '../../services/openDaylightApi';

import TopologyGraph from '../TopologyGraph/topologyGraph';
import produce from 'immer';
import pcSVG from '../../assets/svg/pcIcon.svg';
import switchSVG from '../../assets/svg/hub.svg';
import { getWidth, getHeight } from '../../utilities/utilities';


class StatisticsApp extends Component {

    state = {
        selectedNodeId: null,
        selectedLinkId: null,
        graphNodes: null,
        graphLinks: null,
        nodesInfo: null,
        linksInfo: null
    }

    componentDidMount() {
        // alert("did mount");
        if (this.state.graphNodes)
        { // graph data have already been retrieved
            // alert("already retrieved")
            return;
        }

        // alert("go to retrieve data")

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


    nodeClickedHandler = (nodeId) => {
        // alert(`node clicked ${nodeId}`);
        // console.log("=========================")

        // console.log(`node ${nodeId} info: `, this.state.nodesInfo[nodeId])
       
        // console.log("=========================")

        // console.log(this.state.nodesInfo);

        // console.log("=========================")
        
        this.setState(
            produce(draft => {
                draft.selectedNodeId = nodeId;
            })
        );
    }

    linkClickedHandler = (linkId) => {
        alert(`link clicked ${linkId}`);

        this.setState(
            produce(draft => {
                draft.selectedLinkId = linkId;
            })
        );
    }

    graphClickedHandler = () => {
        alert("graph background clicked");
    }

    render () {

        console.log("inside statistics app rendering");
        console.log("node info: ", this.state.nodesInfo);

        // alert("rendering app")
        const graphWidth = getWidth() * 0.6;
        const graphHeight = getHeight() * 0.7;

        // if (!this.state.graphNodes)
        // {
        //     alert("not going to render graph")
        // }
        // else
        // {
        //     alert("going to render graph")

        // }


        // console.log("graph Width: ", graphWidth);
        // console.log("graph Height", graphHeight);

        return (
            <div>
                {!this.state.graphNodes ?
                    <p>is loading</p>
                :

                <>
                <div className="d-flex d-flex-row border">
                    <div className="border">
                        <TopologyGraph
                            nodeClickedHandler={this.nodeClickedHandler}
                            linkClickedHandler={this.linkClickedHandler}
                            graphClickedHandler={this.graphClickedHandler}
                            nodes={this.state.graphNodes}
                            links={this.state.graphLinks}
                            graphWidth={graphWidth}
                            graphHeight={graphHeight}
                       />
                    </div>

                    {this.state.selectedNodeId ?
                    <div className="border w-100 p-2">
                        <Container fluid>

                            <Row className="border">
                                <Col sm="12" className="font-weight-bold border d-flex justify-content-center">
                                    <div>
                                        Information
                                    </div>
                                </Col>
                            </Row>

                            <Row className="border">
                                <Col sm="6" className="font-weight-bold border">
                                    Type
                                </Col>

                                <Col sm="6">
                                    {this.state.nodesInfo[this.state.selectedNodeId].type}
                                </Col>
                            </Row>

                            <Row className="border">
                                <Col sm="6" className="font-weight-bold border">
                                    Id
                                </Col>

                                <Col sm="6">
                                    {this.state.nodesInfo[this.state.selectedNodeId].id}
                                </Col>
                            </Row>

                            <Row className="border">
                                <Col sm="6" className="font-weight-bold border">
                                    IP
                                </Col>

                                <Col sm="6">
                                    {this.state.nodesInfo[this.state.selectedNodeId].ip}
                                </Col>
                            </Row>

                            <Row className="border">
                                <Col sm="6" className="font-weight-bold border">
                                    mac
                                </Col>

                                <Col sm="6">
                                    {this.state.nodesInfo[this.state.selectedNodeId].mac}
                                </Col>
                            </Row>

                            <Row className="border">
                                <Col sm="6" className="font-weight-bold border">
                                    Name
                                </Col>

                                <Col sm="6">
                                    None
                                </Col>
                            </Row>

                            <Row className="border">
                                <Col sm="6" className="font-weight-bold border">
                                    Connectors #
                                </Col>

                                <Col sm="6">
                                    4
                                </Col>
                            </Row>

                            <Row className="border mt-3">
                                <Col sm="12" className="font-weight-bold border">
                                    Attachment Points
                                </Col>
                            </Row>


                        
                        </Container>
                    </div>
                    : null
                    }
                </div>

                <div className="d-flex d-flex-row border">
                    wswswswswsw
                </div>
                </>
                }

            </div>
        )

    }

}


export default StatisticsApp;