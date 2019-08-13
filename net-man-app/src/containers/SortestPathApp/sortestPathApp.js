import React, { Component } from 'react';
import { Container, Row, Col, Table, Spinner } from 'reactstrap';
import { withRouter, Redirect } from 'react-router-dom';

//import styles from './statisticsApp.module.css';
import { openDaylightApi } from '../../services/openDaylightApi';

import TopologyGraph from '../TopologyGraph/topologyGraph';
import produce from 'immer';

import { getWidth, getHeight } from '../../utilities/utilities';


class SortestPathApp extends Component {

    state = {
        selectedNodeIdsource: null,
        selectedNodeIddest: null,
        errorMessage: ""
    }

    nodeClickedHandler = (nodeId) => {
        if (this.nodesSet)
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
    }

    resetSelectedNodesHandler = () => {
        
    }

    removeNodeHandler = (nodeId) => {

    }

    render () {

        console.log("inside statistics app rendering");

        // alert("rendering app")
        // console.log(this.props.location.data.graphNodes);
        const graphWidth = getWidth() * 0.6;
        const graphHeight = getHeight() * 0.7;

        return (
            <div>
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

                    {this.state.selectedNodeId || this.state.selectedLinkId ?
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
                                    {this.props.location.data.nodesInfo[this.state.selectedNodeId].type}
                                </Col>
                            </Row>

                            <Row className="border">
                                <Col sm="6" className="font-weight-bold border">
                                    Id
                                </Col>

                                <Col sm="6">
                                    {this.props.location.data.nodesInfo[this.state.selectedNodeId].id}
                                </Col>
                            </Row>

                            <Row className="border">
                                <Col sm="6" className="font-weight-bold border">
                                    IP
                                </Col>

                                <Col sm="6">
                                    {this.props.location.data.nodesInfo[this.state.selectedNodeId].ip}
                                </Col>
                            </Row>

                            <Row className="border">
                                <Col sm="6" className="font-weight-bold border">
                                    mac
                                </Col>

                                <Col sm="6">
                                    {this.props.location.data.nodesInfo[this.state.selectedNodeId].mac}
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


export default withRouter(SortestPathApp);