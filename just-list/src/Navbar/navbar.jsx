import React from 'react';
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

export default class MyNavbar extends React.Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this)
        this.state={
            isOpen: false,
            users : []
        }
    }
    
    toggle = () => {this.setState({isOpen: !this.state.isOpen})};

    render(){
        return (
            <div>
                <Navbar color="white" light expand="md">
                    <NavbarBrand href="/"><img style={{ width: '60%' }} src={require('../assets/images/logo.png')} alt="JustList" /></NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem >
                                <NavLink href="/todo"> <FontAwesomeIcon icon="tasks" /> To-Do Tasks</NavLink>
                            </NavItem>
                            <NavItem >
                                <NavLink href="/"> <FontAwesomeIcon icon="suitcase-rolling" /> Travel-Mate</NavLink>
                            </NavItem>
                            <NavItem>
                            <NavLink href="/"> <FontAwesomeIcon icon="shopping-cart" /> Shopping List</NavLink>
                            </NavItem>
                            <NavItem style={{ 'marginRight': '3rem', 'marginLeft': '3rem' }}>
                             <UserDrop userDetails={this.state.users} dropdownChange={this.props.dropdownChange}/>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>);
    }
}

