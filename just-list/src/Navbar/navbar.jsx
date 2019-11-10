import React, { useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';

import UserDrop from "../User/user-dropdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const MyNavbar = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);
    let users = [{ id: 1, name: "Ankit" }, { id: 2, name: "Ana" }]

    return (
        <div>
            <Navbar color="white" light expand="md">
                <NavbarBrand href="/"><img style={{ width: '60%' }} src={require('../assets/images/logo.png')} alt="JustList" /></NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <NavItem >
                            <NavLink href="/"> <FontAwesomeIcon icon="tasks" /> To-Do Tasks</NavLink>
                        </NavItem>
                        <NavItem >
                            <NavLink href="/"> <FontAwesomeIcon icon="suitcase-rolling" /> Travel-Mate</NavLink>
                        </NavItem>
                        <NavItem>
                        <NavLink href="/"> <FontAwesomeIcon icon="shopping-cart" /> Shopping List</NavLink>
                        </NavItem>
                        <NavItem style={{ 'marginRight': '3rem', 'marginLeft': '3rem' }}>
                         <UserDrop userDetails={users} />
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}

export default MyNavbar;