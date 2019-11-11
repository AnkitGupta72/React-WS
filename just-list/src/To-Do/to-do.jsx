import React from 'react';

import { Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import "./todo.css"


export default class Todo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            tasks: {},
            modal: false,
            newTaskText: ""
        }
        this.getTasks = this.getTasks.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    // tried but was not working
    // static getDerivedStateFromProps(props,state){
    //     return {user: props.user}
    // }

    refresh(user) {
        console.log("Refreshed." + JSON.stringify(user));
        this.setState({
            user: user
        })
        this.getTasks()
    }

    getTasks = () => {
        axios.get(`http://localhost:8080/tasks`)
            .then(res => {
                let tasks = res.data;
                this.setState({
                    tasks: tasks
                })
            })
    }

    addTaskToServer = () => {
        let myTasks = this.state.tasks;
        myTasks[this.state.user.id]["active"].push(this.state.newTaskText);
        this.setState({
            tasks: myTasks
        })
        axios.post(`http://localhost:8080/tasks`, { tasks : myTasks })
            .then(res => {
                console.log("From server :" + res.data);
        })
    }

    markCompleted(index) {
        console.log(index)
    }

    listTheTasks = () => {
        let myTasks;
        if (!this.state.tasks || !this.state.tasks[this.state.user.id]) {
            console.log("tasks not found");
        }
        else {
            myTasks = this.state.tasks[this.state.user.id]
            console.log(myTasks)
        }
        return (
            <div className="row container">
                <div className="col" style={{ marginLeft: "10rem" }}>
                    <div className="row">
                        <h1 style={{ fontFamily: "monospace" }}>Active Tasks</h1>
                        <Button color="secondary" className="addButton" onClick={this.myModalToggle}><FontAwesomeIcon icon="plus" /></Button>
                    </div>
                    <ul>    
                        {myTasks && myTasks["active"] && myTasks["active"].map((e, index) => {
                            return (
                                <li key={"active_" + index}>{e}{'  '}
                                {/* <FontAwesomeIcon icon="check" /> */}
                                {/* <button onClick={this.markCompleted}> <FontAwesomeIcon icon="check" /> </button> */}
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="col">
                    <h1 style={{ fontFamily: "monospace" }}>Completed Tasks</h1>
                    <ul>
                        {myTasks && myTasks["completed"] && myTasks["completed"].map((e, index) => {
                            return (
                                <li key={"completed_" + index}>{e}</li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }

    myModalToggle = () => {this.setState({modal:!this.state.modal})};

    addTask = () => {
        console.log("Tasks to add : "+ this.state.newTaskText);
        this.addTaskToServer();
        this.myModalToggle();
    }

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    createModal = () => {
        return (<div>
            <Modal isOpen={this.state.modal} toggle={this.myModalToggle}>
                <ModalHeader toggle={this.myModalToggle}>Add Task</ModalHeader>
                <ModalBody>
                    <input type="text" name="newTaskText" placeholder="What should I remember." style={{width:'100%'}} onChange={this.handleChange} value={this.state.newTaskText}/>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.addTask}>Add Task</Button>{' '}
                    <Button color="secondary" onClick={this.myModalToggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>)
    }

    render() {
        return (
            <div>
                {this.listTheTasks()}
                {this.createModal()}
            </div>
        )
    }
}