import { Container, Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const Main = function () {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <Container fluid className="d-flex flex-column justify-content-center align-items-center flex-grow-1 text-center" style={{ minHeight: "80vh" }}>
      <Row className="justify-content-center w-100">
        <Col xs={11} md={8} lg={6}>
          <h1 className="display-4 fw-bold mb-4">Epicode Ticketing</h1>
          <p className="lead mb-4 text-secondary">
            Welcome to the Epicode Ticketing System, a comprehensive platform developed to simplify the collection and management of user reports.
          </p>
          <p className="lead mb-5 text-secondary">
            We trust in your responsibility to use this tool with the utmost seriousness and in a correct manner.
          </p>
          
          <div className="d-flex justify-content-center gap-3 mb-4">
            <Button variant="primary" size="lg" onClick={() => navigate("/tickets")}>
              Go to Tickets
            </Button>
            {!isLoggedIn && (
              <Button variant="outline-secondary" size="lg" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
          </div>

        </Col>
      </Row>
    </Container>
  );
};

export default Main;
