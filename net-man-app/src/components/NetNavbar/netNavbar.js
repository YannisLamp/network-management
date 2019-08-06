import React from 'react';
import { Navbar, NavItem, NavbarBrand } from 'reactstrap';
import { Button } from 'reactstrap'

import { NavLink } from 'react-router-dom'

// Component styles

export default function NetNavbar(props) {

    return (
        <Navbar color="dark" dark>
            <NavbarBrand href="/">NetMan</NavbarBrand>  

              <NavItem>
                <NavLink to="/">Delete Network</NavLink>
              </NavItem>
        </Navbar>
    );
}

