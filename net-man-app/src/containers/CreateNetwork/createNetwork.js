
import React, { Component } from 'react';
import { Container, Button, Row, Col, Form, FormGroup, Input, Label } from 'reactstrap';
import produce from 'immer';
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


        }

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
        let formData = {};
     
        for ( let key in this.state.formElems ) 
        {
            formData[key] = this.state.formElems[key].value;
        }

        console.log("---Form Data---");
        console.log(formData);    
        console.log("---------------");

        networkApi.createNetwork(...formData)
        .then(data => {
            alert(data.msg)
        });

        // axios.post(
        //     "http://localhost:8765/app/api/users",
        //     qs.stringify(formData),
        //     {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         params: {
        //             autologin: "true"
        //             // signup: "yes"
        //         }
        //     }
        // )
        // .then((result) => {
        //     // alert("Form Submitted");
        //     console.log(result);
           
        //     if (!result.data.success)
        //     {
        //         console.log("signup NOT successful");
        //         if (result.data.message === "Sign up error: email is already taken")
        //         {
        //             this.setFormField(FormObj, "email", "Το συγκεκριμένο email χρησιμοποιείται ήδη από άλλον λογαριασμό", 'is-invalid', null);
        //         }
        //         else if (result.data.message === "Sign up error: mismatching password")
        //         {
        //             this.setFormField(FormObj, "password1", "Οι κωδικοί δεν ταιριάζουν", "is-invalid", null);
        //         }
        //     }
        //     else
        //     {
        //         console.log("signup Successful");
        //         this.props.logIn(result.data.data);
        //         this.props.history.goBack();
        //     }
        // })
        // .catch((err) => {
        //     console.log(err);
        // })

    }

    render() {
        return (
                <Row>
                <Col sm={3}></Col>
                <Col sm={6}>
                    <Form onSubmit={this.submitHandler}>
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
                            <Col sm={12} className="justify-content-start">
                                <FormGroup check inline>
                                    <Label check>
                                        <Input type="checkbox" checked={this.state.formElems.mac.value} onChange={ (e) => this.inputChangedHandler(e, "mac") } /> automatically set mac addresses
                                    </Label>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form>

                            <Button>Submit</Button>

                        </Row>

                    </Form>
                </Col>

            </Row>

        );
    }

}



export default CreateNetwork;