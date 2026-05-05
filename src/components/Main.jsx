import { Button, Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Error from "./Error";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router";
// import { useDispatch } from "react-redux";

const Main = function () {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <Container className="flex-grow-1 py-4">
      <div className="position-relative">
        <h1 className="text-center my-5">Epicode Ticketing</h1>
      </div>
      <Row className="g-3">
        {loading && <Loading />}
        {error && <Error message={error} />}
      </Row>
    </Container>
  );
};

export default Main;
