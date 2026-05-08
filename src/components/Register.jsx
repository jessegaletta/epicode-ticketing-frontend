import { Container, Form, Button, FloatingLabel, Row, Col, Alert } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formValues.password !== formValues.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formValues.acceptedTerms) {
      setError("You must accept the Privacy Policy to register.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          password: formValues.password,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        let errorMsg = "Registration failed";
        try {
          const errorData = await response.json();
          // The backend returns ErrorsWithListDTO which has an errorsList array
          if (errorData.errorsList && errorData.errorsList.length > 0) {
             errorMsg = errorData.errorsList.join(", ");
          } else {
             errorMsg = errorData.message || errorMsg;
          }
        } catch (e) {
          // ignore
        }
        setError(errorMsg);
      }
    } catch (err) {
      setError("An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="m-auto" style={{ maxWidth: "500px" }}>
      <Row>
        <Form onSubmit={handleSubmit}>
          <h1 className="h3 mb-4 fw-normal text-center">Create an Account</h1>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">
              Registration successful! Redirecting to login...
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
            disabled={loading || success}
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
