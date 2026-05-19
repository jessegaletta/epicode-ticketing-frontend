import { Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

const AccessDenied = function () {
  const navigate = useNavigate();
  const bringHome = function () {
    navigate("/");
  };

  return (
    <div className="text-center flex-grow-1">
      <Alert variant="danger my-5">
        <p>Access Denied - You do not have permission to perform this action.</p>
        <p>
          <Button variant="primary" onClick={bringHome}>
            Go Home
          </Button>
        </p>
      </Alert>
    </div>
  );
};

export default AccessDenied;
