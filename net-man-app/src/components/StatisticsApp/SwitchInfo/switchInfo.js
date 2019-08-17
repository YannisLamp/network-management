import React from 'react';
import { Container, Row, Col, Table, Spinner, Button } from 'reactstrap';
import TopoInfoRow from '../../TopoInfoRow/topoInfoRow';



const switchInfo = (props) => {

    // console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk: ",props.nodeInfo)

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
                        Switch's ports IDs
                    </div>
                </Col>
            </Row>

            {
                Object.keys(props.nodeInfo.connectors).map((portId, i) => (
                    <Row className="border" key={portId}>
                        <Col sm="3"> </Col>
                        <Col sm="6" className="font-weight-bold d-flex justify-content-start">
                            <div>
                                <Button 
                                    className="p-0" 
                                    color="link"
                                    onClick={()=>alert("aas")}
                                >
                                    {portId}
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