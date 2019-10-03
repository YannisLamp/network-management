import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import TopoInfoRow from '../../TopoInfoRow/topoInfoRow';

    
const linkInfo = (props) =>  {

    return (
        <Container className="customBorder1" fluid style={{backgroundColor: "white"}}>
            <Row className="border">
                <Col sm="12" className="font-weight-bold d-flex justify-content-center">
                    <div>
                        Selected Link Information
                    </div>
                </Col>
            </Row>

            <TopoInfoRow name="Type" value="bidirectional"/>

            <TopoInfoRow name="Source Node" value={props.linkInfo.sourceInfo.nodeId} 
                nodeClickedHandler={
                    () => { 
                        if (props.linkInfo.sourceInfo.nodeType === "switch") 
                        { 
                            return props.switchClickedHandler(props.linkInfo.sourceInfo.nodeId, props.linkInfo.sourceInfo.portId);
                        }
                        else // host
                        {
                            return props.nodeClickedHandler(props.linkInfo.sourceInfo.nodeId);
                        }
                    }
                }
                clickableValue
            />
            <TopoInfoRow name="Dest Node" value={props.linkInfo.destInfo.nodeId} 
                nodeClickedHandler={
                    () => { 
                        if (props.linkInfo.destInfo.nodeType === "switch") 
                        { 
                            return props.switchClickedHandler(props.linkInfo.destInfo.nodeId, props.linkInfo.destInfo.portId);
                        }
                        else // host
                        {
                            return props.nodeClickedHandler(props.linkInfo.destInfo.nodeId);
                        }
                    }
                }                
                clickableValue
            />

            { 
                props.linkInfo.sourceInfo.nodeType === "switch" ?
                    <TopoInfoRow 
                        name="Source Port #" 
                        value={props.nodesInfo[props.linkInfo.sourceInfo.nodeId].connectors[props.linkInfo.sourceInfo.portId]["flow-node-inventory:port-number"]}
                    />
                : null
            }


            {        
                props.linkInfo.destInfo.nodeType === "switch" ?
                    <TopoInfoRow 
                        name="Dest Port #" 
                        value={props.nodesInfo[props.linkInfo.destInfo.nodeId].connectors[props.linkInfo.destInfo.portId]["flow-node-inventory:port-number"]}
                    />
                : null
            }

        </Container>
    );

}


export default linkInfo;