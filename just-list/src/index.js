import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare, faCoffee,faPlus,faUser,faShoppingCart, faSuitcaseRolling, faTasks,faCheck } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import App from "./App.jsx"

library.add(fab,faCheckSquare, faCoffee, faPlus, faUser, faShoppingCart, faSuitcaseRolling, faTasks,faCheck)



ReactDOM.render((<div><App /></div>), document.getElementById('root'));


