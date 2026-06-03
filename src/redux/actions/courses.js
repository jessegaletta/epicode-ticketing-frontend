import { logoutAction } from "./auth";

export const FETCH_COURSES_LIST_START = "FETCH_COURSES_LIST_START";
export const FETCH_COURSES_LIST_SUCCESS = "FETCH_COURSES_LIST_SUCCESS";
export const FETCH_COURSES_LIST_ERROR = "FETCH_COURSES_LIST_ERROR";

export const FETCH_ALL_COURSES_START = "FETCH_ALL_COURSES_START";
export const FETCH_ALL_COURSES_SUCCESS = "FETCH_ALL_COURSES_SUCCESS";
export const FETCH_ALL_COURSES_ERROR = "FETCH_ALL_COURSES_ERROR";

export const FETCH_COURSE_DETAIL_START = "FETCH_COURSE_DETAIL_START";
export const FETCH_COURSE_DETAIL_SUCCESS = "FETCH_COURSE_DETAIL_SUCCESS";
export const FETCH_COURSE_DETAIL_ERROR = "FETCH_COURSE_DETAIL_ERROR";
export const CLEAR_COURSE_DETAIL = "CLEAR_COURSE_DETAIL";

export const clearCourseDetailAction = () => ({
  type: CLEAR_COURSE_DETAIL,
});

export const fetchCoursesListAction = (params = {}) => {
  const { page = 0, sortBy = "id", sortDir = "ASC", search = "" } = params;
  return async (dispatch) => {
    dispatch({ type: FETCH_COURSES_LIST_START, params });
    try {
      const token = localStorage.getItem("token");
      let url = `http://localhost:3001/courses?page=${page}&sortBy=${sortBy}&sortDir=${sortDir}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: FETCH_COURSES_LIST_SUCCESS,
          payload: data,
        });
      } else {
        if (response.status === 401) {
          dispatch(logoutAction(null, true));
        }
        throw new Error(response.status === 403 ? "Access Denied" : "Failed to fetch courses");
      }
    } catch (error) {
      dispatch({
        type: FETCH_COURSES_LIST_ERROR,
        payload: error.message,
      });
    }
  };
};

export const fetchAllCoursesAction = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_ALL_COURSES_START });
    try {
      const token = localStorage.getItem("token");

      const url = `http://localhost:3001/courses/all`;

      const response = await fetch(url, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: FETCH_ALL_COURSES_SUCCESS,
          payload: data,
        });
      } else {
        if (response.status === 401) {
          dispatch(logoutAction(null, true));
        }
        throw new Error(response.status === 403 ? "Access Denied" : "Failed to fetch courses");
      }
    } catch (error) {
      dispatch({
        type: FETCH_ALL_COURSES_ERROR,
        payload: error.message,
      });
    }
  };
};

export const fetchCourseDetailAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_COURSE_DETAIL_START });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/courses/${id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: FETCH_COURSE_DETAIL_SUCCESS,
          payload: data,
        });
      } else {
        if (response.status === 401) {
          dispatch(logoutAction(null, true));
        }
        throw new Error(response.status === 403 ? "Access Denied" : "Failed to fetch course details");
      }
    } catch (error) {
      dispatch({
        type: FETCH_COURSE_DETAIL_ERROR,
        payload: error.message,
      });
    }
  };
};

export const saveCourseAction = (id, courseData, isEditing) => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `http://localhost:3001/courses/${id}` : `http://localhost:3001/courses`;
    
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify(courseData)
    });
    
    if(response.ok || response.status === 201) {
      dispatch(fetchCoursesListAction());
    } else {
      let errMessage = "Error during save";
      try {
        const err = await response.json();
        if (err.message) errMessage = err.message;
        else if (err.errorsList) errMessage = err.errorsList.join(", ");
      } catch (e) {
        // the response body is not JSON, so the default error message is kept
      }
      throw new Error(errMessage);
    }
  };
};

export const deleteCourseAction = (id) => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3001/courses/${id}`, {
      method: "DELETE",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
    if (!response.ok) {
      let errMessage = "Error during deletion";
      try {
        const err = await response.json();
        errMessage = err.message || errMessage;
      } catch (e) {
        // the response body is not JSON, so the default error message is kept
      }
      throw new Error(errMessage);
    }
    dispatch(fetchCoursesListAction());
  };
};
