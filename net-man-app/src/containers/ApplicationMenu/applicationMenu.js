import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';
import { Jumbotron } from 'reactstrap';

import { Link } from 'react-router-dom';

import styles from './applicationMenu.module.css';
import { openDaylightApi } from '../../services/openDaylightApi';
import { networkApi } from '../../services/networkApi';
import { getODLnodes, getODLlinks } from '../../utilities/ODL_utilities';


class CreateNetwork extends Component {
    


    inputChangedHandler = (event, formElemId) => {

    }

    testODLAPI = () => {

        openDaylightApi.getNodes()
            .then(data => {
                alert("OPD Data received !");
                console.log(data);     
            });

    }

    getODLinfo  = () => {
        openDaylightApi.getTopology()
        .then(data => {
            console.log('openDaylight data:');
            console.log(data['network-topology'].topology);
            
            const topologies = data['network-topology'].topology;

            const nodes = getODLnodes(topologies);
            const links = getODLlinks(topologies);

            const node_source = nodes[0]; 
            const node_dest = nodes[1];

            console.log("nodes: ", nodes);
            console.log("--------------");
            console.log("links: ", links);
            console.log("--------------");
            console.log("node source: ", node_source);
            console.log("node dest: ", node_dest);
            console.log("--------------");

            const requestData = {
                nodes: nodes,
                links: links,
                node_source: node_source,
                node_dest: node_dest
            }

            console.log(requestData);
            // return;

            networkApi.getShortestPath(requestData)
            .then(data => {
                alert("Shortest path calculated");
                console.log("shortest path: ", data.shortest_path)    
            });

            
        });
    }

    render() {
        return (
            <Container fluid className={styles.MenuContainer}>
                <Row>
                    <Col sm={6}>
                        <Link to="/statistics" className={styles.MenuLink}>
                            <Jumbotron>
                                <h1 className="display-5">Application 1</h1>
                                <p 
                                    className="lead"
                                >
                                    This is a simple hero unit, a simple Jumbotron-style component 
                                    for calling extra attention to featured content or information.
                                </p>
                                <hr className="my-2" />
                                <p>
                                    It uses utility classes for typography and spacing to space content 
                                    out within the larger container.
                                </p>
                            </Jumbotron>
                        </Link>
                    </Col>

                    {/* <Col sm={1}/> */}

                    <Col sm={6}>
                    {/* <Link to="/topology" className={styles.MenuLink}> */}
                        <Jumbotron onClick={this.getODLinfo}>   
                        {/* <Jumbotron> */}
                            <h1 className="display-5">Application 2</h1>
                            <p 
                                className="lead"
                            >
                                This is a simple hero unit, a simple Jumbotron-style component 
                                for calling extra attention to featured content or information.
                            </p>
                            <hr className="my-2" />
                            <p>
                                It uses utility classes for typography and spacing to space content 
                                out within the larger container.
                            </p>
                        </Jumbotron>
                    {/* </Link> */}
                    </Col>
                </Row>
                {/* <Row>
                    <Col sm={4}/>
                    <Col sm={4}>
                        <Link to="/" className={styles.MenuLink}>
                            <Jumbotron>
                                <h1 className="display-5">Application 1</h1>
                                <p 
                                    className="lead"
                                >
                                    This is a simple hero unit, a simple Jumbotron-style component 
                                    for calling extra attention to featured content or information.
                                </p>
                                <hr className="my-2" />
                                <p>
                                    It uses utility classes for typography and spacing to space content 
                                    out within the larger container.
                                </p>
                            </Jumbotron>
                        </Link>
                    </Col>
                    <Col sm={4}/>
                </Row> */}


            </Container>
        );
    }

}



export default CreateNetwork;