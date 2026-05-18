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
import { updateProfileAction, deleteAccountAction, CLEAR_AUTH_MESSAGES } from "../redux/actions";
import Loading from "./Loading";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";
import { useNavigate } from "react-router";
import ConfirmModal from "./ConfirmModal";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading, error: reduxError, successMessage } = useSelector((state) => state.auth);
  const settings = useSelector((state) => state.settings);

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
    darkMode: false,
    timezone: "Europe/Belgrade",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
  });

  const [localError, setLocalError] = useState("");

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
  // Pre-fill form when user/settings data becomes available
  useEffect(() => {
    if (user && settings) {
      setFormValues({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        darkMode: settings.darkMode || false,
        timezone: settings.timezone || "Europe/Belgrade",
        dateFormat: settings.dateFormat || "DD/MM/YYYY",
        timeFormat: settings.timeFormat || "24h",
      });
    }
  }, [user, settings]);

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

    dispatch(updateProfileAction(submitValues, avatarFile, token));
  };

  const handleDeleteAccount = () => {
    dispatch(deleteAccountAction(token, navigate));
    setShowDeleteModal(false);
  };

  if (!user) {
    return (
      <Container className="text-center py-5">
        <Loading />
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Profile</h2>

      {(localError || reduxError) && <Alert variant="danger">{localError || reduxError}</Alert>}
      {successMessage && (
        <Alert variant="success">{successMessage}</Alert>
      )}

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
              />
            </FloatingLabel>
          </Form.Group>
        </Row>

        <Form.Group className="mb-4" controlId="formEmail">
          <FloatingLabel label="Email address">
            <Form.Control
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formValues.email}
              onChange={handleInputChange}
              required
            />
          </FloatingLabel>
        </Form.Group>

         <hr className="my-4" />

        <h4 className="mb-3">Security</h4>

        <Form.Group className="mb-3" controlId="formNewPassword">
          <FloatingLabel label="New Password">
            <Form.Control
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
              title="Must contain at least 8 characters, including uppercase, lowercase letters and numbers"
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
          />
        </Form.Group>

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
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="w-100 mb-3"
        >
          {loading ? <Loading /> : "Save Changes"}
        </Button>
      </Form>

      <hr className="my-4" />

      <h4 className="mb-3 text-danger">Danger Zone</h4>
      <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)}>
        Delete Account
      </Button>

      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        confirmText="Delete Account"
        cancelText="Close"
        confirmVariant="danger"
      />
    </Container>
  );
};

export default Profile;
