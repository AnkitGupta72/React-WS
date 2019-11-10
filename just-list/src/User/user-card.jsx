import React from 'react';
import {Card,CardTitle} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default class UserCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = { user: this.props.userDetails };
    }

    render() {
        let userDetails = this.props.userDetails;
        return (
            <div>
                    <Card body>
                        <div className="row">
                            <div className="col-xs-12 col-md-8 ">
                                <CardTitle>{userDetails.name}</CardTitle>
                                {/* <CardText>{userDetails.id} <FontAwesomeIcon icon="user" /></CardText> */}
                            </div>
                            <div className="col-xs-12 col-md-4 ">
                                <FontAwesomeIcon icon="user" size="lg"/>
                            </div>
                        </div>
                    </Card>
            </div>
        )
    }



}