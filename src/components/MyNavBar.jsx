import {
  Container,
  Dropdown,
  Nav,
  Navbar
} from "react-bootstrap";
import { NavLink, useLocation } from "react-router";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../redux/actions";

function MyNavBar() {
  const location = useLocation();
  const dispatch = useDispatch();
  console.log(location);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);

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
        {isLoggedIn &&
        <Dropdown align="end" className="flex-shrink-0 order-lg-last ms-auto ms-lg-0 me-2 me-lg-0">
          <Dropdown.Toggle
            as="a"
            href="#"
            className="d-block link-body-emphasis text-decoration-none d-flex align-items-center"
            id="dropdown-user"
          >
            {user?.avatarURL ? (
              <img
                src={user.avatarURL}
                alt="user avatar"
                width="32"
                height="32"
                className="rounded-circle"
              />
            ) : (
              <i className="bi bi-person-circle fs-4"></i>
            )}
          </Dropdown.Toggle>

          <Dropdown.Menu className="text-small shadow">
            <Dropdown.Item href="/profile">Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => dispatch(logoutAction())}>Sign out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
}

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
