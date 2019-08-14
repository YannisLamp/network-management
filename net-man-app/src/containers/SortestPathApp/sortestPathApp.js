import React, { Component } from 'react';
import { Container, Row, Col, Table, Spinner, Button } from 'reactstrap';
import { withRouter, Redirect } from 'react-router-dom';

//import styles from './statisticsApp.module.css';
import { openDaylightApi } from '../../services/openDaylightApi';
import { openDaylightFlowsApi } from '../../services/openDaylightFlowsApi';

import TopologyGraph from '../TopologyGraph/topologyGraph';
import produce from 'immer';

import { getWidth, getHeight } from '../../utilities/utilities';


class SortestPathApp extends Component {

    state = {
        selectedNodeIdsource: null,
        selectedNodeIddest: null,
        errorMessage: "",

        // list of shortest path mac addresses
    }

    linkClickedHandler = (linkId) => {
        return;
    }

    graphClickedHandler = () => {
        return;
    }

    nodeClickedHandler = (nodeId) => {
        if (this.nodesSet())
        {
            //set error message
            this.setState(
                produce(draft => {
                    draft.errorMessage = "Both source and destination nodes have been set.";
                })
            );
            return;
        }

        if (!this.state.selectedNodeIdsource)
        { // user has not chosen a source node yet
            this.setState(
                produce(draft => {
                    draft.selectedNodeIdsource = nodeId;
                })
            );
        }
        else //user has already chosen a source node 
        { //this is the selected node
            if (this.state.selectedNodeIdsource !== nodeId)
            {
                this.setState(
                    produce(draft => {
                        draft.selectedNodeIddest = nodeId;
                    })
                );
            }
            else
            {
                //error message needs to choose a different node (host)
                this.setState(
                    produce(draft => {
                        draft.errorMessage = "The destination node must de different than the source one.";
                    })
                );
            }
        }
    }

    nodesSet = () => {
        return this.state.selectedNodeIdsource && this.state.selectedNodeIddest
    }

    calcSortestPathHandler = () => {
        //API REQUEST

        //letItFlow
    }


    // creates all flows, call in calcSortestPathHandler api.then
    letItFlow = (shortestPathIds) => {
        // First get shortest path ids => macs
        // shortestPathMacs = [];
        // for (let nodeId of shortestPathIds) {
        //     shortestPathMacs.push(this.props.location.data.nodesInfo[nodeId].mac);
        // }
        
        //

        let srcNodeMac = this.props.location.data.nodesInfo[this.state.selectedNodeIdsource].mac;
        let destNodeMac = this.props.location.data.nodesInfo[this.state.selectedNodeIddest].mac;
        // First get all node connectors for each node

        // let onlySwitches = 
        for (let i=1; i < shortestPathIds.length(); i++) {
            // Create individual flow
            openDaylightFlowsApi.createFlow(shortestPathIds[i], 0, 150, srcNodeMac, destNodeMac, 
                this.props.location.data.linkConcatToPort[this.state.selectedNodeIdsource+''+this.state.selectedNodeIddest])
                .then(response => {
                    console.log('paopapapapa');
                    console.log(response);
                })


                
        }


        console.log(this.props.location.data.nodesInfo);
        //console.log(this.props.location.data.linksInfo);
        //console.log(this.props.location.data.nodeConnectorData);
        // this.props.location.data.nodeConnectorData: null





    }


    resetSelectedNodesHandler = () => {

    }

    removeNodeHandler = (nodeId) => {

    }

    render () {
        openDaylightFlowsApi.createFlow('openflow:1', '0', '150', '00:00:00:00:00:01', '00:00:00:00:00:03', 
            '1')
            .then(response => {
                console.log('paopapapapa');
                console.log(response);
            })

        console.log("inside statistics app rendering");

        // alert("rendering app")
        // console.log(this.props.location.data.graphNodes);
        const graphWidth = getWidth() * 1;
        const graphHeight = getHeight() * 0.6;

        //console.log(this.state)

        console.log('nodes::::');
        console.log(this.props.location);
        console.log(this.props.location.data.nodesInfo);

        return (
            <>
                {!this.props.location.data ?
                    <Redirect to="/"/>
                :

                <>
                    <div className="d-flex d-flex-row border">
                        <div className="border">
                            <TopologyGraph
                                nodeClickedHandler={this.nodeClickedHandler}
                                linkClickedHandler={this.linkClickedHandler}
                                graphClickedHandler={this.graphClickedHandler}
                                nodes={this.props.location.data.graphNodes}
                                links={this.props.location.data.graphLinks}
                                graphWidth={graphWidth}
                                graphHeight={graphHeight}
                        />
                        </div>
                    </div>

                    <div className="d-flex d-flex-row border p-2">
                        <Container fluid>

                            <Row className="border">
                                <Col sm="12" className="font-weight-bold border d-flex justify-content-center">
                                    <div>
                                        Selected Nodes
                                    </div>
                                </Col>
                            </Row>

                            <Row className="border">
                                <Col sm="4" className="font-weight-bold border">
                                    Source Node
                                </Col>

                                <Col sm="6" className="border">
                                    {this.state.selectedNodeIdsource ? this.state.selectedNodeIdsource
                                    : 
                                        <div className="font-italic text-muted">
                                            None selected
                                        </div>
                                    }
                                </Col>

                                <Col sm="2" className="d-flex justify-content-end">
                                    <Button size="md">
                                    aa
                                    </Button>
                                </Col>
                            </Row>

                            <Row className="border">
                                <Col sm="4" className="font-weight-bold border">
                                    Destination Node
                                </Col>

                                <Col sm="6" className="border">
                                    {this.state.selectedNodeIddest ? this.state.selectedNodeIddest
                                    : 
                                        <div className="font-italic text-muted">
                                            None selected
                                        </div>
                                    }                                
                                </Col>

                                <Col sm="2" className="d-flex justify-content-end">
                                    <Button size="md">
                                        Remove <i className="fas fa-trash-alt"></i>
                                    </Button>
                                </Col>
                            </Row>

                            {
                                ! this.nodesSet() ? null
                                :
                                <Row className="border mt-3">
                                    <Col sm="12" className="border d-flex justify-content-end">
                                        <Button size="lg" className="font-weight-bold mr-2">
                                            Reset Nodes
                                        </Button>

                                        <Button size="lg" color="primary" className="font-weight-bold">
                                            Find Path
                                        </Button>
                                    </Col>
                                </Row>
                            }
                        </Container>
                    </div>         
                </>
                }
            </>
        )

    }

}


export default withRouter(SortestPathApp);