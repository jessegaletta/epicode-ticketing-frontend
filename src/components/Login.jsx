import { Container, Form, Button, FloatingLabel, Row, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { loginAction } from "../redux/actions";
import Loading from "./Loading";

const Login = () => {
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    // If user is logged in, redirect to home page
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAction(formValues));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <Container className="m-auto" style={{ maxWidth: "400px" }}>
      <Row>
        <Form onSubmit={handleSubmit}>
          <h1 className="h3 mb-3 fw-normal text-center">Please sign in</h1>

          {error && <Alert variant="danger">{error}</Alert>}

          <FloatingLabel
            controlId="floatingInput"
            label="Email address"
            className="mb-3"
          >
            <Form.Control 
              type="email" 
              name="email"
              placeholder="sXXXXXXXX@epicode.edu.mt" 
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
              required
            />
          </FloatingLabel>

          <Button variant="primary" className="w-100" type="submit" disabled={loading}>
            {loading ? (
              <Loading />
            ) : (
              "Sign in"
            )}
          </Button>

          <div className="text-center mt-3">
             <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }} className="text-decoration-none">
                Don't have an account? Sign Up
             </a>
          </div>
        </Form>
      </Row>
    </Container>
  );
};

export default Login;
