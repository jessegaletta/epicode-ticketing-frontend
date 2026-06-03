import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Container, Form, Button, Alert, FloatingLabel } from "react-bootstrap";
import { fetchBachelorDetailAction, clearBachelorDetailAction, saveBachelorAction, deleteBachelorAction } from "../redux/actions/bachelors";
import Loading from "../components/common/Loading";
import ConfirmModal from "../components/common/ConfirmModal";

const BachelorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isNew = id === "new" || location.pathname === "/bachelors/new" || !id;
  const { data: bachelorData, loading, error } = useSelector((state) => state.bachelors?.detail || {});
  const loggedInUser = useSelector((state) => state.auth?.user);
  const token = useSelector((state) => state.auth?.token);

  const canEdit = loggedInUser && (loggedInUser.role === "ADMIN" || loggedInUser.role === "FACULTY");
  const isReadOnly = !isNew && !canEdit;

  useEffect(() => {
    /* if a token exists but the profile hasn't loaded yet, the redirect is skipped;
       without this guard, authenticated users would be sent to access-denied on page refresh */
    if (token && !loggedInUser) return;
    if (!canEdit) {
      navigate("/access-denied");
    }
  }, [canEdit, navigate, token, loggedInUser]);

  const [formValues, setFormValues] = useState({
    description: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (isNew) {
      setFormValues({
        description: "",
      });
      dispatch(clearBachelorDetailAction());
    } else {
      dispatch(fetchBachelorDetailAction(id));
    }
  }, [id, isNew, dispatch]);

  useEffect(() => {
    if (!isNew && bachelorData) {
      setFormValues({
        description: bachelorData.description || "",
      });
    }
  }, [isNew, bachelorData]);

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) return;
    setLocalError("");
    try {
      await dispatch(saveBachelorAction(id, formValues, !isNew));
      navigate("/bachelors");
    } catch (err) {
      setLocalError(err.message || "Failed to save bachelor");
    }
  };

  const handleDelete = async () => {
    if (!canEdit) return;
    try {
      await dispatch(deleteBachelorAction(id));
      navigate("/bachelors");
    } catch (err) {
      setLocalError(err.message || "Failed to delete bachelor");
    }
    setShowDeleteModal(false);
  };

  if (loading || (!isNew && !bachelorData && !error)) {
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
            ? "Create New Bachelor"
            : isReadOnly
              ? "Bachelor Details"
              : "Edit Bachelor"}
        </h2>
        <Button
          variant="outline-secondary"
          onClick={() => navigate("/bachelors")}
        >
          <i className="bi bi-arrow-left"></i> Back to List
        </Button>
      </div>

      {(localError || error) && (
        <Alert variant="danger">{localError || error}</Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formDescription">
          <FloatingLabel label="Description">
            <Form.Control
              type="text"
              name="description"
              placeholder="Description"
              value={formValues.description}
              onChange={handleChange}
              readOnly={isReadOnly}
              required
            />
          </FloatingLabel>
        </Form.Group>

        {!isReadOnly && (
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-100 mb-3"
          >
            {loading ? <Loading /> : isNew ? "Create Bachelor" : "Save Changes"}
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
            Delete Bachelor
          </Button>

          <ConfirmModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
            title="Delete Bachelor"
            message="Are you sure you want to delete this bachelor? This action cannot be undone."
            confirmText="Delete Bachelor"
            cancelText="Close"
            confirmVariant="danger"
          />
        </>
      )}
    </Container>
  );
};

export default BachelorDetail;
