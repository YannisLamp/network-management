import React, { Component } from 'react';
import { Container, Row, Col, Jumbotron, Spinner } from 'reactstrap';

import { Link, withRouter } from 'react-router-dom';

import styles from './applicationMenu.module.css';
import { openDaylightApi } from '../../services/openDaylightApi';
import { networkApi } from '../../services/networkApi';
import { getNodesInfo, getLinksInfo, extractSwitchesInfo } from '../../utilities/ODL_utilities';
//import pcSVG from '../../assets/svg/pcIcon.svg';
//import switchSVG from '../../assets/svg/hub.svg';
import produce from 'immer';



class CreateNetwork extends Component {
    
    state = {
        nodesInfo: null,
        linksInfo: null
    }


    componentDidMount() {
        // alert("did mount"); peritto
        if (this.state.graphNodes)
        { // graph data have already been retrieved
            alert("already retrieved")
            return;
        }

        // alert("go to retrieve data")

        networkApi.pingAll()
            .then(pingAllres => {

                openDaylightApi.getTopology()
                    .then(topologyData => {
                        
                        openDaylightApi.getNodes()
                            .then(nodesData => {

                                console.log("pingall: ", pingAllres)

                                // console.log('++++++> openDaylight nodes data:');
                                // console.log(nodesData.nodes.node);
                                // console.log("----------------");
                                // console.log("=========================");


                                // console.log('++++++> openDaylight topology data:');
                                // console.log(topologyData['network-topology'].topology);
                                // console.log("----------------");
                                // console.log("=========================");

                                // topologyData['network-topology'].topology[0].node is the array of nodes
                                const topologyNodes = topologyData['network-topology'].topology[0].node;

                                // topologyData['network-topology'].topology[0].link is the array of links
                                const topologyLinks = topologyData['network-topology'].topology[0].link;

                                // nodesData.nodes.node is the array of nodes
                                const switchesAnalytics = nodesData.nodes.node;    

                                const switchesDatasets = extractSwitchesInfo(switchesAnalytics);
                                const linksInfo = getLinksInfo(topologyLinks);
                                const nodesInfo = getNodesInfo(topologyNodes, switchesDatasets);

                                this.setState(
                                    produce(draft => {
                                        draft.nodesInfo = nodesInfo;
                                        draft.linksInfo = linksInfo;
                                    })
                                );
                            });
                    });
            });
    }


    render() {

        console.log("---> Printing ODL Info <---");

        console.log("--> Graph Nodes: ", this.state.graphNodes);
        console.log("--------------------");

        console.log("--> Nodes Info: ", this.state.nodesInfo);
        console.log("--------------------");

        console.log("========================");

        console.log("--> Graph Links: ", this.state.graphLinks )
        console.log("--------------------");

        console.log("--> LinksInfo: ", this.state.linksInfo )
        console.log("--------------------");


        return (
            <Container fluid className={styles.MenuContainer}>

                { !this.state.nodesInfo ?
                <>
                    <Row>
                        <Col className="d-flex justify-content-center">
                            <div>
                                <Spinner style={{ width: '10rem', height: '10rem' }} color="primary" />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="d-flex justify-content-center font-italic text-muted">
                            <div>
                                Retrieving OpenDaylight data ...
                            </div>
                        </Col>
                    </Row>
                </>
                :
                <>
                <Row>
                    <Col className="d-flex justify-content-center mb-5 font-weight-bold">
                        <div className={styles.title + " text-primary"}>
                            Network Management Applications
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <Link 
                            className={styles.MenuLink}
                            to={{   
                                    pathname: '/overview', 
                                    data: { 
                                        nodesInfo: this.state.nodesInfo,
                                        linksInfo: this.state.linksInfo
                                    } 
                                }} 
                        >
                            <Jumbotron className={styles.border + " h-100"} >
                                <h1 className="display-5">Network Overview</h1>
                                <p 
                                    className="lead"
                                >
                                    This is a web application that visualizes a mininet topology, providing usefull info and statistics.
                                </p>
                                <hr className="my-2" />
                                <p>
                                    You can navigate among network nodes and links by clicking them on the topology graph.
                                    You can also click on nodes in the info panel at the right side.
                                </p>
                            </Jumbotron>
                        </Link>
                    </Col>

                    <Col sm={6}>
                        <Link 
                            className={styles.MenuLink}
                            to={{   
                                    pathname: '/flows', 
                                    data: { 
                                        nodesInfo: this.state.nodesInfo,
                                        linksInfo: this.state.linksInfo
                                    } 
                                }} 
                        >
                            <Jumbotron className={styles.border + " h-100"}>
                                <h1 className="display-5">Flow Creator</h1>
                                <p 
                                    className="lead"
                                >
                                    This is a web application that provides a selectable collection of mininet nodes, 
                                    then given a pair, creates custom flows between them, improving network performance. 
                                </p>
                                <hr className="my-2" />
                                <p>
                                    You can choose source and destination nodes to create custom flows between them. Then, 
                                    proper measurements are made so that we can determine any network performance improvement.
                                </p>
                            </Jumbotron>
                        </Link>
                    </Col>
                </Row>
                </>
                }

            </Container>
        );
    }

}



export default withRouter(CreateNetwork);
