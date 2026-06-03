import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Container, Form, Button, Alert, FloatingLabel } from "react-bootstrap";
import Select from "react-select";
import { fetchCourseDetailAction, clearCourseDetailAction, saveCourseAction, deleteCourseAction } from "../redux/actions/courses";
import { fetchBachelorsListAction } from "../redux/actions/bachelors";
import Loading from "../components/common/Loading";
import ConfirmModal from "../components/common/ConfirmModal";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isNew = id === "new" || location.pathname === "/courses/new" || !id;
  const { data: courseData, loading, error } = useSelector((state) => state.courses?.detail || {});
  const { data: bachelorsData } = useSelector((state) => state.bachelors?.list || { data: [] });
  const loggedInUser = useSelector((state) => state.auth?.user);
  const token = useSelector((state) => state.auth?.token);
  const darkMode = useSelector((state) => state.settings?.darkMode);

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
    bachelorIds: [],
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    dispatch(fetchBachelorsListAction({ page: 0, size: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (isNew) {
      setFormValues({
        description: "",
        bachelorIds: [],
      });
      dispatch(clearCourseDetailAction());
    } else {
      dispatch(fetchCourseDetailAction(id));
    }
  }, [id, isNew, dispatch]);

  useEffect(() => {
    if (!isNew && courseData) {
      setFormValues({
        description: courseData.description || "",
        bachelorIds: (courseData.bachelors || []).map(b => b.id),
      });
    }
  }, [isNew, courseData]);

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (selectedOptions) => {
    setFormValues({
      ...formValues,
      bachelorIds: selectedOptions ? selectedOptions.map(option => option.value) : [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) return;
    setLocalError("");
    try {
      await dispatch(saveCourseAction(id, formValues, !isNew));
      navigate("/courses");
    } catch (err) {
      setLocalError(err.message || "Failed to save course");
    }
  };

  const handleDelete = async () => {
    if (!canEdit) return;
    try {
      await dispatch(deleteCourseAction(id));
      navigate("/courses");
    } catch (err) {
      setLocalError(err.message || "Failed to delete course");
    }
    setShowDeleteModal(false);
  };

  if (loading || (!isNew && !courseData && !error)) {
    return (
      <Container className="text-center py-5">
        <Loading />
      </Container>
    );
  }

  const bachelorOptions = bachelorsData.map(bachelor => ({
    value: bachelor.id,
    label: bachelor.description,
  }));

  const selectedBachelors = bachelorOptions.filter(option => formValues.bachelorIds.includes(option.value));

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: darkMode ? '#212529' : '#fff',
      borderColor: darkMode ? '#495057' : '#ced4da',
      color: darkMode ? '#f8f9fa' : '#212529',
      boxShadow: state.isFocused ? (darkMode ? '0 0 0 0.25rem rgba(255, 255, 255, 0.25)' : '0 0 0 0.25rem rgba(13, 110, 253, 0.25)') : 'none',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: darkMode ? '#212529' : '#fff',
      border: darkMode ? '1px solid #495057' : '1px solid #ced4da',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? (darkMode ? '#343a40' : '#e9ecef')
        : (darkMode ? '#212529' : '#fff'),
      color: darkMode ? '#f8f9fa' : '#212529',
      '&:active': {
        backgroundColor: darkMode ? '#495057' : '#0d6efd',
        color: '#fff',
      }
    }),
    singleValue: (base) => ({
      ...base,
      color: darkMode ? '#f8f9fa' : '#212529',
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: darkMode ? '#343a40' : '#e9ecef',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: darkMode ? '#f8f9fa' : '#212529',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: darkMode ? '#f8f9fa' : '#212529',
      ':hover': {
        backgroundColor: '#dc3545',
        color: '#fff',
      },
    }),
  };

  return (
    <Container className="py-5" style={{ maxWidth: "600px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          {isNew
            ? "Create New Course"
            : isReadOnly
              ? "Course Details"
              : "Edit Course"}
        </h2>
        <Button
          variant="outline-secondary"
          onClick={() => navigate("/courses")}
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

        <Form.Group className="mb-4" controlId="formBachelors">
          <Form.Label>Assign Bachelors</Form.Label>
          <Select
            isMulti
            name="bachelors"
            options={bachelorOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            value={selectedBachelors}
            onChange={handleSelectChange}
            isDisabled={isReadOnly}
            placeholder="Select bachelors..."
            styles={customStyles}
          />
        </Form.Group>

        {!isReadOnly && (
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-100 mb-3"
          >
            {loading ? <Loading /> : isNew ? "Create Course" : "Save Changes"}
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
            Delete Course
          </Button>

          <ConfirmModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
            title="Delete Course"
            message="Are you sure you want to delete this course? This action cannot be undone."
            confirmText="Delete Course"
            cancelText="Close"
            confirmVariant="danger"
          />
        </>
      )}
    </Container>
  );
};

export default CourseDetail;
