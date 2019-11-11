import React from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { Card, CardBody } from 'reactstrap';

import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import UserCard from "./user-card"

export default class UserDrop extends React.Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.createAnotherUser = this.createAnotherUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getUsers = this.getUsers.bind(this)
        this.addUser = this.addUser.bind(this);
        this.state = {
            users: this.props.userDetails,
            dropdownOpen: false,
            dropDownValue: {name:"No User"},
            addUserForm: false,
            userName: ""
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
        console.log("Selected User " + id);
        for (let i in this.state.users) {
            let item = this.state.users[i];
            if (item.id == id) {
                this.setState({ dropDownValue: item });
                this.props.dropdownChange(item);
                break;
            }
        }
    }

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    createAnotherUser = () => { //Opens the form for creating a new user
        if (!this.state.addUserForm) {
            this.setState({ addUserForm: true });
            return;
        }
    }

    getId = () => {
        let hid = 0;
        let userslist = this.state.users;
        for (let i in userslist) {
            let e = userslist[i];
            if (hid < e.id){
                hid = e.id
            } 
        }
        return hid + 1;
    }

    tellServer = (user) =>{
        axios.post(`http://localhost:8080/users`, { user })
            .then(res => {
                console.log("From server :" + res.data);
        })
    }

    addUser = () => { // Adds a user in the array
        if (this.state.userName == "") {
            alert("Enter name of the user first.")
            return
        }
        let User = {};
        User.id = this.getId();
        User.name = this.state.userName;
        let Users = this.state.users;
        Users.push(User);
        this.setState({
            users: Users,
            addUserForm: false,
            userName: ""
        })
        this.tellServer(User)
    }

    getUsers = () => {
        axios.get(`http://localhost:8080/users`)
          .then( res => {
               let users = res.data.users;
               if(users.length == 0 )
                    return
               this.setState({
                   users: users,
                   dropDownValue: users[0]
               }) 
               this.props.dropdownChange(users[0]);
        })
    }

    // @DEV: Functions for editing deleting users : Pending
    // editUser = (e) =>{
    //     alert(JSON.stringify(e));
    //     console.log(JSON.stringify(e));
    // } 

    // deleteUser = (e) =>{
    //     alert(JSON.stringify(e));
    //     console.log(JSON.stringify(e));
    // } 

    createUserCardList() {
        let userDetails = this.state.users;
        let state = this.state;
        return (
            <UncontrolledDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                    {userDetails.length > 0 ?
                        (<span>{this.state.dropDownValue.name}</span>)
                        : (<span><FontAwesomeIcon icon="plus" />&nbsp;Add User</span>)}
                </DropdownToggle>
                <DropdownMenu right style={{ minWidth: "13rem", overflowY: "scroll", maxHeight: "20rem", right: "0px" }}>
                    {userDetails.map(e => {
                        return (
                            <DropdownItem id={e.id} key={e.id} onClick={this.changeValue} >
                                {/*@DEV: When edit and delete user is enabled : Pending*/}
                                {/* <div className="row">
                                    <div className="col-sm-10">
                                        <UserCard userDetails={e} id={e.id} key={e.id} onClick={this.changeValue} />
                                    </div>
                                    <div className="col-sm-2">
                                        <div className="row">
                                            <div className="col"  onClick={this.editUser(e)}>
                                               <FontAwesomeIcon icon="plus"/>
                                            </div>
                                            <div className="col"  onClick={this.editUser(e)}>
                                                <FontAwesomeIcon icon="plus"/>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                <UserCard userDetails={e} />
                            </DropdownItem>
                        )
                    })}
                    <DropdownItem id="plus-user" key="plus-user" toggle={false} onClick={this.createAnotherUser}>
                        {!state.addUserForm && (
                            <Card>
                                <CardBody className="text-center">
                                    <FontAwesomeIcon icon="plus" size="lg" />
                                </CardBody>
                            </Card>)}
                        {state.addUserForm && (
                            <div className="row text-center" style={{ display: "inline" }}>
                                <div style={{ display: "inline" }}>
                                    <input autoFocus type="text" name="userName" onChange={this.handleChange} vaaule={this.state.userName} />
                                </div>
                                <div style={{ display: "inline", 'paddingLeft': '2%' }}>
                                    <span onClick={this.addUser}><FontAwesomeIcon icon="plus" size="lg" /></span>
                                </div>
                            </div>
                        )}
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>)
    }

    componentDidMount() {
        this.getUsers();
    }

    render() {
        // let userDetails = this.props.userDetails;
        return (
            <div>
                {this.createUserCardList()}
            </div>
        )
    }
}