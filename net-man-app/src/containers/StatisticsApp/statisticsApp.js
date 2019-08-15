import React, { Component } from 'react';
import { Container, Row, Col, Table, Spinner } from 'reactstrap';
import { withRouter, Redirect } from 'react-router-dom';

//import styles from './statisticsApp.module.css';
import { openDaylightApi } from '../../services/openDaylightApi';

import TopologyGraph from '../TopologyGraph/topologyGraph';
import produce from 'immer';

import { getWidth, getHeight } from '../../utilities/utilities';


class StatisticsApp extends Component {

    state = {
        selectedNodeId: null,
        selectedLinkId: null
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

        // alert("rendering app")
        // console.log(this.props.location.data.graphNodes);
        const graphWidth = getWidth() * 0.6;
        const graphHeight = getHeight() * 0.7;

        return (
            <>
                {!this.props.location.data ?
                    <Redirect to="/"/>
                :

                    <div style={{borderTop: "2px solid gray", borderLeft: "2px solid gray", borderRight: "2px solid gray"}}>

                        <div className="d-flex d-flex-row justify-content-center" style={{backgroundColor: "GhostWhite"}}>
                            <div className="font-weight-bold customHeader1">
                                Topology Overview
                            </div>
                        </div>

                        <div className="d-flex d-flex-row" style={{borderTop: "2px solid gray", borderBottom: "2px solid gray"}}>
                            <div style={{borderRight: "2px solid gray"}}>
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

                            <div className="w-100 p-2" style={{backgroundColor: "GhostWhite"}}>
                                {this.state.selectedNodeId || this.state.selectedLinkId ?
                                    // <HostInfo/>
                                    null
                                : null
                                }
                            </div>
                        </div>

                        {this.state.selectedNodeId ?
                            <div className="d-flex d-flex-row" style={{borderBottom: "2px solid gray", backgroundColor: "GhostWhite"}}>
                                wswswswswsw
                            </div>
                            : null
                        }
                    </div>
                }
            </>
        )

    }

}


export default withRouter(StatisticsApp);