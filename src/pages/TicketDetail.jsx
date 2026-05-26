import { Container, Form, Button, Alert, FloatingLabel } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTicketDetailAction,
  saveTicketAction,
  deleteTicketAction,
  clearTicketDetailAction,
} from "../redux/actions/tickets";
import Loading from "../components/common/Loading";
import { useNavigate, useParams, useLocation } from "react-router";
import ConfirmModal from "../components/common/ConfirmModal";

const TicketDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const isNew = id === "new" || location.pathname === "/tickets/new" || !id;
  const {
    data: ticket,
    loading,
    error,
  } = useSelector((state) => state.tickets?.detail || {});
  const { user: loggedInUser, isLoggedIn } = useSelector((state) => state.auth);

  // We can edit if it's new, or if the user has editMode from the table row click.
  const isReadOnly = !isNew && !location.state?.editMode;

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    status: "OPEN",
    isAnonymous: false,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (isNew) {
      setFormValues({
        title: "",
        description: "",
        status: "OPEN",
        isAnonymous: false,
      });
      dispatch(clearTicketDetailAction());
    } else {
      dispatch(fetchTicketDetailAction(id));
    }
  }, [id, isNew, dispatch]);

  useEffect(() => {
    if (!isNew && ticket) {
      setFormValues({
        title: ticket.title || "",
        description: ticket.description || "",
        status: ticket.status || "OPEN",
        isAnonymous: ticket.user === null,
      });
    }
  }, [isNew, ticket]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Check if the user is not logged in but tries to create a non-anonymous ticket.
    // The backend allows null user, but we should make sure the UI reflects it.
    let valuesToSubmit = { ...formValues };
    if (isNew && !isLoggedIn && !valuesToSubmit.isAnonymous) {
      valuesToSubmit.isAnonymous = true;
    }

    dispatch(saveTicketAction(id, valuesToSubmit, !isNew, navigate));
  };

  const handleDeleteTicket = async () => {
    try {
      await dispatch(deleteTicketAction(id));
      navigate("/tickets");
    } catch (e) {
      setLocalError(e.message || "Failed to delete ticket");
    }
    setShowDeleteModal(false);
  };

  if (loading || (!isNew && !ticket && !error)) {
    return (
      <Container className="text-center py-5">
        <Loading />
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: "600px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          {isNew
            ? "Create New Ticket"
            : isReadOnly
              ? "Ticket Details"
              : "Edit Ticket"}
        </h2>
        <Button
          variant="outline-secondary"
          onClick={() => navigate("/tickets")}
        >
          <i className="bi bi-arrow-left"></i> Back to List
        </Button>
      </div>

      {!isNew && (
        <p className="text-muted mb-4">
          <strong>Author:</strong> {ticket?.userDeleted ? "user deleted" : (ticket?.user?.email || "Anonymous")}
        </p>
      )}

      {(localError || error) && (
        <Alert variant="danger">{localError || error}</Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formTitle">
          <FloatingLabel label="Title">
            <Form.Control
              type="text"
              name="title"
              placeholder="Title"
              value={formValues.title}
              onChange={handleInputChange}
              required
              readOnly={isReadOnly}
            />
          </FloatingLabel>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDescription">
          <FloatingLabel label="Description">
            <Form.Control
              as="textarea"
              name="description"
              placeholder="Description"
              style={{ height: "150px" }}
              value={formValues.description}
              onChange={handleInputChange}
              required
              readOnly={isReadOnly}
            />
          </FloatingLabel>
        </Form.Group>

        {!isNew && (
          <Form.Group className="mb-3" controlId="formStatus">
            <FloatingLabel label="Status">
              <Form.Select
                name="status"
                value={formValues.status}
                onChange={handleInputChange}
                disabled={isReadOnly}
              >
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
              </Form.Select>
            </FloatingLabel>
          </Form.Group>
        )}

        {isNew && isLoggedIn && (
          <Form.Group className="mb-4" controlId="formAnonymous">
            <Form.Check
              type="switch"
              id="custom-switch-anonymous"
              label="Post Anonymously (You will not be able to edit or delete it)"
              name="isAnonymous"
              checked={formValues.isAnonymous}
              onChange={handleInputChange}
              disabled={isReadOnly}
            />
          </Form.Group>
        )}

        {isNew && !isLoggedIn && (
          <Alert variant="info" className="mb-4">
            You are creating this ticket as an anonymous user.
          </Alert>
        )}

        {!isReadOnly && (
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-100 mb-3"
          >
            {loading ? <Loading /> : isNew ? "Create Ticket" : "Save Changes"}
          </Button>
        )}
      </Form>

      {!isNew && !isReadOnly && (
        <>
          <hr className="my-4" />
          <h4 className="mb-3 text-danger">Danger Zone</h4>
          <Button
            variant="outline-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Ticket
          </Button>

          <ConfirmModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteTicket}
            title="Delete Ticket"
            message="Are you sure you want to delete this ticket? This action cannot be undone."
            confirmText="Delete Ticket"
            cancelText="Close"
            confirmVariant="danger"
          />
        </>
      )}
    </Container>
  );
};

export default TicketDetail;
