import React, { Component } from 'react';
import { Container, Row, Col, Table } from 'reactstrap';


import { Link } from 'react-router-dom';

//import styles from './statisticsApp.module.css';
import { openDaylightApi } from '../../services/openDaylightApi';

import TopologyGraph from '../TopologyGraph/topologyGraph';
import produce from 'immer';


class StatisticsApp extends Component {

    state = {
        selectedNodeInfo: null
    }

    nodeClickedHandler = (nodeInfo) => {
        
    }


    render () {

        return (
            <Container fluid>
                <Row 
                //className="border"
                >
                    <Col sm="7" className="border">
                        <TopologyGraph
                            nodeClickedHandler={this.nodeClickedHandler}
                        />
                    </Col>

                    <Col sm="5" className="border">
                        <Table responsive>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Table heading</th>
                                <th>Table heading</th>
                                <th>Table heading</th>
                                <th>Table heading</th>
                                <th>Table heading</th>
                                <th>Table heading</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                            </tr>
                            </tbody>
                        </Table>
                        
                    </Col>
                </Row>

            </Container>
        )

    }

}


export default StatisticsApp;