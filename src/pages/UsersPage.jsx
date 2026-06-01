import React from "react";
import { useSelector, useDispatch } from "react-redux";
import GenericTable from "../components/common/GenericTable";
import { fetchUsersListAction } from "../redux/actions";

const UsersPage = () => {
  const dispatch = useDispatch();

  // Select data from the store (usersReducer)
  const savedParams = useSelector((state) => state.users?.list?.params) || {};
  const usersArray = useSelector((state) => state.users?.list?.data || []);
  const isLoading = useSelector((state) => state.users?.list?.loading || false);
  const error = useSelector((state) => state.users?.list?.error || null);
  const totalPages = useSelector((state) => state.users?.list?.totalPages || 1);

  // The callback function that the table will use to request data
  const handleFetchData = (params) => {
    dispatch(fetchUsersListAction(params));
  };

  // Define the table columns
  const columns = [
    { field: "firstName", label: "First Name" },
    { field: "lastName", label: "Last Name" },
    { field: "email", label: "Email" },
    { field: "role", label: "Role" },
  ];

  return (
    <div className="d-flex flex-column flex-grow-1 w-100" style={{ minWidth: 0 }}>
      <div className="container mt-4">
        <h2>Users Management</h2>
        <p className="text-muted">Manage your users here.</p>
      </div>

      <GenericTable
        columns={columns}
        data={usersArray}
        loading={isLoading}
        error={error}
        totalPages={totalPages}
        onFetchData={handleFetchData}
        detailsUrlPrefix="users"
        initialState={savedParams}
      />
    </div>
  );
};

export default UsersPage;
