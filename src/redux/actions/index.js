export const LOGIN_START = "LOGIN_START";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_ERROR = "LOGIN_ERROR";
export const LOGOUT = "LOGOUT";
export const SET_USER = "SET_USER";
export const SET_SETTINGS = "SET_SETTINGS";

export const CLEAR_AUTH_MESSAGES = "CLEAR_AUTH_MESSAGES";

export const REGISTER_START = "REGISTER_START";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_ERROR = "REGISTER_ERROR";

export const UPDATE_PROFILE_START = "UPDATE_PROFILE_START";
export const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_ERROR = "UPDATE_PROFILE_ERROR";

export const DELETE_ACCOUNT_START = "DELETE_ACCOUNT_START";
export const DELETE_ACCOUNT_ERROR = "DELETE_ACCOUNT_ERROR";

export const FETCH_USERS_LIST_START = "FETCH_USERS_LIST_START";
export const FETCH_USERS_LIST_SUCCESS = "FETCH_USERS_LIST_SUCCESS";
export const FETCH_USERS_LIST_ERROR = "FETCH_USERS_LIST_ERROR";

export const FETCH_USER_DETAIL_START = "FETCH_USER_DETAIL_START";
export const FETCH_USER_DETAIL_SUCCESS = "FETCH_USER_DETAIL_SUCCESS";
export const FETCH_USER_DETAIL_ERROR = "FETCH_USER_DETAIL_ERROR";

export const loginAction = (credentials) => {
  return async (dispatch) => {
    dispatch({ type: LOGIN_START });
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.accessToken;

        console.log("accessToken: " + token); // TODO: remove after testing
        
        if (token) {
          localStorage.setItem("token", token);
          dispatch({
            type: LOGIN_SUCCESS,
            payload: token,
          });

          // Fetch user profile and settings
          dispatch(fetchProfileAction(token));

        } else {
            throw new Error("Error getting token from response");
        }

      } else {
        // Trying to extract error message if present in the JSON
        let errorMsg = "Login error";
        try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
        } catch(e) {
            // Ignore if response is not JSON
        }
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.log("Login error:", error);
      dispatch({
        type: LOGIN_ERROR,
        payload: error.message,
      });
    }
  };
};

export const logoutAction = (navigate) => {
    return (dispatch) => {
        localStorage.removeItem("token");
        dispatch({ type: LOGOUT });
        if (navigate) {
            navigate("/login");
        } else {
            window.location.href = "/login";
        }
    }
}

export const fetchProfileAction = (token) => {
  return async (dispatch) => {
    try {
      const meResponse = await fetch("http://localhost:3001/users/me", {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      
      if (meResponse.ok) {
        const userData = await meResponse.json();
        
        // Dispatch user details
        dispatch({
          type: SET_USER,
          payload: {
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            avatarURL: userData.avatarURL,
            role: userData.role
          }
        });

        // Dispatch settings
        dispatch({
          type: SET_SETTINGS,
          payload: {
            darkMode: userData.darkMode,
            timezone: userData.timezone,
            dateFormat: userData.dateFormat,
            timeFormat: userData.timeFormat
          }
        });
      } else {
          console.log("Failed to fetch user profile");
          // If token is invalid/expired, we might want to logout
          if(meResponse.status === 401) {
             dispatch(logoutAction());
          }
      }
    } catch(err) {
       console.log("Error fetching profile", err);
    }
  }
}

export const registerAction = (formValues) => {
  return async (dispatch) => {
    dispatch({ type: REGISTER_START });
    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        dispatch({
          type: REGISTER_SUCCESS,
          payload: "Registration successful! Redirecting to login...",
        });
      } else {
        let errorMsg = "Registration failed";
        try {
          const errorData = await response.json();
          if (errorData.errors && errorData.errors.length > 0) {
             errorMsg = errorData.errors.join(", ");
          } else {
             errorMsg = errorData.message || errorMsg;
          }
        } catch (e) {
          // ignore
        }
        dispatch({ type: REGISTER_ERROR, payload: errorMsg });
      }
    } catch (err) {
      dispatch({ type: REGISTER_ERROR, payload: "An error occurred during registration." });
    }
  };
};

export const updateProfileAction = (submitValues, avatarFile, token) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_PROFILE_START });
    try {
      const response = await fetch("http://localhost:3001/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(submitValues),
      });

      if (!response.ok) {
        let errorMsg = "Failed to update profile";
        try {
          const errorData = await response.json();
          if (errorData.errors && errorData.errors.length > 0) {
            errorMsg = errorData.errors.join(", ");
          } else {
            errorMsg = errorData.message || errorMsg;
          }
        } catch (e) {
          // ignore
        }
        throw new Error(errorMsg);
      }

      let userData = await response.json();

      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const avatarResponse = await fetch("http://localhost:3001/users/me/avatar", {
          method: "PATCH",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: formData,
        });

        if (!avatarResponse.ok) {
          throw new Error("Failed to upload avatar");
        }
        userData = await avatarResponse.json();
      }

      // Dispatch user details
      dispatch({
        type: SET_USER,
        payload: {
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          avatarURL: userData.avatarURL,
          role: userData.role,
        },
      });

      // Dispatch settings
      dispatch({
        type: SET_SETTINGS,
        payload: {
          darkMode: userData.darkMode,
          timezone: userData.timezone,
          dateFormat: userData.dateFormat,
          timeFormat: userData.timeFormat,
        },
      });

      dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: "Profile updated successfully!" });
    } catch (err) {
      dispatch({ type: UPDATE_PROFILE_ERROR, payload: err.message || "An error occurred while updating profile." });
    }
  };
};

export const deleteAccountAction = (token, navigate) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_ACCOUNT_START });
    try {
      const response = await fetch("http://localhost:3001/users/me", {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        dispatch(logoutAction(navigate));
      } else {
        dispatch({ type: DELETE_ACCOUNT_ERROR, payload: "Failed to delete account" });
      }
    } catch (err) {
      dispatch({ type: DELETE_ACCOUNT_ERROR, payload: "An error occurred while deleting account." });
    }
  };
};

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
          dispatch(logoutAction());
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
          dispatch(logoutAction());
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
      
      if(response.ok || response.status === 201) {
        alert(isEditing ? "User updated" : "User created");
        navigate("/users");
      } else {
        const err = await response.json();
        alert(err.message || "Error during save");
      }
    } catch (e) {
      alert("Network error or server unreachable");
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
