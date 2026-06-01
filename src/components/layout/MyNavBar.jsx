import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router";
import logo from "../../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../../redux/actions";
import { useState } from "react";
import PrivacyPolicyModal from "../common/PrivacyPolicyModal";

function MyNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState(false);

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
        {isLoggedIn ? (
          <Dropdown
            align="end"
            className="flex-shrink-0 order-lg-last ms-auto ms-lg-0 me-2 me-lg-0"
          >
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
              <Dropdown.Item onClick={() => navigate("/users/me")}>
                Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setModalShow(true)}>
                Privacy Policy
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => dispatch(logoutAction(navigate))}>
                Sign out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <NavLink
            to="/login"
            className="flex-shrink-0 order-lg-last ms-auto ms-lg-0 me-2 me-lg-0 link-body-emphasis text-decoration-none d-flex align-items-center"
          >
            <i className="bi bi-person-circle fs-4"></i>
          </NavLink>
        )}

        <PrivacyPolicyModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="flex-grow-1">
          <Nav fill variant="pills" className="w-100 mx-lg-4">
            <NavLink className="nav-link" to="/tickets">
              Tickets
            </NavLink>
            {isLoggedIn && (user?.role === "FACULTY" || user?.role === "ADMIN") ? (
              <>
                <NavLink className="nav-link" to="/bachelors">
                  Bachelors
                </NavLink>
                <NavLink className="nav-link" to="/courses">
                  Courses
                </NavLink>
              </>
            ) : (
              <>
                <div className="nav-link d-none d-lg-block invisible">Bachelors</div>
                <div className="nav-link d-none d-lg-block invisible">Courses</div>
              </>
            )}
            {isLoggedIn && user?.role === "ADMIN" ? (
              <NavLink className="nav-link" to="/users">
                Users
              </NavLink>
            ) : (
              <div className="nav-link d-none d-lg-block invisible">Users</div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavBar;
