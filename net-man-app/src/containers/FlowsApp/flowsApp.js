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
import { getGraphLinks, getGraphNodes, extractLinksFromNodesPath, getODLnodes, getODLlinks } from '../../utilities/ODL_utilities';

import NodesSelection from '../../components/flowsApp/NodesSelection/nodesSelection';



class FlowsApp extends Component {

    state = {
        selectedNodeIdsource: null,
        selectedNodeIddest: null,
        sortestPath: [],
        errorMessage: null,

        // list of shortest path mac addresses
    }

    componentDidMount() {
        networkApi.getShortestPath()
        .then(data => {
            alert("Shortest path retrieved");
            console.log("shortest path: ", data.shortest_path);
            this.setState(
                produce(draft => {
                    // draft.sortestPath = ["openflow:10", "openflow:9", "openflow:1"] ;
                    // draft.sortestPath = ["openflow:1", "openflow:9", "openflow:10"] ;
                    draft.sortestPath = data.shortest_path;
                    if (data.shortest_path.length)
                    {
                        draft.selectedNodeIdsource = data.shortest_path[0];
                        draft.selectedNodeIddest = data.shortest_path[data.shortest_path.length-1];
                    }
                })
            );   
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

    deleteFlowsHandler = () => {
        
    }

    createFlowsHandler = () => {
        this.setState(
            produce(draft => {
                draft.errorMessage = null;
            })
        );
        alert("creating flows");

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

        const requestData = {
            nodes: nodes,
            links: links,
            node_source: node_source,
            node_dest: node_dest
        }

        console.log(requestData);

        networkApi.calcShortestPath(requestData)
        .then(data => {
            alert("Shortest path calculated");
            console.log("shortest path: ", data.shortest_path);
            this.setState(
                produce(draft => {
                    // draft.sortestPath = ["openflow:10", "openflow:9", "openflow:1"] ;
                    // draft.sortestPath = ["openflow:1", "openflow:9", "openflow:10"] ;
                    draft.sortestPath = data.shortest_path;
                })
            );   
        });

        alert("Flows created")
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
        // openDaylightFlowsApi.createFlow('openflow:1', '0', '150', '00:00:00:00:00:01', '00:00:00:00:00:03', 
        //     '1')
        //     .then(response => {
        //         console.log('paopapapapa');
        //         console.log(response);
        //     })

        console.log("inside statistics app rendering");

        // alert("rendering app")
        // console.log(this.props.location.data.graphNodes);
        const graphWidth = getWidth() * 0.9;
        const graphHeight = getHeight() * 0.6;

        //console.log(this.state)

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
                                nodes={getGraphNodes(this.props.location.data.nodesInfo, this.state.sortestPath)}
                                links={getGraphLinks(this.props.location.data.linksInfo, extractLinksFromNodesPath(this.state.sortestPath))}
                                graphWidth={graphWidth}
                                graphHeight={graphHeight}
                            />
                        </div>

                        <div className="d-flex d-flex-row p-2" style={{backgroundColor: "GhostWhite"}}>
                            {
                                !this.state.sortestPath.length ?
                                    <NodesSelection 
                                        selectedNodeIdsource={this.state.selectedNodeIdsource} 
                                        selectedNodeIddest={this.state.selectedNodeIddest}
                                        resetSelectedNodesHandler={this.resetSelectedNodesHandler}
                                        removeSelectedNodeHandler={this.removeSelectedNodeHandler}
                                        nodesSet={this.nodesSet()}
                                        createFlowsHandler={this.createFlowsHandler}
                                    />
                                :
                                "shortest path calculated flows created"
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