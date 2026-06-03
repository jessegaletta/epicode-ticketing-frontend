export const FETCH_ACTIVITIES_START = "FETCH_ACTIVITIES_START";
export const FETCH_ACTIVITIES_SUCCESS = "FETCH_ACTIVITIES_SUCCESS";
export const FETCH_ACTIVITIES_ERROR = "FETCH_ACTIVITIES_ERROR";
export const CREATE_ACTIVITY_SUCCESS = "CREATE_ACTIVITY_SUCCESS";
export const UPDATE_ACTIVITY_SUCCESS = "UPDATE_ACTIVITY_SUCCESS";
export const DELETE_ACTIVITY_SUCCESS = "DELETE_ACTIVITY_SUCCESS";
export const CLEAR_ACTIVITIES = "CLEAR_ACTIVITIES";

const BASE_URL = "http://localhost:3001";

/* helper function to avoid repeating the same header logic in every action;
   isJson = true adds the Content-Type header needed for POST/PUT requests with a JSON body */
const getHeaders = (token, isJson = false) => {
  const headers = {};
  if (isJson) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const fetchActivitiesAction = (ticketId) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_ACTIVITIES_START });
    try {
      const token = localStorage.getItem("token");
      const headers = getHeaders(token, false);
      
      const response = await fetch(`${BASE_URL}/tickets/${ticketId}/activities`, {
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }
      const data = await response.json();
      dispatch({
        type: FETCH_ACTIVITIES_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_ACTIVITIES_ERROR,
        payload: error.message,
      });
    }
  };
};

export const createActivityAction = (ticketId, payload) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const headers = getHeaders(token, true);
      
      const response = await fetch(`${BASE_URL}/tickets/${ticketId}/activities`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create activity");
      }
      
      const data = await response.json();
      dispatch({
        type: CREATE_ACTIVITY_SUCCESS,
        payload: data,
      });
      // the data is returned so the component can use it if needed after awaiting the dispatch
      return data;
    } catch (error) {
      // re-thrown so the component that called dispatch() can catch it and show an error message
      throw error;
    }
  };
};

export const updateActivityAction = (activityId, payload) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const headers = getHeaders(token, true);
      
      const response = await fetch(`${BASE_URL}/activities/${activityId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update activity");
      }
      
      const data = await response.json();
      dispatch({
        type: UPDATE_ACTIVITY_SUCCESS,
        payload: data,
      });
      return data;
    } catch (error) {
      throw error;
    }
  };
};

export const deleteActivityAction = (activityId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const headers = getHeaders(token, false);
      
      const response = await fetch(`${BASE_URL}/activities/${activityId}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete activity");
      }
      
      dispatch({
        type: DELETE_ACTIVITY_SUCCESS,
        payload: activityId,
      });
    } catch (error) {
      throw error;
    }
  };
};

export const clearActivitiesAction = () => ({
  type: CLEAR_ACTIVITIES,
});
