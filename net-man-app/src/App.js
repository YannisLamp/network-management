import React, { Component } from 'react';
import './App.css';
import { Container, Row, Col } from 'reactstrap';
import CreateNetwork from './containers/CreateNetwork/createNetwork';
import ApplicationMenu from './containers/ApplicationMenu/applicationMenu';

import { Route, Redirect, Switch } from 'react-router-dom';

import Footer from './components/Footer/footer'
import NetNavbar from './components/NetNavbar/netNavbar';

import { networkApi } from './services/networkApi';

// import produce from 'immer';

class App extends Component {





    state = {
        networkCreated: true,
    }


    networkStateHandler = () => {
        this.setState( (prevState, props) => { return { networkCreated: !prevState.networkCreated }} );
    }


    

    withoutNetRoutes = () => {
        return(
			<Switch>
				<Route 
					path={["/create_network"]} 
					exact
					render={() => ( <CreateNetwork networkStateHandler={this.networkStateHandler}/> )}
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
					render={() => ( <ApplicationMenu />)}                        /> )}
				/>

				<Route
					path={ ["/delete_network"] }
					exact
					render={() => {
                        networkApi.deleteNetwork();
                        this.networkStateHandler() 
                        return null;
                    }}
				/>

				{/*<Route
					path={ ["/book"] }
					exact
					render={() => ( <Checkout/> )}
				/>

				<Route
					path={ ["/visitor", "/visitor/history", "/visitor/profile", "/visitor/changepass"] }
					exact
					render={() => ( <Visitor/> )}
				/>

				<Route
					path="/" 
					exact
					render={() => ( <IndexPage/> )}
                />*/}

				<Redirect to="/" />
			</Switch>
		);
	}


    render() {
          return (
            <div className="App">
                <div className="AppContents">
                    <NetNavbar/>
                    <Container fluid>

                        {this.state.networkCreated ? 
                            this.withNetRoutes()
                            : 
                            this.withoutNetRoutes()
                        }

                    </Container>
                    {/* <h2>Welcome to ssss</h2>
                    <p className="App-intro">
                        To get started, edit <code>src/App.js</code> and save to reload.
                    </p> */}
                </div>
                <Footer/>
            </div>
        );
    }


}

export default App;
