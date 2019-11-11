import React from 'react';

import HomePage from './HomePage/home-page';
import Todo from "./To-Do/to-do";
import MyNavbar from "./Navbar/navbar"

import {
    BrowserRouter as Router,
    Route,
  } from "react-router-dom";


export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.dropdownChange = this.dropdownChange.bind(this);
        this.state = {
            user: {
                name: "Not yet assigned",
                id: "Dont know"
            }
        }
    }
    
    myToDo = () => {

        return (
          <Todo 
          user={this.state.user}
          onRef={ref => (this.Todo = ref)}  
          />
        );
      }

    router = (
        <div>
            <Router>
                <div>
                    <Route exact path="/" component={HomePage}/>
                    <Route path="/todo" render={this.myToDo}/>
                </div>
            </Router>
        </div>
    )
    
    dropdownChange(user) {
        // console.log(JSON.stringify(user));
        this.setState({
            user:user
        })
        //to-do refresh
        // console.log("Test" + this.state.user.name);
        if(this.Todo){
            this.Todo.refresh(user);
        }
    }
    
    render() {
        return (<div><MyNavbar dropdownChange={this.dropdownChange}/>{this.router}</div>)
    }
}