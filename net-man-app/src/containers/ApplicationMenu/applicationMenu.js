import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';
import { Jumbotron } from 'reactstrap';

import { Link } from 'react-router-dom';

import './applicationMenu.css';

class CreateNetwork extends Component {
    
    

    inputChangedHandler = (event, formElemId) => {

    }

    render() {
        return (
            <Container fluid className="MenuContainer">
                <Row>
                    <Col sm={6}>
                        <Link to="/" className="MenuLink">
                            <Jumbotron className="Test">
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
                                {/* <p className="lead">
                                    <Button color="primary">Learn More</Button>
                                </p> */}
                            </Jumbotron>
                        </Link>
                    </Col>

                    {/* <Col sm={1}/> */}

                    <Col sm={6}>
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
                            <p className="lead">
                                <Button color="primary">Learn More</Button>
                            </p>
                        </Jumbotron>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}/>
                    <Col sm={4}>
                    <Jumbotron>
                            <h1 className="display-5">Terminate Network, Create Another</h1>
                            <hr className="my-2" />
                            <p>
                                It uses utility classes for typography and spacing to space content 
                                out within the larger container.
                            </p>
                            <p className="lead">
                                <Button color="primary">Learn More</Button>
                            </p>
                        </Jumbotron>
                    </Col>
                    <Col sm={4}/>
                </Row>


            </Container>
        );
    }

}



export default CreateNetwork;