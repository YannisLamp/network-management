import React, { Component } from 'react';
import { Container, Row, Col, Table, Spinner, Button, Alert } from 'reactstrap';
import { withRouter, Redirect } from 'react-router-dom';

//import styles from './statisticsApp.module.css';
import { networkApi } from '../../services/networkApi';
import { openDaylightApi } from '../../services/openDaylightApi';
import { openDaylightFlowsApi } from '../../services/openDaylightFlowsApi';

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
        flowsInfo: null
    }

    componentDidMount() {
        if (!this.props.location.data)
        {
            return;
        }

        networkApi.getShortestPath()
        .then(data => {
            // alert("Shortest path retrieved");
            console.log("shortest path: ", data.shortest_path);
            this.setState(
                produce(draft => {
                    draft.shortestPath = data.shortest_path;
                    if (data.shortest_path.length)
                    {
                        draft.selectedNodeIdsource = data.shortest_path[0];
                        draft.selectedNodeIddest = data.shortest_path[data.shortest_path.length-1];
                    }
                })
            );   
        });

        openDaylightApi.getFlows()
        .then(data => {
            // alert("Shortest path retrieved");
            console.log("flows info: ", data);
            if (data.success)
            {
                this.setState(
                    produce(draft => {
                        draft.flowsInfo = data.sourceDest;
                    })
                );   
            }
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
            // alert("Shortest path calculated");
            console.log("deleting shortestPath");
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

        // this.deleteShortestPathHandler();
        // alert("flows deleted")

        // return;
        openDaylightApi.deleteFlows()
        .then(data => {
            // alert("Shortest path calculated");
            console.log("deleting flows");
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
            })
        );
        // alert("creating flows");

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

        console.log(calcShortestPathData);

        networkApi.calcShortestPath(calcShortestPathData)
        .then(data => {
            // alert("Shortest path calculated");
            const shortestPath = data.shortest_path;
            console.log("shortest path: ", shortestPath);

            const srcNodeMac = this.props.location.data.nodesInfo[this.state.selectedNodeIdsource].mac;
            const destNodeMac = this.props.location.data.nodesInfo[this.state.selectedNodeIddest].mac;

            const flowsSwitchesData = getFlowsSwitchesData(shortestPath, this.props.location.data.linksInfo, this.props.location.data.nodesInfo, 0);

            const flowsCreationData = {
                srcMacAddress: srcNodeMac,
                destMacAddress: destNodeMac,
                nodesInfo: flowsSwitchesData
            };
            console.log("====>data for flows creation: ", flowsCreationData);
            openDaylightApi.createFlows()
            .then(data => {

                if (data.success)
                {
                    this.setState(
                        produce(draft => {
                            draft.flowsInfo = data.sourceDest;
                            draft.shortestPath = shortestPath;
                        })
                    );   
                    alert("Flows created")
                }
                else
                {
                    alert("Flows creation FAILED")
                }

            });

            // const dummyFlowsInfo = {
            //     success: true,
            //     sourceDest: {
            //         timeBefore: "0.892",
            //         timeAfter: "0.6419",
            //         timeDiff: "0.257",
            //         timeDiffPrc: "20"
            //     }
            // }

            // this.setState(
            //     produce(draft => {
            //         draft.shortestPath = data.shortest_path;
            //         draft.flowsInfo = dummyFlowsInfo;
            //     })
            // );  
        });

        // alert("Flows created")
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

        console.log("inside statistics app rendering");

        // alert("rendering app")
        const graphWidth = getWidth() * 0.9;
        const graphHeight = getHeight() * 0.6;

        console.log(this.state)

        console.log('nodes::::');
        console.log(this.props.location.data);

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
                                    <NodesSelection 
                                        selectedNodeIdsource={this.state.selectedNodeIdsource} 
                                        selectedNodeIddest={this.state.selectedNodeIddest}
                                        resetSelectedNodesHandler={this.resetSelectedNodesHandler}
                                        removeSelectedNodeHandler={this.removeSelectedNodeHandler}
                                        nodesSet={this.nodesSet()}
                                        createFlowsHandler={this.createFlowsHandler}
                                    />
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