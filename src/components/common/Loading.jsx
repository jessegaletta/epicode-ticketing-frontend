import { Spinner } from "react-bootstrap";

const Loading = function () {
  return (
    <div className="text-center">
      <Spinner animation="border" variant="success" />
    </div>
  );
};

export default Loading;
