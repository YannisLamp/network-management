import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import TopoInfoRow from '../../TopoInfoRow/topoInfoRow';



const switchInfo = (props) => {
    
    return (
        <>
        <Container className="customBorder1" fluid style={{backgroundColor: "white"}}>
            <Row className="border">
                <Col sm="12" className="font-weight-bold d-flex justify-content-center">
                    <div>
                        Selected Node Information
                    </div>
                </Col>
            </Row>

            <TopoInfoRow name="Type" value={props.nodeInfo.switchType}/>
            <TopoInfoRow name="ID" value={props.nodeInfo.id}/>
          
        </Container>

        <Container className="customBorder1 mt-3" fluid style={{backgroundColor: "white"}}>
            <Row className="border">
                <Col sm="12" className="font-weight-bold d-flex justify-content-center">
                    <div>
                        Switch's ports
                    </div>
                </Col>
            </Row>
            <Row className="border">
                <Col sm="5" className="font-weight-bold d-flex justify-content-center border-right">
                    <div>
                        IDs
                    </div>
                </Col>
                <Col sm="7" className="font-weight-bold d-flex justify-content-center">
                    <div>
                        Destination
                    </div>
                </Col>
            </Row>

            {
                Object.keys(props.nodeInfo.connectors).map((portId, i) => (
                    <Row className="border" key={portId}>
                        <Col sm="5" className="font-weight-bold d-flex justify-content-start border-right">
                            <div>
                                <Button 
                                    className="p-0" 
                                    color="link"
                                    onClick={()=>props.switchPortClickedHandler(portId)}
                                >
                                    {portId}
                                </Button>
                            </div>
                        </Col>

                        <Col sm="7" className="font-weight-bold d-flex justify-content-start">
                            <div>
                                <Button 
                                    className="p-0" 
                                    color="link"
                                    onClick={ () => {
                                        if (props.filteredLinks[portId])
                                        { //another switch or host
                                            if (props.filteredLinks[portId].nodeType === "switch")
                                            { //switch
                                                return props.switchClickedHandler(props.filteredLinks[portId].nodeId, props.filteredLinks[portId].portId);
                                            }
                                            else
                                            { //host
                                                return props.nodeClickedHandler(props.filteredLinks[portId].nodeId);
                                            }
                                        }
                                        else
                                        { //local
                                            return props.switchPortClickedHandler(portId);
                                        }
                                    }}
                                >
                                    { props.filteredLinks[portId] ? props.filteredLinks[portId].nodeId : 'local'}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                ))
            }

        </Container>
        </>
    );
}


export default switchInfo;