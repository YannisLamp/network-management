import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
//import produce from 'immer';

import styles from './topologyGraph.module.css';
import { Graph } from 'react-d3-graph';





class TopologyGraph extends Component {

    // graph event callbacks
    onClickGraph = () => {
        this.props.graphClickedHandler();
    };
    
    onClickNode = (nodeId) => {
        this.props.nodeClickedHandler(nodeId);
    };
    
    // onMouseOverNode = function(nodeId) {
    //     window.alert(`Mouse over node ${nodeId}`);
    // };
    
    // onMouseOutNode = function(nodeId) {
    //     window.alert(`Mouse out node ${nodeId}`);
    // };
    
    onClickLink = (source, target) => {
        this.props.linkClickedHandler(source + "/" + target);
    }
    
    // onMouseOverLink = function(source, target) {
    //     window.alert(`Mouse over in link between ${source} and ${target}`);
    // };
    
    // onMouseOutLink = function(source, target) {
    //     window.alert(`Mouse out link between ${source} and ${target}`);
    // };

    render(){
        // alert("graph is rendering")
        const graphData = {
            nodes: this.props.nodes,
            links: this.props.links
        }

        // console.log("graph Width: ", this.props.graphWidth);
        // console.log("graph Height", this.props.graphHeight);

        const myConfig = {
            // focusZoom: 1,
            nodeHighlightBehavior: true,
            highlightDegree: 0,
            node: {
                fontColor: "gray",  // green when clicked
                size: 450,
                fontSize: 18,
                fontWeight: "normal",

                highlightFontSize: 18,
                highlightFontWeight: "bold",
            },
            link: {
                // color: 'gray',  // blue when clicked
                highlightColor: 'lightblue'
            },
            //width: 1550, //props
            width: this.props.graphWidth,
            height: this.props.graphHeight,
            d3: {
                gravity: -230,
                // linkLength: 150,
                // linkLength: (d) => 150,
                // alphaTarget: 0.5,
            }
        };
        
        return (   
            <Graph
                id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                data={graphData}
                config={myConfig}
                onClickNode={this.onClickNode}
                onClickGraph={this.onClickGraph}
                onClickLink={this.onClickLink}
                className={styles.graphBox}
            />
        );
        
    }

}

export default withRouter(TopologyGraph);