import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import UserCard from "./User/user-card";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare, faCoffee,faPlus } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fab,faCheckSquare, faCoffee, faPlus)

let user = { id: 1, name: "Ankit" }
ReactDOM.render((<div><UserCard userDetails={user} /></div>), document.getElementById('root'));
