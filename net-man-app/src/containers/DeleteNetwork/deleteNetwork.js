import { Component } from 'react';
import { withRouter } from 'react-router-dom'
import produce from 'immer';
import { networkApi } from '../../services/networkApi';

class DeleteNetwork extends Component {

    state = {
        isLoading: true,

    }

    render () {
        return 'Deleting shit'
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