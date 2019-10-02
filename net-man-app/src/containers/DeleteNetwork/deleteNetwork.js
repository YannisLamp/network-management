import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Spinner } from 'reactstrap';
import { networkApi } from '../../services/networkApi';

class DeleteNetwork extends Component {

    state = {
        isLoading: true
    }

    render () {
        return (
            <>
            { this.state.isLoading ? 
                <div className="d-flex d-flex-row align-items-center justify-content-center h-100">
                    <div className="d-flex-column justify-content-center mt-5">
                        <div className="">
                            <Spinner style={{ width: '10rem', height: '10rem' }} color="primary" />
                        </div>
                        <div className="font-italic text-muted mt-3 justify-content-center">
                            <div>
                                Deleting Network ...
                            </div>
                        </div>
                    </div>
                </div>
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
                // Redirect to main page
                this.props.history.replace('/');
            });
    }
}

export default withRouter(DeleteNetwork);