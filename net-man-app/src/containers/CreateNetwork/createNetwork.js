
import React, { Component } from 'react';
import { Button, Row, Col, Form, FormGroup, Input, Label, Spinner } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import produce from 'immer';
import styles from './createNetwork.module.css';
import { networkApi } from '../../services/networkApi';


const formInputNames = {
    tree: {
        switchNum: "Depth",
        nodesPerSwitch: "Fanout",
        defaults : {
            ip: "localhost",
            port: "default",
            switchType: "OVSSwitch",
            mac: true,
            switchNum: 4,
            nodesPerSwitch: 2, 
        }
    },
    linear: {
        switchNum: "Number of Switches",
        nodesPerSwitch: "Nodes per Switch",
        defaults : {
            ip: "localhost",
            port: "default",
            switchType: "OVSSwitch",
            mac: true,
            nodesPerSwitch: 5,
            switchNum: 4,
        }
    }
}

class CreateNetwork extends Component {

    state = {
        formElems:{
            ip: {
                value: ""
            },

            port: {
                value: ""
            },

            topoType: {
                value: "linear"
            },

            switchType: {
                value: "OVSSwitch"
            },

            nodesPerSwitch: {
                value: ""
            },

            switchNum: {
                value: ""
            },

            mac: {
                value: true
            }

        },

        isLoading: false,

    }

    setDefaultInputsValues = (event) => {
        event.preventDefault();
        const topoType = this.state.formElems.topoType.value;
        this.setState(
            produce(draft => {
                draft.formElems.ip.value = formInputNames[topoType].defaults.ip;
                draft.formElems.port.value = formInputNames[topoType].defaults.port;

                draft.formElems.switchType.value = formInputNames[topoType].defaults.switchType;
                draft.formElems.mac.value = formInputNames[topoType].defaults.mac;

                draft.formElems.switchNum.value = formInputNames[topoType].defaults.switchNum;
                draft.formElems.nodesPerSwitch.value = formInputNames[topoType].defaults.nodesPerSwitch;
            })
        );
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

        networkApi.createNetwork(formData)
            .then(data => {
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
                                    <Input required type="text" id="ip" value={this.state.formElems.ip.value} onChange={ (e) => this.inputChangedHandler(e, "ip") }/>
                                </FormGroup>
                            </Col>

                            <Col sm={2}> </Col>

                            <Col sm={5}>
                                <FormGroup>
                                    <Label for="port"  className="font-weight-bold small float-left">Port Number</Label>
                                    <Input required type="text" id="port" value={this.state.formElems.port.value} onChange={ (e) => this.inputChangedHandler(e, "port")}/>
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
                                    <Label for="nodesPerSwitch"  className="font-weight-bold small float-left">{formInputNames[this.state.formElems.topoType.value].nodesPerSwitch}</Label>
                                    <Input required type="number" id="nodesPerSwitch"  value={this.state.formElems.nodesPerSwitch.value} onChange={ (e) => this.inputChangedHandler(e, "nodesPerSwitch") }/>
                                </FormGroup>
                            </Col>
                        
                            <Col sm={2}> </Col>

                            <Col sm={5}>
                                <FormGroup>
                                    <Label for="switchNum"  className="font-weight-bold small float-left">{formInputNames[this.state.formElems.topoType.value].switchNum}</Label>
                                    <Input  required type="number" id="switchNum" value={this.state.formElems.switchNum.value} onChange={ (e) => this.inputChangedHandler(e, "switchNum") }/>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form>
                            <Col sm={12}>
                                <FormGroup check inline>
                                    <Label check className="font-weight-bold small">
                                        <Input type="checkbox" checked={this.state.formElems.mac.value} onChange={ (e) => this.inputChangedHandler(e, "mac") } /> Automatically set mac addresses
                                    </Label>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form className="pt-4 border-top mt-3">

                            { this.state.isLoading ?  
                                <Col sm={12} style={{ width: '2rem', height: '2rem' }} className="d-flex justify-content-end">
                                    <Spinner color="primary" />  
                                    <span className="font-italic text-muted mt-1 ml-2"> Creating Network ...</span>
                                </Col>
                                :
                                <Col sm={12} className="d-flex justify-content-end">
                                    <Button size="sm" color="secondary" className="font-weight-bold mr-4" onClick={this.setDefaultInputsValues}>
                                        Default Values
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