import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';
import { Jumbotron } from 'reactstrap';

import { Link } from 'react-router-dom';

import styles from './applicationMenu.module.css';
import { openDaylightApi } from '../../services/openDaylightApi';


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

    render() {
        return (
            <Container fluid className={styles.MenuContainer}>
                <Row>
                    <Col sm={6}>
                        {/* <Link to="/" className={styles.MenuLink}> */}
                            <Jumbotron onClick={this.testODLAPI}>
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
                        {/* </Link> */}
                    </Col>

                    {/* <Col sm={1}/> */}

                    <Col sm={6}>
                    <Link to="/" className={styles.MenuLink}>
                            <Jumbotron>
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
                        </Link>
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