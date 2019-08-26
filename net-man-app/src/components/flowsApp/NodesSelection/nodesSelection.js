import React from 'react';
import { Row, Col, Button, Container } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const nodesSelection = (props) => {

    //console.log("dddddddddddddd", props)

    return (
        <Container fluid className="customBorder1">

            <Row className="border-bottom">
                <Col sm="12" className="font-weight-bold border d-flex justify-content-center p-2">
                    <div>
                        Selected Nodes
                    </div>
                </Col>
            </Row>

            <Row className="border-bottom">
                <Col sm="3" className="d-flex font-weight-bold border-right align-items-center">
                    <div>
                        Source Node
                    </div>
                </Col>

                <Col sm="6" className="d-flex align-items-center">
                    {props.selectedNodeIdsource ? props.selectedNodeIdsource
                    : 
                        <div className="font-italic text-muted">
                            None selected
                        </div>
                    }
                </Col>

                {
                    props.selectedNodeIdsource ? 
                        <Col sm="3" className="d-flex justify-content-end p-1 border-left">
                            <Button block size="sm" style={{color: "GhostWhite"}} className="font-weight-bold" onClick={ ()=>props.removeSelectedNodeHandler("source") }>
                                Remove Node 
                                <FontAwesomeIcon className="ml-2" icon={faTrashAlt} />                    
                            </Button>
                        </Col>
                    : null
                }
            </Row>

            <Row className="border-bottom">
                <Col sm="3" className="d-flex font-weight-bold border-right align-items-center">
                    <div>
                        Destination Node
                    </div>
                </Col>

                <Col sm="6" className="d-flex align-items-center">
                    {props.selectedNodeIddest ? props.selectedNodeIddest
                    : 
                        <div className="font-italic text-muted">
                            None selected
                        </div>
                    }
                </Col>

                {
                    props.selectedNodeIddest ? 
                        <Col sm="3" className="d-flex justify-content-end p-1 border-left">
                            <Button block size="sm" style={{color: "GhostWhite"}} className="font-weight-bold" onClick={ ()=>props.removeSelectedNodeHandler("dest") }>
                                Remove Node 
                                <FontAwesomeIcon className="ml-2" icon={faTrashAlt} />                    
                            </Button>
                        </Col>
                    : null
                }
            </Row>

            {
                props.nodesSet ?
                    <Row className="mt-3 mb-3">
                        <Col sm="12" className="d-flex justify-content-end">
                            <Button size="md" style={{color: "GhostWhite"}} className="font-weight-bold mr-3" onClick={ ()=>props.resetSelectedNodesHandler() }>
                                Reset Nodes
                            </Button>

                            <Button size="md" color="primary" style={{color: "GhostWhite"}} className="font-weight-bold mr-3" onClick={ ()=>props.createFlowsHandler() }>
                                Create Flows 
                            </Button>
                        </Col>
                    </Row>
                : null
            }
        </Container>
    );
}


export default nodesSelection;