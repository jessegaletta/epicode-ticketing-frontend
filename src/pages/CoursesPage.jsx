import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import GenericTable from "../components/common/GenericTable";
import { fetchCoursesListAction } from "../redux/actions/courses";

const CoursesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const savedParams = useSelector((state) => state.courses?.list?.params) || {};
  const rawCourses = useSelector((state) => state.courses?.list?.data || []);
  const isLoading = useSelector(
    (state) => state.courses?.list?.loading || false,
  );
  const error = useSelector((state) => state.courses?.list?.error || null);
  const totalPages = useSelector(
    (state) => state.courses?.list?.totalPages || 1,
  );
  const loggedInUser = useSelector((state) => state.auth?.user);
  const token = useSelector((state) => state.auth?.token);

  useEffect(() => {
    if (token && !loggedInUser) {
      return;
    }
    
    if (!loggedInUser || (loggedInUser.role !== "ADMIN" && loggedInUser.role !== "FACULTY")) {
      navigate("/access-denied");
    }
  }, [loggedInUser, token, navigate]);

  const coursesArray = rawCourses.map((course) => {
    let isEditable = false;
    if (loggedInUser && (loggedInUser.role === "ADMIN" || loggedInUser.role === "FACULTY")) {
      isEditable = true;
    }
    const bachelorsStr = course.bachelors && course.bachelors.length > 0
      ? course.bachelors.map(b => b.description).sort().join(" / ")
      : "";
    return {
      ...course,
      isEditable,
      displayDescription: bachelorsStr ? `${course.description} (${bachelorsStr})` : course.description
    };
  });

  const handleFetchData = (params) => {
    dispatch(fetchCoursesListAction(params));
  };

  const columns = [
    { field: "id", label: "ID" },
    { field: "displayDescription", label: "Description", sortField: "description" },
  ];

  return (
    <div
      className="d-flex flex-column flex-grow-1 w-100"
      style={{ minWidth: 0 }}
    >
      <div className="container mt-4">
        <h2>Courses Management</h2>
        <p className="text-muted">View and manage courses here.</p>
      </div>

      <GenericTable
        columns={columns}
        data={coursesArray}
        loading={isLoading}
        error={error}
        totalPages={totalPages}
        onFetchData={handleFetchData}
        detailsUrlPrefix="courses"
        initialState={savedParams}
      />
    </div>
  );
};

export default CoursesPage;
