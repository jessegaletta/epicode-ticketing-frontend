import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Container, Form, Button, Alert, FloatingLabel, Spinner } from "react-bootstrap";
import { fetchBachelorDetailAction, clearBachelorDetailAction, saveBachelorAction, deleteBachelorAction } from "../redux/actions/bachelors";

const BachelorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isEditingParam = id !== "new";
  // If the user arrived here from GenericTable with isEditable=false, they can only view.
  // We'll enforce actual auth checks on the backend anyway.
  const isEditable = isEditingParam ? location.state?.editMode !== false : true;

  const [formValues, setFormValues] = useState({
    description: "",
  });

  const { data: bachelorData, loading, error } = useSelector((state) => state.bachelors.detail);
  const loggedInUser = useSelector((state) => state.auth?.user);

  const canEdit = loggedInUser && (loggedInUser.role === "ADMIN" || loggedInUser.role === "FACULTY");

  useEffect(() => {
    if (isEditingParam) {
      dispatch(fetchBachelorDetailAction(id));
    }
    return () => {
      dispatch(clearBachelorDetailAction());
    };
  }, [dispatch, id, isEditingParam]);

  useEffect(() => {
    if (bachelorData && isEditingParam) {
      setFormValues({
        description: bachelorData.description || "",
      });
    }
  }, [bachelorData, isEditingParam]);

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canEdit) return;
    dispatch(saveBachelorAction(id, formValues, isEditingParam));
    navigate("/bachelors");
  };

  const handleDelete = () => {
    if (!canEdit) return;
    if (window.confirm("Are you sure you want to delete this bachelor?")) {
      dispatch(deleteBachelorAction(id));
      navigate("/bachelors");
    }
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="my-4" style={{ maxWidth: "600px" }}>
      <h2>{isEditingParam ? (canEdit ? "Edit Bachelor" : "View Bachelor") : "New Bachelor"}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit} className="mt-4">
        <FloatingLabel label="Description" className="mb-3">
          <Form.Control
            type="text"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            readOnly={!canEdit}
            required
          />
        </FloatingLabel>

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => navigate("/bachelors")}>
            Back
          </Button>
          {canEdit && (
            <div>
              {isEditingParam && (
                <Button variant="danger" className="me-2" onClick={handleDelete}>
                  Delete
                </Button>
              )}
              <Button variant="primary" type="submit">
                {isEditingParam ? "Update" : "Create"}
              </Button>
            </div>
          )}
        </div>
      </Form>
    </Container>
  );
};

export default BachelorDetail;
