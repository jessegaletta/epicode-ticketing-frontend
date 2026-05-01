import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { NavLink, useLocation } from "react-router";
import logo from "../assets/logo.png";

function MyNavBar() {
  const location = useLocation();
  console.log(location);

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">
          <img
            src={logo}
            alt="Logo"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Epicode Ticketing
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="flex-grow-1">
          <Nav fill variant="pills" className="w-100 ms-lg-3">
            <NavLink className="nav-link" to="/a">
              a
            </NavLink>
            <NavLink className="nav-link" to="/b">
              b
            </NavLink>
            <NavLink className="nav-link" to="/c">
              c
            </NavLink>
            <NavLink className="nav-link" to="/d">
              d
            </NavLink>
            <NavLink className="nav-link" to="/e">
              e
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavBar;
