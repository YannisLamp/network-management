
import React, { Component } from 'react';
import { Container, Button, Row, Col, Form, FormGroup, Input, Label, Spinner, Card, CardHeader, CardText, CardBody, CardFooter,
    CardTitle, CardSubtitle } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import produce from 'immer';
import styles from './createNetwork.module.css';
import { networkApi } from '../../services/networkApi';

class CreateNetwork extends Component {

    state = {
        formElems:{
            ip: {
                value: "localhost"
            },

            port: {
                value: "default"
            },

            topoType: {
                value: "linear"
            },

            switchType: {
                value: "OVSSwitch"
            },

            nodesPerSwitch: {
                value: 5
            },

            switches: {
                value: 8
            },

            mac: {
                value: true
            },

            // defaultTope: {
            //     value: false
            // }


        },

        isLoading: false,

    }

    inputChangedHandler = (event, formElemId) => {
        if (formElemId === "mac")
        {
            this.setState(
                produce(draft => {
                    draft.formElems.mac.value = !draft.formElems.mac.value;
                })
            );
            return;
        }

        const val = event.target.value;
        this.setState(
            produce(draft => {
                draft.formElems[formElemId].value = val;
            })
        );
    }

    submitHandler = (event) => {
        event.preventDefault();
        // Set State to loading
        this.setState(
            produce(draft => {
                draft.isLoading = true;
            })
        );
        

        let formData = {};
     
        for ( let key in this.state.formElems ) 
        {
            formData[key] = this.state.formElems[key].value;
        }

        console.log("---Form Data---");
        console.log(formData);
        console.log("---------------");


        networkApi.createNetwork(formData)
            .then(data => {
                alert(data.msg)
                // this.setState(
                //     produce(draft => {
                //         draft.isLoading = false;
                //     })
                // );
                this.props.networkStateHandler();
                this.props.history.replace('/');      
            });

    }

    render() {
        return (
                <Row className="d-flex align-items-center">
                <Col sm={3}></Col>
                <Col sm={6}>
                    <Form onSubmit={this.submitHandler} className={styles.formBorder + " p-4"}>
                        <Row form className="pb-3 border-bottom mb-3">
                            <Col sm="12" className="d-flex justify-content-start font-weight-bold">
                                <div className={styles.formTitle + " text-primary"}>
                                    Create and Initialize a Mininet Network
                                </div>
                            </Col>
                        </Row>

                        <Row form>
                            <Col sm={5}>
                                <FormGroup>
                                    <Label for="ip"  className="font-weight-bold small float-left">Controller IP</Label>
                                    <Input type="text" id="ip" value={this.state.formElems.ip.value} onChange={ (e) => this.inputChangedHandler(e, "ip") }/>
                                </FormGroup>
                            </Col>

                            <Col sm={2}> </Col>

                            <Col sm={5}>
                                <FormGroup>
                                    <Label for="port"  className="font-weight-bold small float-left">Port Number</Label>
                                    <Input type="text" id="port" value={this.state.formElems.port.value} onChange={ (e) => this.inputChangedHandler(e, "port")}/>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form>
                            <Col sm={5}>
                                <FormGroup>
                                    <Label for="topoType" className="font-weight-bold small float-left">Topology Type</Label>
                                    <Input type="select" value={this.state.formElems.topoType.value}  id="topoType" onChange={ (e) => this.inputChangedHandler(e, "topoType") }>
                                        <option value="linear">linear</option>
                                        <option value="tree">tree</option>
                                        <option value="single">single</option>
                                    </Input>
                                </FormGroup>
                            </Col>

                            <Col sm={2}> </Col>

                            <Col sm={5}>
                                <FormGroup>
                                    <Label for="switchType" className="font-weight-bold small float-left">Switch Type</Label>
                                    <Input type="select" value={this.state.formElems.switchType.value}  id="switchType" onChange={ (e) => this.inputChangedHandler(e, "switchType") }>
                                        <option value="OVSSwitch">OVS</option>
                                        <option value="OVSKernelSwitch"> OVSK</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form>
                            <Col sm={5}>
                                <FormGroup>
                                    <Label for="nodesPerSwitch"  className="font-weight-bold small float-left">Number of Nodes per Switch</Label>
                                    <Input type="number" id="nodesPerSwitch" value={this.state.formElems.nodesPerSwitch.value} onChange={ (e) => this.inputChangedHandler(e, "nodesPerSwitch") }/>
                                </FormGroup>
                            </Col>
                        
                            <Col sm={2}> </Col>

                            <Col sm={5}>
                                <FormGroup>
                                    <Label for="switches"  className="font-weight-bold small float-left">Number of Switches</Label>
                                    <Input type="number" id="switches" value={this.state.formElems.switches.value} onChange={ (e) => this.inputChangedHandler(e, "switches") }/>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form>
                            <Col sm={12}>
                                <FormGroup check inline>
                                    <Label check className="font-weight-bold">
                                        <Input type="checkbox" checked={this.state.formElems.mac.value} onChange={ (e) => this.inputChangedHandler(e, "mac") } /> automatically set mac addresses
                                    </Label>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form className="pt-4 border-top mt-3">

                            { this.state.isLoading ?  
                                <Col sm={12} style={{ width: '2rem', height: '2rem' }} className="d-flex justify-content-end">
                                    <Spinner color="primary" />
                                </Col>
                                :
                                <Col sm={12} className="d-flex justify-content-end">
                                    <Button size="sm" color="secondary" className="font-weight-bold mr-4">
                                        Create Default Network
                                    </Button>

                                    <Button size="sm" color="primary" className="font-weight-bold">
                                        Create Network
                                    </Button>
                                </Col>
                            }
                        </Row>

                    </Form>
                </Col>

            </Row>

        );
    }

}



export default withRouter(CreateNetwork);