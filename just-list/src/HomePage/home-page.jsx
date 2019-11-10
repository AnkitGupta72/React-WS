import React from 'react';
import "./home-page.css";

import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default class HomePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { showHead2: false, showCards: false };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ showHead2: true })
        }, 2000);
        setTimeout(() => {
            this.setState({ showCards: true })
        }, 3500);
    }

    createCards() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Card className="myCard">
                            <CardBody>
                                <CardTitle><FontAwesomeIcon icon="tasks" size="lg"/>&nbsp;To-do Tasks</CardTitle>
                                <CardSubtitle style={{'margin-top':"1rem"}}>Lists all your tasks and let us remember them for you</CardSubtitle>
                                <CardText style={{'margin-top':"1rem"}}>Add, Edit, Remove and Mark as Complete your tasks. Allow us to help you in making your life simpler.</CardText>
                            </CardBody>
                        </Card>
                    </div>
                    <div className="col">
                    <Card className="myCard">
                            <CardBody>
                                <CardTitle><FontAwesomeIcon icon="suitcase-rolling" size="lg"/>&nbsp;Travelling-Bagpack Lists</CardTitle>
                                <CardSubtitle style={{'margin-top':"1rem"}}>Love to travel, Get your packing done right. </CardSubtitle>
                                <CardText style={{'margin-top':"1rem"}}>Do yo love to travel but always forget to pack a thing or two. No worries we are here for you.</CardText>
                            </CardBody>
                        </Card>
                </div>
                    <div className="col">
                    <Card className="myCard">
                            <CardBody>
                                <CardTitle><FontAwesomeIcon icon="shopping-cart" size="lg"/>&nbsp;Shopping List</CardTitle>
                                <CardSubtitle style={{'margin-top':"1rem"}}>So many things to buy </CardSubtitle>
                                <CardText style={{'margin-top':"1rem"}}>Schade, I forgot to buy milk. Does something like this ever happened to you. If yeah, then we understand you pain. Make a list and never forget a hing when shopping</CardText>
                            </CardBody>
                        </Card>
                </div>
                </div>
            </div>)
    }

    render() {
        let userDetails = this.props.userDetails;

        return (
            <div>
                <div className="text-center pt-2">
                    <h1 className="myWriting">" Tired of Remembering so much Stuff to-do.</h1>
                    {this.state.showHead2 && (<h1 className="myWriting2"> Let us help you with that "</h1>)}
                </div>
                    {this.state.showCards &&(<div className="text-center pt-5 myCards">{this.createCards()}</div>)}
            </div>
        )
    }
}