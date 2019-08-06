import React from 'react';
import { NavLink as RouterNavLink }  from 'react-router-dom';
import { NavItem, Button } from 'reactstrap';

const navigationItem = ( props ) => (
    <NavItem className="d-flex align-content-center p-1 ">
        <RouterNavLink
            style={{textDecoration: "none"}}
            className="container fluid align-self-center p-0" 
            exact
            to={props.link}
        >
            <Button id={props.customid} className="font-weight-bold" color={props.isActive ? "dark":"light"} size="sm" block>
                {props.children}
            </Button>
        </RouterNavLink>
    </NavItem>
);

export default navigationItem;