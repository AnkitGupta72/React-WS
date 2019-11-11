import React from 'react';

import { Card, CardBody } from 'reactstrap';

import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



export default class Todo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            tasks: {}
        }
        this.getTasks = this.getTasks.bind(this);
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

    refresh(user){
        console.log("Refreshed." + JSON.stringify(user));
        this.setState({
            user:user
        })
        this.getTasks()
    }  

    getTasks = () =>{
        axios.get(`http://localhost:8080/tasks`)
          .then( res => {
               let tasks = res.data;
               this.setState({
                   tasks: tasks
               })
        })
    }

    listTheTasks = () =>{
        let myTasks;
        if(!this.state.tasks || !this.state.tasks[this.state.user.id] ){
            console.log("tasks not found");
        }
        else{
            myTasks = this.state.tasks[this.state.user.id]
            console.log(myTasks)
        }
        return (
        <div className="row container">
            <div className="col">
                <h1>Active Tasks</h1>
                <ul>
                {myTasks && myTasks["active"] && myTasks["active"].map((e,index) => {
                        return (
                            <li key={"active_"+index}>{e}</li>
                        )
                    })}
                </ul>
            </div>
            <div className="col">
                <h1>Completed Tasks</h1>
                <ul>
                {myTasks && myTasks["completed"] && myTasks["completed"].map((e,index) => {
                        return (
                            <li key={"completed_"+index}>{e}</li>
                        )
                })}
                </ul>
            </div>
            
        </div>
        )
    }

    render() {
        return (
            <div>
                {this.listTheTasks()}
            </div>
        )
    }
}