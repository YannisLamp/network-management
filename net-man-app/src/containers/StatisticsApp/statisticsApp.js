import React, { Component } from 'react';
import { Container, Row, Col, Table } from 'reactstrap';
import { Link } from 'react-router-dom';

//import styles from './statisticsApp.module.css';
import { openDaylightApi } from '../../services/openDaylightApi';

import TopologyGraph from '../TopologyGraph/topologyGraph';
import produce from 'immer';
import pcSVG from '../../assets/svg/pcIcon.svg';
import switchSVG from '../../assets/svg/hub.svg';


class StatisticsApp extends Component {

    state = {
        isLoading: true,
        statistics: null,
        selectedNodeId: null,
        selectedLinkId: null,
        linksInfo: null,
        nodesInfo: null
    }

    componentDidMount() {
        openDaylightApi.getTopology()
            .then(data => {
                console.log('openDaylight data:');
                console.log(data['network-topology'].topology);
                this.setState(
                    produce(draft => {
                        draft.statistics = data['network-topology'].topology;
                        // draft.isLoading = false;
                    })
                );

                this.setGraphData();
            });
    }

    setGraphData = () => {
        let retNodes = [];
        let retLinks = [];

        console.log("------>MAKING DATA<-----------");

        // Can handle many topologies
        for (let topology of this.state.statistics) {
            // Nodes
            for (let node of topology.node) {
                // Check if node is a swicth or a host
                // Termination points have themselves as a termination point
                console.log(node);
                console.log("------------");
                let color = 'green';
                let svgIcon = pcSVG;
                let switchNames = new Set(); ;
                if (node['termination-point'][0]['tp-id'] !== node['node-id']) {
                    color = 'red';
                    svgIcon = switchSVG;
                    // Save switch names
                    //switchNames.add(node['node-id']);
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
                const currLink = {
                    source: link.source['source-node'],
                    target: link.destination['dest-node'], 
                }
                retLinks.push(currLink);
            }
        } 


        this.setState(
            produce(draft => {
                draft.nodesInfo = retNodes;
                draft.linksInfo = retLinks;
                draft.isLoading = false;
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

        // alert("rendering app")


        return (
            <Container fluid>
                {this.state.isLoading ?
                    "is loading"
                :

                <>
                <Row className="border h-75">
                    <Col sm="9" className="border">
                        <TopologyGraph
                            nodeClickedHandler={this.nodeClickedHandler}
                            linkClickedHandler={this.linkClickedHandler}
                            graphClickedHandler={this.graphClickedHandler}
                            nodes={this.state.nodesInfo}
                            links={this.state.linksInfo}
                       />
                    </Col>

                    <Col sm="3" className="border">
                        <Table responsive>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Table heading</th>
                                <th>Table heading</th>
                                <th>Table heading</th>
                                <th>Table heading</th>
                                <th>Table heading</th>
                                <th>Table heading</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                            </tr>
                            </tbody>
                        </Table>
                        
                    </Col>
                </Row>

                <Row className="border">
wswswswswsw
                </Row>
                </>
                }

            </Container>
        )

    }

}


export default StatisticsApp;