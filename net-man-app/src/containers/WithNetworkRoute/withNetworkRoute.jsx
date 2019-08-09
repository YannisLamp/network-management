import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const WithNetworkRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
            console.log('networkCreated==');
            console.log(props.networkCreated);
            return (
            props.networkCreated
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/create_network' }} />)
            }} />
)



routes = (networkCreated) => {
    return (
        <Switch>
            <WithNetworkRoute networkCreated={networkCreated}
                path={ ["/"] }
                exact
                render={() => ( <ApplicationMenu />)}
            />

            <WithNetworkRoute networkCreated={networkCreated}
                path={ ["/topology"] }
                exact
                render={() => ( <TopologyApp />)}
            />

            <WithNetworkRoute networkCreated={networkCreated}
                path={ ["/delete_network"] }
                exact
                render={() => ( <DeleteNetwork networkStateHandler={this.networkStateHandler}/> )}
            />

            <Route 
                path={["/create_network"]} 
                exact
                render={() => ( <CreateNetwork networkStateHandler={this.networkStateHandler}/> )}
            />


            <Route
                path={ ["/delete_network"] }
                exact
                render={() => ( <DeleteNetwork networkStateHandler={this.networkStateHandler}/> )}
            />

    </Switch>
    );
}