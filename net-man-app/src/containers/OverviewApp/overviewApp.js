import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';

import TopologyGraph from '../TopologyGraph/topologyGraph';
import produce from 'immer';

import { getWidth, getHeight } from '../../utilities/utilities';
import HostInfo from '../../components/OverviewApp/HostInfo/hostInfo';
import LinkInfo from '../../components/OverviewApp/LinkInfo/linkInfo';
import SwitchInfo from '../../components/OverviewApp/SwitchInfo/switchInfo';
import SwitchPortInfo from '../../components/OverviewApp/SwitchInfo/SwitchPortInfo/switchPortInfo';
import { getGraphLinks, getGraphNodes, getFirstNodeId, getNodeFirstPortInfo, getSwitchPortInfo } from '../../utilities/ODL_utilities';


class OverviewApp extends Component {

    state = {
        selectedNodeId: this.props.location.data ? getFirstNodeId(this.props.location.data.nodesInfo) : null,
        selectedLinkId: null,
        selectedPortInfo: this.props.location.data ? getNodeFirstPortInfo(this.props.location.data.nodesInfo, getFirstNodeId(this.props.location.data.nodesInfo)) : null
    }

    switchPortClickedHandler = (portId) => {
        this.setState(
            produce(draft => {
                draft.selectedPortInfo = getSwitchPortInfo(this.props.location.data.nodesInfo, this.state.selectedNodeId, portId);                
            })
        );
    }

    graphClickedHandler = () => {
        return;
    }

    nodeClickedHandler = (nodeId) => {
        this.setState(
            produce(draft => {
                draft.selectedNodeId = nodeId;
                draft.selectedLinkId = null;
                draft.selectedPortInfo = getNodeFirstPortInfo(this.props.location.data.nodesInfo, nodeId);                
            })
        );
    }

    switchClickedHandler = (nodeId, portId) => {
        this.setState(
            produce(draft => {
                draft.selectedNodeId = nodeId;
                draft.selectedLinkId = null;
                draft.selectedPortInfo = getSwitchPortInfo(this.props.location.data.nodesInfo, nodeId, portId);               
            })
        );
    }

    linkClickedHandler = (linkId) => {

        this.setState(
            produce(draft => {
                draft.selectedNodeId = null;
                draft.selectedLinkId = linkId;
                draft.selectedPortInfo = null;
            })
        );
    }

    // Given the whole linksInfo, return an object that maps each linkId
    // from the selected node to its destination node
    filterLinksForselectedSwitch = () => {
        const { selectedNodeId } = this.state;

        let filteredLinks = {};
        for (const [ , link] of Object.entries(this.props.location.data.linksInfo) ) {
            if (link.sourceInfo.nodeId === selectedNodeId) {
                filteredLinks[link.sourceInfo.portId] = link.destInfo;
            }
        }

        return filteredLinks;
    }

    getSelectedType = () => {
        if (this.state.selectedNodeId || this.state.selectedLinkId)
        {
            if (this.state.selectedNodeId)
            { //node clicked: (host or switch)
                return this.props.location.data.nodesInfo[this.state.selectedNodeId].type;
            }
            else
            { // link clicked
                return "link";
            }
        }
        else
        {
            return null;
        }
    }

    renderSideInfo = () => {
        const type = this.getSelectedType();
        if (!type)
        {
            return null;
        }
        else
        {
            if (type === "host")
            {
                return (
                    <HostInfo 
                        nodeInfo={this.props.location.data.nodesInfo[this.state.selectedNodeId]}
                        switchClickedHandler={()=>this.switchClickedHandler(
                            this.props.location.data.nodesInfo[this.state.selectedNodeId].attachedTo.nodeId,
                            this.props.location.data.nodesInfo[this.state.selectedNodeId].attachedTo.portId)}
                    />    
                );
            }
            else if (type === "switch")
            {
                const filteredLinks = this.filterLinksForselectedSwitch();
                return (
                    <SwitchInfo 
                        nodeInfo={this.props.location.data.nodesInfo[this.state.selectedNodeId]}
                        filteredLinks={filteredLinks}
                        nodeClickedHandler={this.nodeClickedHandler}
                        switchClickedHandler={this.switchClickedHandler}
                        switchPortClickedHandler={this.switchPortClickedHandler}
                    />    
                );
            }
            else if (type === "link")
            {
                return (
                    <LinkInfo 
                        nodesInfo={this.props.location.data.nodesInfo}
                        linkInfo={this.props.location.data.linksInfo[this.state.selectedLinkId]}
                        nodeClickedHandler={this.nodeClickedHandler}
                        switchClickedHandler={this.switchClickedHandler}
                    />    
                );
            }
            else 
            {
                // should not enter here
                return "den paizeis me poiothta";
            }
        }
    }


    renderSwitchInfo = () => {
        const type = this.getSelectedType();
        if ((!type) || (type !== "switch"))
        {
            return null;
        }
        else
        {
            return (
                <div className="d-flex d-flex-row p-3 align-items-center" style={{borderBottom: "2px solid gray", backgroundColor: "GhostWhite"}}>
                    <SwitchPortInfo switchPortInfo={this.state.selectedPortInfo}/>
                </div>
            );
        }
    }


    

    render () {
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
                                    nodes={getGraphNodes(this.props.location.data.nodesInfo, [this.state.selectedNodeId])}
                                    links={getGraphLinks(this.props.location.data.linksInfo, [this.state.selectedLinkId])}
                                    graphWidth={graphWidth}
                                    graphHeight={graphHeight}
                                />
                            </div>

                            <div className="w-100 p-2" style={{backgroundColor: "GhostWhite"}}>
                                {this.renderSideInfo()}
                            </div>
                        </div>

                        {this.renderSwitchInfo()}
                    </div>
                }
            </>
        )

    }

}


export default withRouter(OverviewApp);