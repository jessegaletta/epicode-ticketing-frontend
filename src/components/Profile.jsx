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
import { SET_USER, SET_SETTINGS, logoutAction } from "../redux/actions";
import Loading from "./Loading";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";
import { useNavigate } from "react-router";
import ConfirmModal from "./ConfirmModal";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const settings = useSelector((state) => state.settings);

  const { options } = useTimezoneSelect({ timezones: allTimezones, labelStyle: "original", displayValue: "GMT" });

  const [avatarFile, setAvatarFile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    darkMode: false,
    timezone: "Europe/Belgrade",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        let errorMsg = "Failed to update profile";
        try {
          const errorData = await response.json();
          if (errorData.errorsList && errorData.errorsList.length > 0) {
            errorMsg = errorData.errorsList.join(", ");
          } else {
            errorMsg = errorData.message || errorMsg;
          }
        } catch (e) {
          // ignore
        }
        throw new Error(errorMsg);
      }

      let userData = await response.json();

      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const avatarResponse = await fetch("http://localhost:3001/users/me/avatar", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!avatarResponse.ok) {
          throw new Error("Failed to upload avatar");
        }
        userData = await avatarResponse.json();
      }

      // Update Redux state with new data
      dispatch({
        type: SET_USER,
        payload: {
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          avatarURL: userData.avatarURL,
          role: userData.role,
        },
      });

      dispatch({
        type: SET_SETTINGS,
        payload: {
          darkMode: userData.darkMode,
          timezone: userData.timezone,
          dateFormat: userData.dateFormat,
          timeFormat: userData.timeFormat,
        },
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "An error occurred while updating profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("http://localhost:3001/users/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        dispatch(logoutAction(navigate));
      } else {
        setError("Failed to delete account");
        setShowDeleteModal(false);
      }
    } catch (err) {
      setError("An error occurred while deleting account.");
      setShowDeleteModal(false);
    }
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

      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <Alert variant="success">Profile updated successfully!</Alert>
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
          <Form.Label className="text-muted mb-1" style={{ fontSize: "0.875em" }}>
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
