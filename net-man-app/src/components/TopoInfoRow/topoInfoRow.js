import React from 'react';
import { Row, Col, Button } from 'reactstrap';


const topoInfoRow = (props) => {

    return (
        <Row className="border">
            <Col sm="4" className="font-weight-bold border-right">
                {props.name}
            </Col>

            <Col sm="8" className="border-left align-self-center" 
                 onClick={()=> { if (props.nodeClickedHandler) { props.nodeClickedHandler(); } else { return; } } }
            >
                {   
                    props.clickableValue ?
                    <Button className="p-0" color="link">{props.value}</Button>
                    : props.value
                }
                
            </Col>
        </Row>
    );
}


export default topoInfoRow;