import React from 'react';
import { Container, Row, Col, Table, Spinner } from 'reactstrap';
import TopoInfoRow from '../../TopoInfoRow/topoInfoRow';



const hostInfo = (props) => {

    // console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk: ",props.nodeInfo)

    return (
        <Container className="customBorder1" fluid style={{backgroundColor: "white"}}>
            <Row className="border">
                <Col sm="12" className="font-weight-bold d-flex justify-content-center">
                    <div>
                        Selected Node Information
                    </div>
                </Col>
            </Row>

            <TopoInfoRow name="Type" value={props.nodeInfo.type}/>
            <TopoInfoRow name="ID" value={props.nodeInfo.id}/>
            <TopoInfoRow name="IP address" value={props.nodeInfo.ip}/>
            <TopoInfoRow name="MAC address" value={props.nodeInfo.mac}/>
            <TopoInfoRow name="Attached to" value={props.nodeInfo.attachedTo.portId} 
                nodeClickedHandler={props.switchClickedHandler}
                clickableValue
            />
        </Container>
    );
}


export default hostInfo;