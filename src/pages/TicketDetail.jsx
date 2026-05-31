import { Container, Form, Button, Alert, FloatingLabel } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTicketDetailAction,
  saveTicketAction,
  deleteTicketAction,
  clearTicketDetailAction,
  changeTicketStatusAction,
} from "../redux/actions/tickets";
import {
  fetchActivitiesAction,
  createActivityAction,
  updateActivityAction,
  deleteActivityAction,
  clearActivitiesAction,
} from "../redux/actions/activities";
import { fetchAllCoursesAction } from "../redux/actions/courses";
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
  const { data: activities, loading: activitiesLoading } = useSelector(
    (state) => state.activities || { data: [], loading: false }
  );
  const { data: courses } = useSelector((state) => state.courses?.allList || { data: [] });
  const { user: loggedInUser, isLoggedIn } = useSelector((state) => state.auth);
  const settings = useSelector((state) => state.settings);

  let ticketIsEditable = false;
  if (ticket && loggedInUser) {
    if (loggedInUser.role === "ADMIN") {
      ticketIsEditable = true;
    } else if (ticket.user && ticket.user.id === loggedInUser.id) {
      ticketIsEditable = true;
    }
  }

  // We can edit if it's new, or if the user has editMode from the table row click, or computed ticketIsEditable.
  const isReadOnly = !isNew && !ticketIsEditable && !location.state?.editMode;

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;

    const tz = settings?.timezone || "UTC";
    const dateFormat = settings?.dateFormat || "DD/MM/YYYY";
    const timeFormat = settings?.timeFormat || "24h";

    try {
      const optionsDate = { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" };
      const optionsTime = { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: timeFormat === "12h" };

      const parts = new Intl.DateTimeFormat("en-US", optionsDate).formatToParts(date);
      const m = parts.find(p => p.type === "month").value;
      const d = parts.find(p => p.type === "day").value;
      const y = parts.find(p => p.type === "year").value;
      
      let formattedDate = "";
      if (dateFormat === "DD/MM/YYYY") formattedDate = `${d}/${m}/${y}`;
      else if (dateFormat === "MM/DD/YYYY") formattedDate = `${m}/${d}/${y}`;
      else if (dateFormat === "YYYY-MM-DD") formattedDate = `${y}-${m}-${d}`;

      const formattedTime = new Intl.DateTimeFormat("en-US", optionsTime).format(date);
      return `${formattedDate} ${formattedTime}`;
    } catch (e) {
      return dateString;
    }
  };

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    isAnonymous: false,
    category: "ERROR",
    courseId: "",
    moduleName: "",
    lessonName: "",
    expectedBenefit: "",
    requestType: "DIDACTIC",
    isFaqCandidate: false
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [localError, setLocalError] = useState("");

  // Activity States
  const [newActivityText, setNewActivityText] = useState("");
  const [newActivityAnonymous, setNewActivityAnonymous] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [editingActivityText, setEditingActivityText] = useState("");
  const [showActivityDeleteModal, setShowActivityDeleteModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [showAddActivityForm, setShowAddActivityForm] = useState(false);
  
  // Status Change States
  const [showChangeStatusForm, setShowChangeStatusForm] = useState(false);
  const [newStatus, setNewStatus] = useState("OPEN");
  const [statusComment, setStatusComment] = useState("");

  useEffect(() => {
    dispatch(fetchAllCoursesAction());
    if (isNew) {
      setFormValues({
        title: "",
        description: "",
        isAnonymous: false,
        category: "ERROR",
        courseId: "",
        moduleName: "",
        lessonName: "",
        expectedBenefit: "",
        requestType: "DIDACTIC",
        isFaqCandidate: false
      });
      dispatch(clearTicketDetailAction());
      dispatch(clearActivitiesAction());
    } else {
      dispatch(fetchTicketDetailAction(id));
      dispatch(fetchActivitiesAction(id));
    }
  }, [id, isNew, dispatch]);

  useEffect(() => {
    if (!isNew && ticket) {
      setFormValues({
        title: ticket.title || "",
        description: ticket.description || "",
        isAnonymous: ticket.user === null,
        category: ticket.category || "ERROR",
        courseId: ticket.course?.id || "",
        moduleName: ticket.moduleName || "",
        lessonName: ticket.lessonName || "",
        expectedBenefit: ticket.expectedBenefit || "",
        requestType: ticket.requestType || "DIDACTIC",
        isFaqCandidate: ticket.isFaqCandidate || false
      });
      setNewStatus(ticket.status || "OPEN");
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

  const handleChangeStatus = async (e) => {
    e.preventDefault();
    if (!newStatus) return;
    try {
      await dispatch(changeTicketStatusAction(id, { status: newStatus, comment: statusComment }));
      setShowChangeStatusForm(false);
      setStatusComment("");
      dispatch(fetchActivitiesAction(id));
    } catch (err) {
      setLocalError(err.message || "Failed to change status");
    }
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

  const handleCreateActivity = async (e) => {
    e.preventDefault();
    if (!newActivityText.trim()) return;
    try {
      let isAnon = newActivityAnonymous;
      if (!isLoggedIn) {
        isAnon = true;
      }
      await dispatch(createActivityAction(id, { text: newActivityText, isAnonymous: isAnon }));
      setNewActivityText("");
      setNewActivityAnonymous(false);
      setShowAddActivityForm(false);
    } catch (err) {
      setLocalError(err.message || "Failed to create activity");
    }
  };

  const handleUpdateActivity = async (activityId) => {
    if (!editingActivityText.trim()) return;
    try {
      await dispatch(updateActivityAction(activityId, { text: editingActivityText }));
      setEditingActivityId(null);
      setEditingActivityText("");
    } catch (err) {
      setLocalError(err.message || "Failed to update activity");
    }
  };

  const confirmDeleteActivity = (activityId) => {
    setActivityToDelete(activityId);
    setShowActivityDeleteModal(true);
  };

  const executeDeleteActivity = async () => {
    if (!activityToDelete) return;
    try {
      await dispatch(deleteActivityAction(activityToDelete));
      setShowActivityDeleteModal(false);
      setActivityToDelete(null);
    } catch (err) {
      setLocalError(err.message || "Failed to delete activity");
    }
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
          <strong>Author:</strong> {ticket?.userDeleted ? "user deleted" : (ticket?.user?.email ? `${ticket.user.email}${ticket.authorBachelorDescription ? ` (${ticket.authorBachelorDescription})` : ""}` : "Anonymous")}<br/>
          <strong>Status:</strong> <span className={`badge bg-${ticket?.status === 'OPEN' ? 'primary' : ticket?.status === 'RESOLVED' ? 'success' : ticket?.status === 'REJECTED' ? 'danger' : ticket?.status === 'IN_PROGRESS' ? 'info' : 'warning'}`}>
            {ticket?.status === 'OPEN' ? 'Open' : 
             ticket?.status === 'IN_PROGRESS' ? 'In progress' : 
             ticket?.status === 'PENDING_INFO' ? 'Pending info' : 
             ticket?.status === 'RESOLVED' ? 'Resolved' : 
             ticket?.status === 'REJECTED' ? 'Rejected' : ticket?.status}
          </span>
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

        {isNew && (
          <Form.Group className="mb-3" controlId="formCategory">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={formValues.category}
              onChange={handleInputChange}
              disabled={isReadOnly}
            >
              <option value="ERROR">Error</option>
              <option value="SUGGESTION">Suggestion</option>
              <option value="REQUEST">Request</option>
              <option value="DOUBT">Doubt</option>
            </Form.Select>
          </Form.Group>
        )}

        {(formValues.category === "ERROR" || formValues.category === "DOUBT") && (
          <Form.Group className="mb-3" controlId="formCourseId">
            <Form.Label>Course {formValues.category === "DOUBT" ? "(Optional)" : ""}</Form.Label>
            <Form.Select
              name="courseId"
              value={formValues.courseId}
              onChange={handleInputChange}
              disabled={isReadOnly}
              required={formValues.category === "ERROR"}
            >
              <option value="">Select a course...</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.description}</option>
              ))}
            </Form.Select>
          </Form.Group>
        )}

        {formValues.category === "ERROR" && (
          <>
            <Form.Group className="mb-3" controlId="formModuleName">
              <FloatingLabel label="Module Name">
                <Form.Control
                  type="text"
                  name="moduleName"
                  placeholder="Module Name"
                  value={formValues.moduleName}
                  onChange={handleInputChange}
                  disabled={isReadOnly}
                  required
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLessonName">
              <FloatingLabel label="Lesson Name">
                <Form.Control
                  type="text"
                  name="lessonName"
                  placeholder="Lesson Name"
                  value={formValues.lessonName}
                  onChange={handleInputChange}
                  disabled={isReadOnly}
                  required
                />
              </FloatingLabel>
            </Form.Group>
          </>
        )}

        {formValues.category === "SUGGESTION" && (
          <Form.Group className="mb-3" controlId="formExpectedBenefit">
            <FloatingLabel label="Expected Benefit">
              <Form.Control
                as="textarea"
                name="expectedBenefit"
                placeholder="Expected Benefit"
                style={{ height: "100px" }}
                value={formValues.expectedBenefit}
                onChange={handleInputChange}
                disabled={isReadOnly}
                required
              />
            </FloatingLabel>
          </Form.Group>
        )}

        {formValues.category === "REQUEST" && (
          <Form.Group className="mb-3" controlId="formRequestType">
            <Form.Label>Request Type</Form.Label>
            <Form.Select
              name="requestType"
              value={formValues.requestType}
              onChange={handleInputChange}
              disabled={isReadOnly}
              required
            >
              <option value="DIDACTIC">Didactic</option>
              <option value="ADMINISTRATIVE">Administrative</option>
              <option value="TECHNICAL">Technical</option>
              <option value="OTHER">Other</option>
            </Form.Select>
          </Form.Group>
        )}

        {formValues.category === "DOUBT" && (
          <Form.Group className="mb-3" controlId="formIsFaqCandidate">
            <Form.Check
              type="checkbox"
              label="Is FAQ Candidate?"
              name="isFaqCandidate"
              checked={formValues.isFaqCandidate}
              onChange={handleInputChange}
              disabled={isReadOnly}
            />
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

      {!isNew && loggedInUser && (loggedInUser.role === 'ADMIN' || loggedInUser.role === 'FACULTY') && (
        <>
          <hr className="my-4" />
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0 text-primary">Manage Status</h4>
            {!showChangeStatusForm && (
              <Button variant="outline-primary" size="sm" onClick={() => setShowChangeStatusForm(true)}>
                Change Status
              </Button>
            )}
          </div>
          
          {showChangeStatusForm && (
            <div className="mb-4 p-3 bg-body-tertiary border rounded shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Change Ticket Status</h5>
                <Button variant="close" onClick={() => setShowChangeStatusForm(false)} aria-label="Close"></Button>
              </div>
              <Form onSubmit={handleChangeStatus}>
                <Form.Group className="mb-3" controlId="formNewStatus">
                  <Form.Label>New Status</Form.Label>
                  <Form.Select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    required
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="PENDING_INFO">Pending info</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="REJECTED">Rejected</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formStatusComment">
                  <Form.Label>Comment (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Add a comment to explain this status change..."
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                  />
                </Form.Group>
                <Button type="submit" variant="primary" size="sm" disabled={loading}>
                  {loading ? "Updating..." : "Update Status"}
                </Button>
              </Form>
            </div>
          )}
        </>
      )}

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

      {!isNew && (
        <>
          <hr className="my-5" />
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0">Activities</h3>
            {!showAddActivityForm && (
              <Button variant="primary" size="sm" onClick={() => setShowAddActivityForm(true)}>
                <i className="bi bi-plus-lg"></i> Add Activity
              </Button>
            )}
          </div>
          
          {showAddActivityForm && (
            <div className="mb-4 p-3 bg-body-tertiary border rounded shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Add an Activity</h5>
                <Button variant="close" onClick={() => setShowAddActivityForm(false)} aria-label="Close"></Button>
              </div>
              <Form onSubmit={handleCreateActivity}>
              <Form.Group className="mb-3" controlId="formNewActivity">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Write your activity/comment here..."
                  value={newActivityText}
                  onChange={(e) => setNewActivityText(e.target.value)}
                  required
                />
              </Form.Group>
              {isLoggedIn && (
                <Form.Group className="mb-3" controlId="formAnonActivity">
                  <Form.Check
                    type="switch"
                    label="Post Anonymously"
                    checked={newActivityAnonymous}
                    onChange={(e) => setNewActivityAnonymous(e.target.checked)}
                  />
                </Form.Group>
              )}
              {!isLoggedIn && (
                <Alert variant="info" className="py-2 mb-3">You are posting as an anonymous user.</Alert>
              )}
              <Button type="submit" variant="primary" size="sm" disabled={activitiesLoading}>
                {activitiesLoading ? "Posting..." : "Post Activity"}
              </Button>
            </Form>
          </div>
          )}

          {activitiesLoading && activities.length === 0 ? (
            <Loading />
          ) : activities.length === 0 ? (
            <p className="text-muted">No activities yet.</p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {activities.map(activity => {
                let isEditable = false;
                if (loggedInUser) {
                  if (loggedInUser.role === "ADMIN") {
                    isEditable = true;
                  } else if (activity.user && activity.user.id === loggedInUser.id) {
                    isEditable = true;
                  }
                }

                const authorDisplay = activity.userDeleted 
                  ? "user deleted" 
                  : (activity.user && activity.user.email 
                      ? `${activity.user.email}${activity.authorBachelorDescription ? ` (${activity.authorBachelorDescription})` : ""}` 
                      : "Anonymous");

                const dateDisplay = formatDateTime(activity.createdAt);

                const isStatus = activity.statusChange;
                return (
                  <div key={activity.id} className={`card shadow-sm border-0 mb-3 ${isStatus ? 'bg-primary-subtle' : ''}`}>
                    <div className={`card-header d-flex justify-content-between align-items-center border-bottom-0 ${isStatus ? 'bg-primary-subtle' : 'bg-body-tertiary'}`}>
                      <div>
                        {isStatus && <i className="bi bi-info-circle-fill text-primary me-2"></i>}
                        <strong>{authorDisplay}</strong>
                        <span className="text-muted ms-2" style={{ fontSize: "0.85em" }}>{dateDisplay}</span>
                      </div>
                      {!isStatus && isEditable && (
                        <div>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="p-0 text-decoration-none me-3"
                            onClick={() => {
                              if (editingActivityId === activity.id) {
                                setEditingActivityId(null);
                              } else {
                                setEditingActivityId(activity.id);
                                setEditingActivityText(activity.text);
                              }
                            }}
                          >
                            <i className="bi bi-pencil"></i> Edit
                          </Button>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="p-0 text-decoration-none text-danger"
                            onClick={() => confirmDeleteActivity(activity.id)}
                          >
                            <i className="bi bi-trash"></i> Delete
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="card-body">
                      {editingActivityId === activity.id ? (
                        <div className="d-flex flex-column gap-2">
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={editingActivityText}
                            onChange={(e) => setEditingActivityText(e.target.value)}
                          />
                          <div>
                            <Button 
                              variant="success" 
                              size="sm" 
                              className="me-2"
                              onClick={() => handleUpdateActivity(activity.id)}
                            >
                              Save
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => setEditingActivityId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="card-text" style={{ whiteSpace: "pre-wrap" }}>{activity.text}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <ConfirmModal
        show={showActivityDeleteModal}
        onHide={() => {
          setShowActivityDeleteModal(false);
          setActivityToDelete(null);
        }}
        onConfirm={executeDeleteActivity}
        title="Delete Activity"
        message="Are you sure you want to delete this activity? This action cannot be undone."
        confirmText="Delete Activity"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </Container>
  );
};

export default TicketDetail;
