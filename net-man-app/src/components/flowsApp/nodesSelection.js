import React from 'react';
import { Row, Col, Button, Container } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const nodesSelection = (props) => {

    return (
        <Container fluid className="customBorder1">

            <Row className="border">
                <Col sm="12" className="font-weight-bold border d-flex justify-content-center">
                    <div>
                        Selected Nodes
                    </div>
                </Col>
            </Row>

            <Row className="border-bottom align-items-center">
                <Col sm="3" className="font-weight-bold border">
                    Source Node
                </Col>

                <Col sm="6" className="border">
                    {props.selectedNodeIdsource ? props.selectedNodeIdsource
                    : 
                        <div className="font-italic text-muted">
                            None selected
                        </div>
                    }
                </Col>

                <Col sm="3" className="d-flex justify-content-end">
                    <Button size="sm" className="font-weight-bold" onClick={ ()=>props.removeSelectedNodeHandle("source") }>
                        Remove Node 
                        <FontAwesomeIcon className="ml-2" icon={faTrashAlt} />                    
                    </Button>
                </Col>
            </Row>

            {/* <Row className="border">
                <Col sm="4" className="font-weight-bold border">
                    Destination Node
                </Col>

                <Col sm="6" className="border">
                    {this.state.selectedNodeIddest ? this.state.selectedNodeIddest
                    : 
                        <div className="font-italic text-muted">
                            None selected
                        </div>
                    }                                
                </Col>

                <Col sm="2" className="d-flex justify-content-end">
                    <Button size="md">
                        Remove <i className="fas fa-trash-alt"></i>
                    </Button>
                </Col>
            </Row>

            {
                ! this.nodesSet() ? null
                :
                <Row className="border mt-3">
                    <Col sm="12" className="border d-flex justify-content-end">
                        <Button size="lg" className="font-weight-bold mr-2">
                            Reset Nodes
                        </Button>

                        <Button size="lg" color="primary" className="font-weight-bold">
                            Find Path
                        </Button>
                    </Col>
                </Row>
            } */}
        </Container>
    );
}


export default nodesSelection;