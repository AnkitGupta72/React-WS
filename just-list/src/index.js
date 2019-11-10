import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import MyNavbar from "./Navbar/navbar"

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare, faCoffee,faPlus,faUser,faShoppingCart, faSuitcaseRolling, faTasks } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import HomePage from './HomePage/home-page';

library.add(fab,faCheckSquare, faCoffee, faPlus, faUser, faShoppingCart, faSuitcaseRolling, faTasks)
 
ReactDOM.render((<div><MyNavbar/><HomePage/></div>), document.getElementById('root'));


