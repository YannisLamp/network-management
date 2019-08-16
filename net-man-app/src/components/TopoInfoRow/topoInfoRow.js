import React from 'react';
import { Row, Col } from 'reactstrap';


const topoInfoRow = (props) => {

    return (
        <Row className="border">
            <Col sm="4" className="font-weight-bold border-right">
                {props.name}
            </Col>

            <Col sm="8" className="border-left align-self-center">
                {props.value}
            </Col>
        </Row>
    );
}


export default topoInfoRow;