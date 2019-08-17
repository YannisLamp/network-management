import React from 'react';
import { Container, Row, Col, Table, Button } from 'reactstrap';



const switchPortInfo = (props) => {

    // console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk: ",props.nodeInfo)

    return (
        <div className="d-flex w-100 customBorder1">
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
        </div>
    );
}

export default switchPortInfo;