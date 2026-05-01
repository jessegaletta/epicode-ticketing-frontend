import Alert from "react-bootstrap/Alert";

const Error = function ({ message }) {
  return (
    <div>
      <Alert variant="danger">{message.toString()}</Alert>
    </div>
  );
};

export default Error;
