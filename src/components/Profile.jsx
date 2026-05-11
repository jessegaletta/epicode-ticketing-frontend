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
import { SET_USER, SET_SETTINGS } from "../redux/actions";
import Loading from "./Loading";
import TimezoneSelect from "react-timezone-select";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const settings = useSelector((state) => state.settings);

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    darkMode: false,
    timezone: "Europe/Amsterdam",
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
        timezone: settings.timezone || "Europe/Amsterdam",
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

      if (response.ok) {
        const userData = await response.json();

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
          },
        });

        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
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
        setError(errorMsg);
      }
    } catch (err) {
      setError("An error occurred while updating profile.");
    } finally {
      setLoading(false);
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
          <Form.Label
            className="text-muted mb-1"
            style={{ fontSize: "0.875em" }}
          >
            Timezone
          </Form.Label>
          <TimezoneSelect
            value={formValues.timezone}
            onChange={(tz) =>
              setFormValues({ ...formValues, timezone: tz.value })
            }
            classNames={{
              control: () => "form-control bg-body text-body",
              menu: () => "bg-body text-body border shadow-sm",
              option: (state) =>
                state.isFocused ? "bg-primary text-white" : "bg-body text-body",
              singleValue: () => "text-body",
              input: () => "text-body",
            }}
          />
        </Form.Group>

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

        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="w-100"
        >
          {loading ? <Loading /> : "Save Changes"}
        </Button>
      </Form>
    </Container>
  );
};

export default Profile;
