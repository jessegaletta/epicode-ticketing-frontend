import { Container, Form, Button, FloatingLabel, Row, Col, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { registerAction, CLEAR_AUTH_MESSAGES } from "../redux/actions";
import Loading from "./Loading";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

const Register = () => {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });
  const [modalShow, setModalShow] = useState(false);
  const [localError, setLocalError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: reduxError, successMessage } = useSelector(state => state.auth);

  useEffect(() => {
    if (successMessage === "Registration successful! Redirecting to login...") {
      const timer = setTimeout(() => navigate("/login"), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  useEffect(() => {
    return () => {
      dispatch({ type: CLEAR_AUTH_MESSAGES });
    };
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Validation
    if (formValues.password !== formValues.confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    if (!formValues.acceptedTerms) {
      setLocalError("You must accept the Privacy Policy to register.");
      return;
    }

    dispatch(registerAction({
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
    }));
  };

  return (
    <Container className="m-auto" style={{ maxWidth: "500px" }}>
      <Row>
        <Form onSubmit={handleSubmit}>
          <h1 className="h3 mb-4 fw-normal text-center">Create an Account</h1>

          {(localError || reduxError) && <Alert variant="danger">{localError || reduxError}</Alert>}
          {successMessage && (
            <Alert variant="success">
              {successMessage}
            </Alert>
          )}

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridFirstName">
              <FloatingLabel label="First Name">
                <Form.Control
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                  minLength={2}
                  maxLength={30}
                  required
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridLastName">
              <FloatingLabel label="Last Name">
                <Form.Control
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formValues.lastName}
                  onChange={handleInputChange}
                  minLength={2}
                  maxLength={30}
                  required
                />
              </FloatingLabel>
            </Form.Group>
          </Row>

          <FloatingLabel
            controlId="floatingInput"
            label="Email address"
            className="mb-3"
          >
            <Form.Control
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formValues.email}
              onChange={handleInputChange}
              required
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingPassword"
            label="Password"
            className="mb-3"
          >
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={formValues.password}
              onChange={handleInputChange}
              pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
              title="Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number."
              required
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingConfirmPassword"
            label="Confirm Password"
            className="mb-3"
          >
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formValues.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </FloatingLabel>

          <Form.Group className="mb-4" controlId="formBasicCheckbox">
            <Form.Check type="checkbox">
              <Form.Check.Input 
                type="checkbox" 
                name="acceptedTerms"
                checked={formValues.acceptedTerms}
                onChange={handleInputChange}
                required
              />
              <Form.Check.Label>
                I have read and accept the{" "}
                <a 
                  href="#privacy-policy" 
                  onClick={(e) => {
                    e.preventDefault();
                    setModalShow(true);
                  }}
                  className="text-primary text-decoration-none"
                >
                  Privacy Policy
                </a>
              </Form.Check.Label>
            </Form.Check>
          </Form.Group>

          <Button
            variant="primary"
            className="w-100"
            type="submit"
            disabled={loading || !!successMessage}
          >
            {loading ? <Loading /> : "Sign Up"}
          </Button>
          
          <div className="text-center mt-3">
             <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="text-decoration-none">
                Already have an account? Sign In
             </a>
          </div>
        </Form>
      </Row>

      <PrivacyPolicyModal show={modalShow} onHide={() => setModalShow(false)} />
    </Container>
  );
};

export default Register;
