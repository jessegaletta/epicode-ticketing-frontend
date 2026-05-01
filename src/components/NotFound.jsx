import { Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

const NotFound = function () {
  const navigate = useNavigate();
  const bringHome = function () {
    navigate("/");
  };
  return (
    <div className="text-center flex-grow-1">
      <Alert variant="info my-5">
        <p>404 - This page was not found</p>
        <p>
          <Button variant="success" onClick={bringHome}>
            Go Home
          </Button>
        </p>
      </Alert>
    </div>
  );
};

export default NotFound;
