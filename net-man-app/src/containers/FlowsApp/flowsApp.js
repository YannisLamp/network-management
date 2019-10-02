import React, { Component } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'reactstrap';
import { withRouter, Redirect } from 'react-router-dom';
import { networkApi } from '../../services/networkApi';

import TopologyGraph from '../TopologyGraph/topologyGraph';
import produce from 'immer';

import { getWidth, getHeight } from '../../utilities/utilities';
import { getGraphLinks, getGraphNodes, extractLinksFromNodesPath, getODLnodes, getODLlinks, getFlowsSwitchesData } from '../../utilities/ODL_utilities';

import NodesSelection from '../../components/flowsApp/NodesSelection/nodesSelection';
import FlowsInfo from '../../components/flowsApp/FlowsInfo/flowsInfo';



class FlowsApp extends Component {

    state = {
        selectedNodeIdsource: null,
        selectedNodeIddest: null,
        shortestPath: [],
        errorMessage: null,
        flowsInfo: null,
        isCreatingFlows: false
    }

    componentDidMount() {
        if (!this.props.location.data)
        {
            return;
        }

        networkApi.getShortestPath()
        .then(data => {
            const shortestPath = data.shortest_path;
            networkApi.getFlows()
            .then(flowsInfo => {              
                this.setState(
                    produce(draft => {
                        draft.flowsInfo = flowsInfo.success ? flowsInfo.sourceDest : null;
                        draft.shortestPath = shortestPath;
                        if (shortestPath.length)
                        {
                            draft.selectedNodeIdsource = shortestPath[0];
                            draft.selectedNodeIddest = shortestPath[shortestPath.length-1];
                        }
                    })
                );   
                
            });
        });
    }

    linkClickedHandler = (linkId) => {
        return;
    }

    graphClickedHandler = () => {
        return;
    }

    nodeClickedHandler = (nodeId) => {

        if (this.state.shortestPath.length)
        { // shortest path has been calculated and flows have been created
            return;
        }

        if (this.props.location.data.nodesInfo[nodeId].type === "switch")
        {
            this.setState(
                produce(draft => {
                    draft.errorMessage = "You must choose only host nodes.";
                })
            );
            return;
        }

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
            if (this.state.selectedNodeIddest !== nodeId)
            {
                this.setState(
                    produce(draft => {
                        draft.errorMessage = null;
                        draft.selectedNodeIdsource = nodeId;
                    })
                );
            }
            else
            {
                this.setState(
                    produce(draft => {
                        draft.errorMessage = "The source node must de different than the destination one.";
                    })
                );
            }
        }
        else //user has already chosen a source node 
        { //this is the selected node
            if (this.state.selectedNodeIdsource !== nodeId)
            {
                this.setState(
                    produce(draft => {
                        draft.errorMessage = null;
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
        return this.state.selectedNodeIdsource && this.state.selectedNodeIddest;
    }

    deleteShortestPathHandler = () => {
        networkApi.deleteShortestPath()
        .then(data => {
            if (data.success)
            {
                this.setState(
                    produce(draft => {
                        draft.shortestPath = [];
                        draft.selectedNodeIdsource = null;
                        draft.selectedNodeIddest = null;
                        draft.flowsInfo = null;
                    })
                );   
            }
        });
    }


    deleteFlowsHandler = () => {
        networkApi.deleteFlows()
        .then(data => {
            if (data.success)
            {
                this.setState(
                    produce(draft => {
                        draft.shortestPath = [];
                        draft.selectedNodeIdsource = null;
                        draft.selectedNodeIddest = null;
                        draft.flowsInfo = null;
                    })
                );   
            }
        });
    }

    createFlowsHandler = () => {
        this.setState(
            produce(draft => {
                draft.errorMessage = null;
                draft.isCreatingFlows = true;
            })
        );

        const nodes = getODLnodes(this.props.location.data.nodesInfo);
        const links = getODLlinks(this.props.location.data.linksInfo);

        const node_source = this.state.selectedNodeIdsource; 
        const node_dest = this.state.selectedNodeIddest;

        // console.log("nodes: ", nodes);
        // console.log("--------------");
        // console.log("links: ", links);
        // console.log("--------------");
        // console.log("node source: ", node_source);
        // console.log("node dest: ", node_dest);
        // console.log("--------------");

        const calcShortestPathData = {
            nodes: nodes,
            links: links,
            node_source: node_source,
            node_dest: node_dest
        }

        networkApi.calcShortestPath(calcShortestPathData)
        .then(data => {
            const shortestPath = data.shortest_path;

            const srcNodeMac = this.props.location.data.nodesInfo[this.state.selectedNodeIdsource].mac;
            const destNodeMac = this.props.location.data.nodesInfo[this.state.selectedNodeIddest].mac;

            const flowsSwitchesData = getFlowsSwitchesData(shortestPath, this.props.location.data.linksInfo, this.props.location.data.nodesInfo, 0);

            const flowsCreationData = {
                srcMacAddress: srcNodeMac,
                destMacAddress: destNodeMac,
                nodesInfo: flowsSwitchesData
            };
            networkApi.createFlows(flowsCreationData)
            .then(data => {
                if (data.success)
                {
                    this.setState(
                        produce(draft => {
                            draft.flowsInfo = data.sourceDest;
                            draft.shortestPath = shortestPath;
                            draft.isCreatingFlows = false;
                        })
                    );
                }
                else
                {
                    alert("Flows creation FAILED try again")
                }

            });

        });

    }



    resetSelectedNodesHandler = () => {
        this.setState(
            produce(draft => {
                draft.errorMessage = null;
                draft.selectedNodeIddest = null;
                draft.selectedNodeIdsource = null;
            })
        );
    }

    removeSelectedNodeHandler = (type) => {
        this.setState(
            produce(draft => {
                draft.errorMessage = null;
                if (type === "source")
                {
                    draft.selectedNodeIdsource = null;
                }
                else
                {
                    draft.selectedNodeIddest = null;
                }
            })
        );
    }

    onDismissAlert = () => {
        this.setState(
            produce(draft => {
                draft.errorMessage = null;
            })
        );
    }

    render () {
        const graphWidth = getWidth() * 0.9;
        const graphHeight = getHeight() * 0.6;

        return (
            <>
                {!this.props.location.data ?
                    <Redirect to="/"/>
                :

                <>
                    <Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.onDismissAlert}>
                        {this.state.errorMessage}
                    </Alert>

                    <div style={{border: "2px solid gray"}}>

                        <div className="d-flex d-flex-row justify-content-center" style={{backgroundColor: "GhostWhite"}}>
                            <div className="font-weight-bold customHeader1">
                                Topology Flows Creation
                            </div>
                        </div>

                        <div className="d-flex d-flex-row" style={{borderTop: "2px solid gray", borderBottom: "2px solid gray"}}>
                            <TopologyGraph
                                nodeClickedHandler={this.nodeClickedHandler}
                                linkClickedHandler={this.linkClickedHandler}
                                graphClickedHandler={this.graphClickedHandler}
                                nodes={getGraphNodes(this.props.location.data.nodesInfo, this.state.shortestPath)}
                                links={getGraphLinks(this.props.location.data.linksInfo, extractLinksFromNodesPath(this.state.shortestPath))}
                                graphWidth={graphWidth}
                                graphHeight={graphHeight}
                            />
                        </div>

                        <div className="d-flex d-flex-row p-2" style={{backgroundColor: "GhostWhite"}}>
                            {
                                !this.state.shortestPath.length ?
                                    !this.state.isCreatingFlows ?
                                        <NodesSelection 
                                            selectedNodeIdsource={this.state.selectedNodeIdsource} 
                                            selectedNodeIddest={this.state.selectedNodeIddest}
                                            resetSelectedNodesHandler={this.resetSelectedNodesHandler}
                                            removeSelectedNodeHandler={this.removeSelectedNodeHandler}
                                            nodesSet={this.nodesSet()}
                                            createFlowsHandler={this.createFlowsHandler}
                                        />
                                    : 
                                        <Container fluid className="customBorder1">
                                            <Row className="align-items-center">
                                                <Col sm="12" className="d-flex justify-content-center pb-2 pt-2">
                                                    <div>
                                                        <Spinner style={{ width: '5rem', height: '5rem' }} color="primary" />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Container>
                                :
                                    <FlowsInfo 
                                        selectedNodeIdsource={this.state.selectedNodeIdsource} 
                                        selectedNodeIddest={this.state.selectedNodeIddest}
                                        flowsInfo={this.state.flowsInfo}
                                        deleteFlowsHandler={this.deleteFlowsHandler}
                                    />
                            }
                        </div>   
                    </div>      
                </>
                }
            </>
        )

    }

}


export default withRouter(FlowsApp);