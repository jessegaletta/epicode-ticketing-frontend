import { Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

const SessionExpired = function () {
  const navigate = useNavigate();
  const bringToLogin = function () {
    navigate("/login");
  };

  return (
    <div className="text-center flex-grow-1">
      <Alert variant="warning my-5">
        <p>Session Expired - Your session has expired, please log in again.</p>
        <p>
          <Button variant="primary" onClick={bringToLogin}>
            Go to Login
          </Button>
        </p>
      </Alert>
    </div>
  );
};

export default SessionExpired;
