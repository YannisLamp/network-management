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
        //alert("did mount");
        if (this.state.graphNodes)
        { // graph data have already been retrieved
            alert("already retrieved")
            return;
        }

        //alert("go to retrieve data")


        openDaylightApi.getTopology()
            .then(data => {
                console.log('openDaylight data:');
                console.log(data['network-topology'].topology);
                // this.setState(
                //     produce(draft => {
                //         draft.statistics = data['network-topology'].topology;
                //         // draft.isLoading = false;
                //     })
                // );
//alert("ddddddd")
                this.setGraphData(data['network-topology'].topology);
            });
    }

    setGraphData = (statistics) => {
        let retNodes = [];
        let retLinks = [];
        let retNodesInfo = [];

        console.log("------>MAKING DATA<-----------");

        // Can handle many topologies
        for (let topology of statistics) {
            // Nodes
            //alert("tttt")
            for (let node of topology.node) {
                //alert("dn paizei me poiothta");
                // Check if node is a swicth or a host
                // Termination points have themselves as a termination point
                console.log(node);
                console.log("------------");

                let nodeInfo = {};
                nodeInfo[node['node-id']] = {};
                nodeInfo[node['node-id']]["id"] = node['node-id'];

                let color = 'green';
                let svgIcon = pcSVG;
                //let switchNames = new Set(); 
                if (node['termination-point'][0]['tp-id'] !== node['node-id']) 
                {
                    color = 'red';
                    svgIcon = switchSVG;
                    nodeInfo[node['node-id']]["type"] = "switch";
                    // Save switch names
                    //switchNames.add(node['node-id']);
                }
                else
                {
                    // To node["host-tracker-service:addresses"] einai array, pros to apron to evala na fernei to [0]
                    nodeInfo[node['node-id']]["type"] = "host";
                    // nodeInfo[node['node-id']][0]["ip"] = node["host-tracker-service:addresses"].ip;
                    // nodeInfo[node['node-id']][0]["mac"] = node["host-tracker-service:addresses"].mac;
                    // Pio panw to [0] gt? Kanonika afou exei polla adresses prepei ontws na to kanoume etsi, 
                    // mesa se for kai arxikopoiimeno omws
                    nodeInfo[node['node-id']]["ip"] = node["host-tracker-service:addresses"][0].ip;
                    nodeInfo[node['node-id']]["mac"] = node["host-tracker-service:addresses"][0].mac;
                }

                const currNode = {
                    id: node['node-id'],
                    color: color,
                    svg: svgIcon,
                }
                retNodes.push(currNode);
                retNodesInfo.push(nodeInfo);

                // this.setState(
                //     produce(draft => {
                //         draft.nodesInfo.push(nodeInfo);
                //     })
                // );
            }
            alert("oolo malakies")
            // Then links
            for (let link of topology.link) {
                //alert("edw")
                console.log(link);
                console.log("=============");

                const currLink = {
                    source: link.source['source-node'],
                    target: link.destination['dest-node'], 
                }
                retLinks.push(currLink);
            }
        } 

        //alert("rrrrr");

        this.setState(
            produce(draft => {
                draft.graphNodes = retNodes;
                draft.graphLinks = retLinks;
                draft.nodesInfo = retNodesInfo;
                //alert("skssj");
            })
        );
    }


    nodeClickedHandler = (nodeId) => {
        alert(`node clicked ${nodeId}`);
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

                    <div className="border w-100">
                        <Container fluid>
                            <Row className="border">
                                <Col sm="6" className="font-weight-bold border">
                                    Type
                                </Col>

                                <Col sm="6">
                                    Node
                                </Col>
                            </Row>

                            <Row className="border">
                                <Col sm="6" className="font-weight-bold border">
                                    Id
                                </Col>

                                <Col sm="6">
                                    00.00.00.08
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


                        
                        </Container>
                    </div>
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