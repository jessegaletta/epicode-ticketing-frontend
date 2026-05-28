import React from "react";
import { useSelector, useDispatch } from "react-redux";
import GenericTable from "../components/common/GenericTable";
import { fetchTicketsListAction } from "../redux/actions/tickets";

const TicketsPage = () => {
  const dispatch = useDispatch();

  const rawTickets = useSelector((state) => state.tickets?.list?.data || []);
  const isLoading = useSelector(
    (state) => state.tickets?.list?.loading || false,
  );
  const error = useSelector((state) => state.tickets?.list?.error || null);
  const totalPages = useSelector(
    (state) => state.tickets?.list?.totalPages || 1,
  );
  const loggedInUser = useSelector((state) => state.auth?.user);

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
    };
  });

  const handleFetchData = (params) => {
    dispatch(fetchTicketsListAction(params));
  };

  const columns = [
    { field: "id", label: "ID" },
    { field: "title", label: "Title" },
    { field: "status", label: "Status" },
    { field: "authorEmail", label: "Author" },
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
