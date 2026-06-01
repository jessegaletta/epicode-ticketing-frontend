import { logoutAction } from "./auth";

export const FETCH_USERS_LIST_START = "FETCH_USERS_LIST_START";
export const FETCH_USERS_LIST_SUCCESS = "FETCH_USERS_LIST_SUCCESS";
export const FETCH_USERS_LIST_ERROR = "FETCH_USERS_LIST_ERROR";

export const FETCH_USER_DETAIL_START = "FETCH_USER_DETAIL_START";
export const FETCH_USER_DETAIL_SUCCESS = "FETCH_USER_DETAIL_SUCCESS";
export const FETCH_USER_DETAIL_ERROR = "FETCH_USER_DETAIL_ERROR";

export const fetchUsersListAction = ({ page = 0, search = "", sortBy = "id", sortDir = "ASC" }) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_USERS_LIST_START });
    try {
      const token = localStorage.getItem("token");
      let url = `http://localhost:3001/users?page=${page}&sortBy=${sortBy}&sortDir=${sortDir}`;
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
          type: FETCH_USERS_LIST_SUCCESS,
          payload: data,
        });
      } else {
        if (response.status === 401) {
          dispatch(logoutAction(null, true));
        }
        throw new Error(response.status === 403 ? "Access Denied" : "Failed to fetch users");
      }
    } catch (error) {
      dispatch({
        type: FETCH_USERS_LIST_ERROR,
        payload: error.message,
      });
    }
  };
};

export const fetchUserDetailAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_USER_DETAIL_START });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/users/${id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: FETCH_USER_DETAIL_SUCCESS,
          payload: data,
        });
      } else {
        if (response.status === 401) {
          dispatch(logoutAction(null, true));
        }
        throw new Error(response.status === 403 ? "Access Denied" : "Failed to fetch user details");
      }
    } catch (error) {
      dispatch({
        type: FETCH_USER_DETAIL_ERROR,
        payload: error.message,
      });
    }
  };
};

export const saveUserAction = (id, userData, isEditing, navigate) => {
  return async () => {
    try {
      const token = localStorage.getItem("token");
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `http://localhost:3001/users/${id}` : `http://localhost:3001/users`;
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(userData)
      });
      
      if (response.ok || response.status === 201) {
        navigate("/users");
      } else {
        const err = await response.json();
        throw new Error(err.message || "Error during save");
      }
    } catch (e) {
      throw new Error(e.message || "Network error or server unreachable");
    }
  }
};

export const deleteUserAction = (id) => {
  return async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3001/users/${id}`, {
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
  };
};
