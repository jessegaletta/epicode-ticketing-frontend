import { BASE_URL } from "../config/env";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useSearchParams, useNavigate, Link } from "react-router";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Missing token. The reset link is invalid.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // same regex used in UserDetail to keep password rules consistent across the app
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters and include uppercase, lowercase letters and numbers.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || "Password successfully reset!");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        const errData = await response.json();
        setError(errData.message || "An error occurred during password reset.");
      }
    } catch (err) {
      setError("Server connection error.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Container className="d-flex align-items-center justify-content-center flex-grow-1 py-5">
        <Alert variant="danger">Missing token. Cannot reset password.</Alert>
      </Container>
    );
  }

  return (
    <Container className="d-flex align-items-center justify-content-center flex-grow-1 py-5">
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6} xl={5}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4 p-md-5">
              <h2 className="text-center mb-4 fw-bold">Set New Password</h2>
              
              {message && <Alert variant="success">{message}<br/>You will be redirected to login in a few seconds...</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              {!message && (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
                      title="Must contain at least 8 characters, including uppercase, lowercase letters and numbers"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formConfirmPassword">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 mb-3" 
                    disabled={loading || !password || !confirmPassword}
                  >
                    {loading ? "Saving..." : "Save New Password"}
                  </Button>
                </Form>
              )}
              
              <div className="text-center mt-3">
                <Link to="/login" className="text-decoration-none">Back to Login</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
