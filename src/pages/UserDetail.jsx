import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  FloatingLabel,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProfileAction,
  deleteAccountAction,
  CLEAR_AUTH_MESSAGES,
  fetchUserDetailAction,
  saveUserAction,
  deleteUserAction,
} from "../redux/actions";
import { fetchBachelorsListAction } from "../redux/actions/bachelors";
import Loading from "../components/common/Loading";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";
import { useNavigate, useParams, useLocation } from "react-router";
import ConfirmModal from "../components/common/ConfirmModal";

const UserDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const {
    user,
    token,
    loading: authLoading,
    error: reduxError,
    successMessage,
  } = useSelector((state) => state.auth);
  const settings = useSelector((state) => state.settings);
  const {
    data: otherUser,
    loading: detailLoading,
    error: detailError,
  } = useSelector((state) => state.users?.detail || {});
  const bachelors = useSelector((state) => state.bachelors?.list?.data || []);

  /* these booleans are derived from the URL so this one component handles three different modes:
     viewing the logged-in user's profile, creating a new user, and editing/viewing another user */
  const isMe =
    location.pathname === "/users/me" || (user && id && String(user.id) === id);
  const isNew = id === "new" || location.pathname === "/users/new";
  const isEditOther = id && id !== "new" && !isMe;
  const isReadOnly = isEditOther && !location.state?.editMode;

  const isLoading = isMe ? authLoading : detailLoading;
  const error = isMe ? reduxError : detailError;

  /* useTimezoneSelect is from a third-party library (react-timezone-select) that provides
     a ready-made list of all timezones with their GMT offset labels */
  const { options } = useTimezoneSelect({
    timezones: allTimezones,
    labelStyle: "original",
    displayValue: "GMT",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "STUDENT",
    bachelorId: "",
    darkMode: false,
    timezone: "Europe/Belgrade",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
  });

  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    dispatch(fetchBachelorsListAction({ size: 100 }));
  }, [dispatch]);

  /* the function returned from useEffect runs as "cleanup" when the component is unmounted;
     used to clear error/success messages so they don't show up when returning to this page */
  useEffect(() => {
    return () => {
      dispatch({ type: CLEAR_AUTH_MESSAGES });
    };
  }, [dispatch]);

  useEffect(() => {
    if (successMessage === "Profile updated successfully!") {
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [successMessage]);

  useEffect(() => {
    if (isEditOther) {
      dispatch(fetchUserDetailAction(id));
    } else if (isNew) {
      setFormValues({
        firstName: "",
        lastName: "",
        email: "",
        role: "STUDENT",
        bachelorId: "",
        darkMode: false,
        timezone: "Europe/Belgrade",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "24h",
      });
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [id, isEditOther, isNew, dispatch]);

  useEffect(() => {
    if (isMe && user && settings) {
      setFormValues({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        role: user.role || "STUDENT",
        bachelorId: user.bachelorId || "",
        darkMode: settings.darkMode || false,
        timezone: settings.timezone || "Europe/Belgrade",
        dateFormat: settings.dateFormat || "DD/MM/YYYY",
        timeFormat: settings.timeFormat || "24h",
      });
    } else if (isEditOther && otherUser) {
      setFormValues({
        firstName: otherUser.firstName || "",
        lastName: otherUser.lastName || "",
        email: otherUser.email || "",
        role: otherUser.role || "STUDENT",
        bachelorId: otherUser.bachelorId || "",
        darkMode: otherUser.darkMode || false,
        timezone: otherUser.timezone || "Europe/Belgrade",
        dateFormat: otherUser.dateFormat || "DD/MM/YYYY",
        timeFormat: otherUser.timeFormat || "24h",
      });
    }
  }, [isMe, user, settings, isEditOther, otherUser]);

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

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setLocalError("Passwords do not match.");
        return;
      }
    }

    const submitValues = { ...formValues };
    if (newPassword) {
      submitValues.password = newPassword;
    }

    if (isMe) {
      dispatch(updateProfileAction(submitValues, avatarFile, token));
    } else {
      dispatch(saveUserAction(id, submitValues, isEditOther, navigate));
    }
  };

  const handleDeleteAccount = async () => {
    if (isMe) {
      dispatch(deleteAccountAction(token, navigate));
    } else if (isEditOther) {
      try {
        await dispatch(deleteUserAction(id));
        navigate("/users");
      } catch (e) {
        setLocalError(e.message || "Failed to delete user");
      }
    }
    setShowDeleteModal(false);
  };

  // when the server returns 403, the user is redirected to the access-denied page instead of a raw error
  useEffect(() => {
    if (
      error &&
      typeof error === "string" &&
      (error.toLowerCase().includes("access denied") || error.includes("403"))
    ) {
      navigate("/access-denied");
    }
  }, [error, navigate]);

  if (
    isLoading ||
    (isMe && !user && !error) ||
    (isEditOther && !otherUser && !error)
  ) {
    return (
      <Container className="text-center py-5">
        <Loading />
      </Container>
    );
  }

  const showRoleDropdown = (isNew || isEditOther) && user?.role === "ADMIN";

  return (
    <Container className="py-5" style={{ maxWidth: "600px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          {isNew
            ? "Create New User"
            : isEditOther
              ? isReadOnly
                ? "User Details"
                : "Edit User"
              : "My Profile"}
        </h2>
        {(isNew || (id && id !== "new")) && (
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/users")}
          >
            <i className="bi bi-arrow-left"></i> Back to List
          </Button>
        )}
      </div>

      {(localError || error) && (
        <Alert variant="danger">{localError || error}</Alert>
      )}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formFirstName">
            <FloatingLabel label="First Name">
              <Form.Control
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formValues.firstName}
                onChange={handleInputChange}
                minLength={2}
                maxLength={30}
                required
                readOnly={isReadOnly}
              />
            </FloatingLabel>
          </Form.Group>

          <Form.Group as={Col} controlId="formLastName">
            <FloatingLabel label="Last Name">
              <Form.Control
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formValues.lastName}
                onChange={handleInputChange}
                minLength={2}
                maxLength={30}
                required
                readOnly={isReadOnly}
              />
            </FloatingLabel>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formEmail">
            <FloatingLabel label="Email address">
              <Form.Control
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formValues.email}
                onChange={handleInputChange}
                required
                readOnly={isReadOnly}
              />
            </FloatingLabel>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          {showRoleDropdown && (
            <Form.Group as={Col} controlId="formRole">
              <FloatingLabel label="Role">
                <Form.Select
                  name="role"
                  value={formValues.role}
                  onChange={handleInputChange}
                  disabled={isReadOnly}
                >
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY">Faculty</option>
                  <option value="ADMIN">Admin</option>
                </Form.Select>
              </FloatingLabel>
            </Form.Group>
          )}
          {formValues.role === "STUDENT" && (
            <Form.Group as={Col} controlId="formBachelor">
              <FloatingLabel label="Bachelor">
                <Form.Select
                  name="bachelorId"
                  value={formValues.bachelorId}
                  onChange={handleInputChange}
                  disabled={isReadOnly}
                  required
                >
                  <option value="" disabled>Select a bachelor</option>
                  {bachelors.map(b => (
                    <option key={b.id} value={b.id}>{b.description}</option>
                  ))}
                </Form.Select>
              </FloatingLabel>
            </Form.Group>
          )}
        </Row>

        <hr className="my-4" />

        <h4 className="mb-3">Security</h4>

        <Form.Group className="mb-3" controlId="formNewPassword">
          <FloatingLabel label={isNew ? "Password" : "New Password"}>
            <Form.Control
              type="password"
              placeholder={isNew ? "Password" : "New Password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
              title="Must contain at least 8 characters, including uppercase, lowercase letters and numbers"
              readOnly={isReadOnly}
              required={isNew}
            />
          </FloatingLabel>
        </Form.Group>

        <Form.Group className="mb-4" controlId="formConfirmPassword">
          <FloatingLabel label="Confirm Password">
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              readOnly={isReadOnly}
              required={isNew}
            />
          </FloatingLabel>
        </Form.Group>

        <hr className="my-4" />

        <h4 className="mb-3">Preferences</h4>

        <Form.Group className="mb-3" controlId="formTimezone">
          <FloatingLabel label="Timezone">
            <Form.Select
              name="timezone"
              value={formValues.timezone}
              onChange={handleInputChange}
              aria-label="Timezone"
              disabled={isReadOnly}
            >
              {options.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDateFormat">
          <FloatingLabel label="Date Format">
            <Form.Select
              name="dateFormat"
              value={formValues.dateFormat}
              onChange={handleInputChange}
              aria-label="Date Format"
              disabled={isReadOnly}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (EU)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
            </Form.Select>
          </FloatingLabel>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formTimeFormat">
          <FloatingLabel label="Time Format">
            <Form.Select
              name="timeFormat"
              value={formValues.timeFormat}
              onChange={handleInputChange}
              aria-label="Time Format"
              disabled={isReadOnly}
            >
              <option value="24h">24h</option>
              <option value="12h">12h (AM/PM)</option>
            </Form.Select>
          </FloatingLabel>
        </Form.Group>

        <hr className="my-4" />

        <h4 className="mb-3">Appearance</h4>

        <Form.Group className="mb-3" controlId="formDarkMode">
          <Form.Check
            type="switch"
            id="custom-switch-dark"
            label="Enable Dark Mode"
            name="darkMode"
            checked={formValues.darkMode}
            onChange={handleInputChange}
            disabled={isReadOnly}
          />
        </Form.Group>

        {isMe && (
          <Form.Group className="mb-4" controlId="formAvatar">
            <Form.Label
              className="text-muted mb-1"
              style={{ fontSize: "0.875em" }}
            >
              Profile Picture
            </Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
              disabled={isReadOnly}
            />
          </Form.Group>
        )}

        {!isReadOnly && (
          <Button
            variant="primary"
            type="submit"
            disabled={isLoading}
            className="w-100 mb-3"
          >
            {isLoading ? <Loading /> : isNew ? "Create User" : "Save Changes"}
          </Button>
        )}
      </Form>

      {(isMe || (isEditOther && !isReadOnly)) && (
        <>
          <hr className="my-4" />
          <h4 className="mb-3 text-danger">Danger Zone</h4>
          <Button
            variant="outline-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            {isMe ? "Delete Account" : "Delete User"}
          </Button>

          <ConfirmModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteAccount}
            title={isMe ? "Delete Account" : "Delete User"}
            message={`Are you sure you want to delete ${isMe ? "your account" : "this user"}? This action cannot be undone.`}
            confirmText={isMe ? "Delete Account" : "Delete User"}
            cancelText="Close"
            confirmVariant="danger"
          />
        </>
      )}
    </Container>
  );
};

export default UserDetail;
