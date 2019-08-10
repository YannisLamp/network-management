import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import produce from 'immer';

import styles from './topologyGraph.module.css';
import { Graph } from 'react-d3-graph';


const myConfig = {
    nodeHighlightBehavior: true,
    node: {
        color: 'lightgreen',
        size: 350,
        highlightStrokeColor: 'blue'
    },
    link: {
        highlightColor: 'lightblue'
    },
    //width: 1550, //props
    width: 1000,
    height: 800,
    d3: {
        gravity: -150,
        //linkLength: 100,
        //linkLength: (d) => 100,
        //alphaTarget: 1,
    }
};


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
        this.props.linkClickedHandler(source + "-" + target);
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