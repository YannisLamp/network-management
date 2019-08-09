import React, { Component } from 'react';
import { Container, Button, Row, Col, Form, FormGroup, Input, Label, Spinner, Card, CardHeader, CardText, CardBody, CardFooter,
    CardTitle, CardSubtitle, Table } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import produce from 'immer';

import styles from './topologyGraph.module.css';

import { Graph } from 'react-d3-graph';

import { openDaylightApi } from '../../services/openDaylightApi';
// import pcSVG from '../../assets/svg/hostComputer.svg';
import pcSVG from '../../assets/svg/pcIcon.svg';
//import pcSVG from '../../assets/svg/host80s.svg';
import switchSVG from '../../assets/svg/hub.svg';


const nodesInfo = {
    "Harry": {
        name: 'Harry', sur: "pap"
    }
}


// const linksInfo = {
//     ""
// }

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

// const data = {
//     nodes: [{ id: "Harry",    color:'red'}, { id: 'Sally' }, { id: 'Alice' }],
//     links: [{ source: 'Harry', target: 'Sally', la: "1" }, { source: 'Harry', target: 'Alice' }]
// };


class TopologyGraph extends Component {

    state = {
        isLoading: true,
        graphData: null,
    }

    

    componentDidMount() {
        openDaylightApi.getTopology()
            .then(data => {
                console.log('openDaylight data:');
                console.log(data['network-topology'].topology);
                this.setState(
                    produce(draft => {
                        draft.graphData = data['network-topology'].topology;
                        draft.isLoading = false;
                    })
                );
            });

        // openDaylightApi.getNodes()
        //     .then(data => {
        //         console.log('node data:');
        //         console.log(data);

        //     });
    }

    makeData = () => {
        let retNodes = [];
        let retLinks = [];

        // Can handle many topologies
        for (let topology of this.state.graphData) {
            // Nodes
            for (let node of topology.node) {
                // Check if node is a swicth or a host
                // Termination points have themselves as a termination point
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

        return { nodes: retNodes, links: retLinks };
    }




    // graph event callbacks
    onClickGraph = function() {
        window.alert(`Clicked the graph background`);
    };
    
    onClickNode = function(nodeId) {
        window.alert(`Clicked node ${nodeId}`);
        if (this.props.statisticsMode)
        { //just show extended info

        }
        else
        { //pick two nodes to calc their shortest path
            
        }
    };
    
    // onDoubleClickNode = function(nodeId) {
    //     window.alert(`Double clicked node ${nodeId}`);
    // };
    
    // onRightClickNode = function(event, nodeId) {
    //     window.alert(`Right clicked node ${nodeId}`);
    // };
    
    // onMouseOverNode = function(nodeId) {
    //     window.alert(`Mouse over node ${nodeId}`);
    // };
    
    // onMouseOutNode = function(nodeId) {
    //     window.alert(`Mouse out node ${nodeId}`);
    // };
    
    onClickLink = function(source, target, la) {
        window.alert(`Clicked link between ${source} and ${target} with  special info: ${la}`);
    }
    
    // onRightClickLink = function(event, source, target) {
    //     window.alert(`Right clicked link between ${source} and ${target}`);
    // };
    
    // onMouseOverLink = function(source, target) {
    //     window.alert(`Mouse over in link between ${source} and ${target}`);
    // };
    
    // onMouseOutLink = function(source, target) {
    //     window.alert(`Mouse out link between ${source} and ${target}`);
    // };


    render(){
        if (this.state.isLoading) {
            return null;
        }
        else { 
            const data = this.makeData();
            console.log('this is the data');
            console.log(data);
            return (   
                <Graph
                    id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                    data={data}
                    config={myConfig}
                    onClickNode={this.onClickNode}
                    onRightClickNode={this.onRightClickNode}
                    onClickGraph={this.onClickGraph}
                    onClickLink={this.onClickLink}
                    onRightClickLink={this.onRightClickLink}
                    onMouseOverNode={this.onMouseOverNode}
                    onMouseOutNode={this.onMouseOutNode}
                    onMouseOverLink={this.onMouseOverLink}
                    onMouseOutLink={this.onMouseOutLink}
                    className={styles.graphBox}
                />
            );
        }
    }



}


export default withRouter(TopologyGraph);