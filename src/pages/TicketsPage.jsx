import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Row, Col } from "react-bootstrap";
import GenericTable from "../components/common/GenericTable";
import { fetchTicketsListAction } from "../redux/actions/tickets";

const TicketsPage = () => {
  const dispatch = useDispatch();
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [onlyOpen, setOnlyOpen] = useState(false);
  const lastParamsRef = useRef({ page: 0, sortBy: "createdAt", sortDir: "DESC", search: "" });

  const rawTickets = useSelector((state) => state.tickets?.list?.data || []);
  const isLoading = useSelector(
    (state) => state.tickets?.list?.loading || false,
  );
  const error = useSelector((state) => state.tickets?.list?.error || null);
  const totalPages = useSelector(
    (state) => state.tickets?.list?.totalPages || 1,
  );
  const loggedInUser = useSelector((state) => state.auth?.user);

  const formatStatus = (status) => {
    const statusMap = {
      'UNASSIGNED': 'Unassigned',
      'IN_PROGRESS': 'In progress',
      'PENDING_INFO': 'Pending info',
      'RESOLVED': 'Resolved',
      'REJECTED': 'Rejected'
    };
    return statusMap[status] || status;
  };

  // Compute isEditable so GenericTable can allow navigating in edit mode
  const ticketsArray = rawTickets.map((ticket) => {
    let isEditable = false;
    if (loggedInUser) {
      if (loggedInUser.role === "ADMIN") {
        isEditable = true;
      } else if (ticket.user && ticket.user.id === loggedInUser.id) {
        isEditable = true;
      }
    }

    // We also map ticket.user.email to author for display
    let authorEmail = "Anonymous";
    if (ticket.userDeleted) {
      authorEmail = "user deleted";
    } else if (ticket.user) {
      authorEmail = ticket.user.email;
      if (ticket.authorBachelorDescription) {
        authorEmail += ` (${ticket.authorBachelorDescription})`;
      }
    }

    return {
      ...ticket,
      authorEmail: authorEmail,
      isEditable,
      displayStatus: formatStatus(ticket.status),
      displayCategory: ticket.category || "Unknown"
    };
  });

  const handleFetchData = (params) => {
    lastParamsRef.current = params;
    dispatch(fetchTicketsListAction({ ...params, category: filterCategory, status: filterStatus, onlyOpen }));
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setFilterCategory(val);
    dispatch(fetchTicketsListAction({ ...lastParamsRef.current, category: val, status: filterStatus, onlyOpen }));
  };

  const handleStatusChange = (e) => {
    const val = e.target.value;
    setFilterStatus(val);
    dispatch(fetchTicketsListAction({ ...lastParamsRef.current, category: filterCategory, status: val, onlyOpen }));
  };

  const handleOnlyOpenChange = (e) => {
    const val = e.target.checked;
    setOnlyOpen(val);
    let newStatus = filterStatus;
    if (val && (filterStatus === 'RESOLVED' || filterStatus === 'REJECTED')) {
      newStatus = "";
      setFilterStatus("");
    }
    dispatch(fetchTicketsListAction({ ...lastParamsRef.current, category: filterCategory, status: newStatus, onlyOpen: val }));
  };

  const columns = [
    { field: "id", label: "ID" },
    { field: "title", label: "Title" },
    { field: "displayCategory", label: "Category", sortField: "category" },
    { field: "displayStatus", label: "Status", sortField: "status" },
    { field: "authorEmail", label: "Author", sortField: "user.email" },
    { field: "createdAt", label: "Created At", isDate: true },
  ];

  return (
    <div
      className="d-flex flex-column flex-grow-1 w-100"
      style={{ minWidth: 0 }}
    >
      <div className="container mt-4">
        <h2>Tickets Management</h2>
        <p className="text-muted">View and manage support tickets here.</p>
        
        <Row className="align-items-center">
          <Col md={4} sm={6} className="mb-2">
            <Form.Select value={filterCategory} onChange={handleCategoryChange}>
              <option value="">All Categories</option>
              <option value="ERROR">Error</option>
              <option value="SUGGESTION">Suggestion</option>
              <option value="REQUEST">Request</option>
              <option value="DOUBT">Doubt</option>
            </Form.Select>
          </Col>
          <Col md={4} sm={6} className="mb-2">
            <Form.Select value={filterStatus} onChange={handleStatusChange}>
              <option value="">All Statuses</option>
              <option value="UNASSIGNED">Unassigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="PENDING_INFO">Pending Info</option>
              {!onlyOpen && <option value="RESOLVED">Resolved</option>}
              {!onlyOpen && <option value="REJECTED">Rejected</option>}
            </Form.Select>
          </Col>
          <Col md={4} sm={12} className="mb-2">
            <Form.Check 
              type="checkbox"
              id="onlyOpenCheck"
              label="Only open (not resolved or rejected)"
              checked={onlyOpen}
              onChange={handleOnlyOpenChange}
              disabled={filterStatus === 'RESOLVED' || filterStatus === 'REJECTED'}
            />
          </Col>
        </Row>
      </div>

      <GenericTable
        columns={columns}
        data={ticketsArray}
        loading={isLoading}
        error={error}
        totalPages={totalPages}
        onFetchData={handleFetchData}
        detailsUrlPrefix="tickets"
      />
    </div>
  );
};

export default TicketsPage;
