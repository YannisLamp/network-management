import React from 'react';
import { Navbar, Nav} from 'reactstrap';
import { NavLink as RouterNavLink }  from 'react-router-dom';
import NavigationItem from './NavigationItem/navigationItem';

import styles from './netNavbar.module.css';
    
const netNavbar = (props) =>  {

    return (
        <Navbar color="dark" dark className="fixed-top" >
            <RouterNavLink to="/" exact className={styles.Title + " font-weight-bold"}>
                NetMan  
            </RouterNavLink>  

            {   props.networkCreated ?
                <Nav className="ml-auto" navbar>
                    <NavigationItem link="/delete_network"> Delete Network </NavigationItem>								
                </Nav>
                : null
            }
        </Navbar>
    );
}

export default netNavbar;

