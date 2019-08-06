import { Component } from 'react';
import { networkApi } from '../../services/networkApi';

class DeleteNetwork extends Component {

    render () {
        return (null);
    }

    componentDidMount() {
        this.props.networkStateHandler();

        // api call to backend to actually delete network
        // networkApi.deleteNetwork()
        // .then(data => {
        //     alert(data.msg);
        //     this.props.networkStateHandler();
        // });
    }

}

export default DeleteNetwork;