import React from "react";
import { useSelector, useDispatch } from "react-redux";
import GenericTable from "../components/common/GenericTable";
import { fetchBachelorsListAction } from "../redux/actions/bachelors";

const BachelorsPage = () => {
  const dispatch = useDispatch();

  const rawBachelors = useSelector((state) => state.bachelors?.list?.data || []);
  const isLoading = useSelector(
    (state) => state.bachelors?.list?.loading || false,
  );
  const error = useSelector((state) => state.bachelors?.list?.error || null);
  const totalPages = useSelector(
    (state) => state.bachelors?.list?.totalPages || 1,
  );
  const loggedInUser = useSelector((state) => state.auth?.user);

  // Compute isEditable so GenericTable can allow navigating in edit mode
  const bachelorsArray = rawBachelors.map((bachelor) => {
    let isEditable = false;
    if (loggedInUser && (loggedInUser.role === "ADMIN" || loggedInUser.role === "FACULTY")) {
      isEditable = true;
    }
    return {
      ...bachelor,
      isEditable,
    };
  });

  const handleFetchData = (params) => {
    dispatch(fetchBachelorsListAction(params));
  };

  const columns = [
    { field: "id", label: "ID" },
    { field: "description", label: "Description" },
  ];

  return (
    <div
      className="d-flex flex-column flex-grow-1 w-100"
      style={{ minWidth: 0 }}
    >
      <div className="container mt-4">
        <h2>Bachelors Management</h2>
        <p className="text-muted">View and manage bachelors here.</p>
      </div>

      <GenericTable
        columns={columns}
        data={bachelorsArray}
        loading={isLoading}
        error={error}
        totalPages={totalPages}
        onFetchData={handleFetchData}
        detailsUrlPrefix="bachelors"
      />
    </div>
  );
};

export default BachelorsPage;
