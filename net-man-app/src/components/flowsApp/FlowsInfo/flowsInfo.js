import React from 'react';
import { Container, Row, Col, Table, Button } from 'reactstrap';


const flowsInfo = (props) => {

    console.log("nnnnnnnnnnnnnnnnnnnn: ", props)

    return (
        <Container fluid className="customBorder1">
            <Row>
                <Col sm="12" className="justify-content-center d-flex w-100 p-0">
                <Table bordered size="sm" responsive className="m-0">
                    <thead>
                        <tr>
                            <th>Source Node Id</th>
                            <th>Destination Node Id</th>

                            <th>No Flows Time (ms)</th>
                            <th>With Flows Time (ms)</th>

                            <th>Time Difference (ms)</th>
                            <th>Time Improvement (%)</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>{props.selectedNodeIdsource}</td>
                            <td>{props.selectedNodeIddest}</td>

                            <td>{props.flowsInfo.timeBefore}</td>
                            <td>{props.flowsInfo.timeAfter}</td>

                            <td>{props.flowsInfo.timeDiff}</td>
                            <td>{props.flowsInfo.timeDiffPrc}</td>
                        </tr>
                    </tbody>
                </Table>
                </Col>
            </Row>

            <Row className="mt-3 mb-3">
                <Col sm="12" className="d-flex justify-content-end">
                    <div>
                        <Button size="md" style={{color: "GhostWhite"}} className="font-weight-bold" onClick={props.deleteFlowsHandler}>
                            Delete Flows
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}


export default flowsInfo;