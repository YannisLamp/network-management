import React from 'react';
import { Container, Row, Col, Table, Button } from 'reactstrap';



const switchPortInfo = (props) => {

    // console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk: ",props.nodeInfo)

    return (
        // <div className="d-flex d-flex-column"
        <Container fluid>
            <Row className="customBorder1">
                <Col sm="12" className="justify-content-center d-flex w-100 p-0">
                <Table bordered size="sm" responsive className="m-0">
                    <thead>
                        <tr>
                            <th>Port ID</th>
                            <th>Port Name</th>
                            <th>Port Number</th>
                            <th>MAC address</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            {/* <th scope="row">{props.switchPortInfo.id}</th> */}
                            <td>{props.switchPortInfo.id}</td>
                            <td>{props.switchPortInfo["flow-node-inventory:name"]}</td>
                            <td>{props.switchPortInfo["flow-node-inventory:port-number"]}</td>
                            <td>{props.switchPortInfo["flow-node-inventory:hardware-address"]}</td>
                        </tr>
                    </tbody>
                </Table>
                </Col>
            </Row>

            <Row className="customBorder1 mt-3">
                <Col sm="12" className="justify-content-center d-flex w-100 p-0">
                <Table bordered size="sm" responsive className="m-0">
                    <thead>
                        <tr>
                            <th>Rx Pkts</th>
                            <th>Tx Pkts</th>

                            <th>Rx Bytes</th>
                            <th>Tx Bytes</th>

                            <th>Rx Drops</th>
                            <th>Tx Drops</th>

                            <th>Rx Errs</th>
                            <th>Tx Errs</th>

                            <th>Rx Frame Errs</th>
                            <th>Rx OverRun Errs</th>
                            <th>Rx CRC Errs</th>

                            <th>Collisions</th>

                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>{props.switchPortInfo["opendaylight-port-statistics:flow-capable-node-connector-statistics"].packets.received}</td>
                            <td>{props.switchPortInfo["opendaylight-port-statistics:flow-capable-node-connector-statistics"].packets.transmitted}</td>

                            <td>{props.switchPortInfo["opendaylight-port-statistics:flow-capable-node-connector-statistics"].bytes.received}</td>
                            <td>{props.switchPortInfo["opendaylight-port-statistics:flow-capable-node-connector-statistics"].bytes.transmitted}</td>

                            <td>{props.switchPortInfo["opendaylight-port-statistics:flow-capable-node-connector-statistics"]["receive-drops"]}</td>
                            <td>{props.switchPortInfo["opendaylight-port-statistics:flow-capable-node-connector-statistics"]["transmit-drops"]}</td>
                            
                            <td>{props.switchPortInfo["opendaylight-port-statistics:flow-capable-node-connector-statistics"]["receive-errors"]}</td>
                            <td>{props.switchPortInfo["opendaylight-port-statistics:flow-capable-node-connector-statistics"]["transmit-errors"]}</td>
                            
                            <td>{props.switchPortInfo["opendaylight-port-statistics:flow-capable-node-connector-statistics"]["receive-frame-error"]}</td>
                            <td>{props.switchPortInfo["opendaylight-port-statistics:flow-capable-node-connector-statistics"]["receive-over-run-error"]}</td>
                            <td>{props.switchPortInfo["opendaylight-port-statistics:flow-capable-node-connector-statistics"]["receive-crc-error"]}</td>
                            
                            <td>{props.switchPortInfo["opendaylight-port-statistics:flow-capable-node-connector-statistics"]["collision-count"]}</td>
                        </tr>
                    </tbody>
                </Table>
                </Col>
            </Row>
        </Container>
    );
}

export default switchPortInfo;