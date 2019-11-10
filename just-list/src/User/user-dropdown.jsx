import React from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle,UncontrolledDropdown } from "reactstrap";
import { Card, CardBody } from 'reactstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import UserCard from "./user-card"

export default class UserDrop extends React.Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.createAnotherUser = this.createAnotherUser.bind(this);
        this.state = {
            users: this.props.userDetails,
            dropdownOpen: false,
            dropDownValue: { name: "Ankit", id: 1 },
            addUserForm: false
        };
    }

    toggle(event) {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
            addUserForm: false
        });
    }

    changeValue(e) {
        let id = e.currentTarget.getAttribute("id");
        console.log(id);
        for (let i in this.props.userDetails) {
            let item = this.props.userDetails[i];
            if (item.id == id) {
                this.setState({ dropDownValue: item });
                break;
            }
        }
    }

    createAnotherUser = () => {
        console.log("Add Another User");
        // Open the add user form and return
        if (!this.state.addUserForm) {
            this.setState({ addUserForm: true });
            return;
        }
        // Add the user to the list

        // this.toggle();
    }

    createUserCardList() {
        let userDetails = this.props.userDetails;
        let state = this.state;
        return (
            <UncontrolledDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                    {userDetails.length > 0 ?
                        (<span>{this.state.dropDownValue.name}</span>)
                        : (<span><FontAwesomeIcon icon="plus" />&nbsp;Add User</span>)}
                </DropdownToggle>
                <DropdownMenu right>
                    {userDetails.map(e => {
                        return <DropdownItem id={e.id} key={e.id} onClick={this.changeValue}><UserCard userDetails={e} /></DropdownItem>
                    })}
                    <DropdownItem id="plus-user" key="plus-user" toggle={false} onClick={this.createAnotherUser}>
                        {!state.addUserForm && (
                            <Card>
                                <CardBody className="text-center">
                                    <FontAwesomeIcon icon="plus" size="lg" />
                                </CardBody>
                            </Card>)}
                        {state.addUserForm && (
                            <div className="row text-center"  style={{display:"inline"}}>
                                <div   style={{display:"inline"}}>
                                    <input autoFocus type="text" name="UserName" />
                                </div>
                                <div  style={{display:"inline",'padding-left':'2%'}}>
                                    <span onClick={this.createAnotherUser}><FontAwesomeIcon icon="plus" size="lg" /></span>
                                </div>
                            </div>
                        )}
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>)
    }

    render() {
        let userDetails = this.props.userDetails;
        return (
            <div>
                {this.createUserCardList()}
            </div>
        )
    }
}