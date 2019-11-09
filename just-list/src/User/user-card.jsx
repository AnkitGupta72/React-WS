import React from 'react';
import {
    Card, CardImg, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle, Button
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = { user: this.props.userDetails };
    }

    render() {
        let userDetails = this.props.userDetails;
        return (
            <div>
                <h1></h1>
                <div class="col-lg-4">
                    <Card body>
                        <div class="row">
                            <div class="col-xs-12 col-md-8 justify-content-center">
                                <CardTitle>{userDetails.name}</CardTitle>
                                <CardText>{userDetails.id} <FontAwesomeIcon icon="spinner" /></CardText>
                            </div>
                            <div class="col-xs-12 col-md-4 ">
                                <FontAwesomeIcon icon="plus" size="lg"/>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }



}