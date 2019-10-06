import React, { Component } from 'react';
import './App.css';
import { Container } from 'reactstrap';
import CreateNetwork from './containers/CreateNetwork/createNetwork';
import DeleteNetwork from './containers/DeleteNetwork/deleteNetwork';
import ApplicationMenu from './containers/ApplicationMenu/applicationMenu';
import OverviewApp from './containers/OverviewApp/overviewApp';
import FlowsApp from './containers/FlowsApp/flowsApp';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import NetNavbar from './components/NetNavbar/netNavbar';
import { networkApi } from './services/networkApi';
import produce from 'immer';

class App extends Component {

    state = {
        networkCreated: localStorage.getItem('networkCreated') ? localStorage.getItem('networkCreated') === "true" : false,
        networkType: null
    }

    componentDidMount() {
        this.checkNetworkStatus();
    }

    // componentDidUpdate() {
    //      this.checkNetworkStatus();
    // }

    setNetworkType = (netType) => {
        this.setState(
            produce(draft => {
                draft.networkType = netType;
            })
        );
    }

    checkNetworkStatus = () => {
        networkApi.networkExists()
        .then(data => {
            if (data)
            {
                const createdValue = data.status === "up";
                localStorage.setItem('networkCreated', createdValue)
                this.setState(
                    produce(draft => {
                        draft.networkCreated = createdValue;
                    })
                );
            }
        });
    }

    networkStateHandler = () => {
		this.setState(
			produce(draft => {
				draft.networkCreated = !draft.networkCreated;
			})
		);
    }

    withoutNetRoutes = () => {
        return(
			<Switch>
				<Route 
					path={["/create_network"]} 
					exact
                    render={() => ( <CreateNetwork 
                                        networkStateHandler={this.networkStateHandler}
                                        setNetworkType={this.setNetworkType}
                                    /> )}
				/>


				<Route
					path={ ["/delete_network"] }
					exact
                    render={() => ( <DeleteNetwork 
                                        networkStateHandler={this.networkStateHandler}
                                        setNetworkType={this.setNetworkType}
                                    /> )}
                />

				<Redirect to="/create_network" />
			</Switch>
		);
    }


    withNetRoutes = () => {
		return(
			<Switch>

				<Route
					path={ ["/"] }
					exact
					render={() => ( <ApplicationMenu networkType={this.state.networkType}/> )}
				/>

                <Route
					path={ ["/overview"] }
					exact
					render={() => ( <OverviewApp />)}
				/>

                <Route
					path={ ["/flows"] }
					exact
					render={() => ( <FlowsApp />)}
				/>


				<Route
					path={ ["/delete_network"] }
					exact
					render={() => ( <DeleteNetwork networkStateHandler={this.networkStateHandler}/> )}
                />

				<Redirect to="/" />
			</Switch>
		);
	}


    render() {

        // console.log(this.state);

        return (
            <div className="App">
                <div className="AppContents">
                    <NetNavbar networkCreated={this.state.networkCreated} />
                    <Container fluid className="content h-100">

                        {this.state.networkCreated ? 
                            this.withNetRoutes()
                            : 
                            this.withoutNetRoutes()
                        }

                    </Container>
            
                </div>
                {/* <Footer/> */}
            </div>
        );
    }


}

export default withRouter(App);
