import { Container, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import Loading from "../components/common/Loading";
import Error from "../components/common/Error";
import { useNavigate } from "react-router";

const Main = function () {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
            <Button variant="outline-secondary" size="lg" onClick={() => navigate("/login")}>
              Login
            </Button>
          </div>

          <Row className="g-3 mt-2 justify-content-center">
            {loading && <Loading />}
            {error && <Error message={error} />}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Main;
