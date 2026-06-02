import { logoutAction } from "./auth";

export const FETCH_BACHELORS_LIST_START = "FETCH_BACHELORS_LIST_START";
export const FETCH_BACHELORS_LIST_SUCCESS = "FETCH_BACHELORS_LIST_SUCCESS";
export const FETCH_BACHELORS_LIST_ERROR = "FETCH_BACHELORS_LIST_ERROR";

export const FETCH_BACHELOR_DETAIL_START = "FETCH_BACHELOR_DETAIL_START";
export const FETCH_BACHELOR_DETAIL_SUCCESS = "FETCH_BACHELOR_DETAIL_SUCCESS";
export const FETCH_BACHELOR_DETAIL_ERROR = "FETCH_BACHELOR_DETAIL_ERROR";
export const CLEAR_BACHELOR_DETAIL = "CLEAR_BACHELOR_DETAIL";

export const clearBachelorDetailAction = () => ({
  type: CLEAR_BACHELOR_DETAIL,
});

export const fetchBachelorsListAction = (params = {}) => {
  const { page = 0, sortBy = "id", sortDir = "ASC", search = "" } = params;
  return async (dispatch) => {
    dispatch({ type: FETCH_BACHELORS_LIST_START, params });
    try {
      // Endpoint is public, so no token needed for GET, but I'll include if available
      const token = localStorage.getItem("token");
      let url = `http://localhost:3001/bachelors?page=${page}&sortBy=${sortBy}&sortDir=${sortDir}`;
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
          type: FETCH_BACHELORS_LIST_SUCCESS,
          payload: data,
        });
      } else {
        if (response.status === 401) {
          dispatch(logoutAction(null, true));
        }
        throw new Error(response.status === 403 ? "Access Denied" : "Failed to fetch bachelors");
      }
    } catch (error) {
      dispatch({
        type: FETCH_BACHELORS_LIST_ERROR,
        payload: error.message,
      });
    }
  };
};

export const fetchBachelorDetailAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_BACHELOR_DETAIL_START });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/bachelors/${id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: FETCH_BACHELOR_DETAIL_SUCCESS,
          payload: data,
        });
      } else {
        if (response.status === 401) {
          dispatch(logoutAction(null, true));
        }
        throw new Error(response.status === 403 ? "Access Denied" : "Failed to fetch bachelor details");
      }
    } catch (error) {
      dispatch({
        type: FETCH_BACHELOR_DETAIL_ERROR,
        payload: error.message,
      });
    }
  };
};

export const saveBachelorAction = (id, bachelorData, isEditing) => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `http://localhost:3001/bachelors/${id}` : `http://localhost:3001/bachelors`;
    
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify(bachelorData)
    });
    
    if(response.ok || response.status === 201) {
      dispatch(fetchBachelorsListAction());
    } else {
      let errMessage = "Error during save";
      try {
        const err = await response.json();
        if (err.message) errMessage = err.message;
        else if (err.errorsList) errMessage = err.errorsList.join(", ");
      } catch (e) {}
      throw new Error(errMessage);
    }
  };
};

export const deleteBachelorAction = (id) => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3001/bachelors/${id}`, {
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
      } catch (e) {}
      throw new Error(errMessage);
    }
    dispatch(fetchBachelorsListAction());
  };
};
