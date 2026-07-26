import { useState } from 'react';
import { Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart,
  faSuitcaseRolling,
  faTasks,
} from '@fortawesome/free-solid-svg-icons';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../assets/images/logo.png';
import { UserDropdown } from './UserDropdown';

export function AppNavbar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar
      bg="white"
      expand="md"
      expanded={expanded}
      onToggle={setExpanded}
      className="border-bottom"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)}>
          <img src={logo} alt="JustList" style={{ width: '60%', maxWidth: 180 }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-md-center gap-md-2">
            <Nav.Link as={Link} to="/todo" onClick={() => setExpanded(false)}>
              <FontAwesomeIcon icon={faTasks} /> To-Do Tasks
            </Nav.Link>
            <Nav.Link as={Link} to="/travel" onClick={() => setExpanded(false)}>
              <FontAwesomeIcon icon={faSuitcaseRolling} /> Travel-Mate
            </Nav.Link>
            <Nav.Link as={Link} to="/shopping" onClick={() => setExpanded(false)}>
              <FontAwesomeIcon icon={faShoppingCart} /> Shopping List
            </Nav.Link>
            <div className="ms-md-4 me-md-3 my-2 my-md-0">
              <UserDropdown />
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
