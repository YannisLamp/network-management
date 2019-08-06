import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import produce from 'immer';
import { Container, Row, Col, Spinner } from 'reactstrap';
import { networkApi } from '../../services/networkApi';

class DeleteNetwork extends Component {

    state = {
        isLoading: true,

    }

    render () {
        return (
            <>
            { this.state.isLoading ? 
                <Row className="d-flex justify-content-center align-items-center h-100">
                    <Col sm="12" style={{ width: '50rem', height: '50rem' }} >
                        <Spinner color="primary" />
                    </Col>
                </Row>
                : null
            }
            </>
        );
    }

    componentDidMount() {
        this.props.networkStateHandler();

        // api call to backend to actually delete network
        networkApi.deleteNetwork()
            .then(data => {
                //alert(data.msg);
                // this.setState(
                //     produce(draft => {
                //         draft.isLoading = !draft.isLoading;
                //     })
                // );
                //this.props.networkStateHandler();
                // Redirect to main page
                this.props.history.replace('/');
            });
    }
}

export default withRouter(DeleteNetwork);