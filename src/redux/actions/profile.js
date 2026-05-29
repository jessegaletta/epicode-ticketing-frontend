import { logoutAction } from "./auth";

export const SET_USER = "SET_USER";
export const SET_SETTINGS = "SET_SETTINGS";
export const UPDATE_PROFILE_START = "UPDATE_PROFILE_START";
export const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_ERROR = "UPDATE_PROFILE_ERROR";
export const DELETE_ACCOUNT_START = "DELETE_ACCOUNT_START";
export const DELETE_ACCOUNT_ERROR = "DELETE_ACCOUNT_ERROR";

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
        let errMessage = "Failed to delete account";
        try {
          const err = await response.json();
          errMessage = err.message || errMessage;
        } catch (e) {}
        dispatch({ type: DELETE_ACCOUNT_ERROR, payload: errMessage });
      }
    } catch (err) {
      dispatch({ type: DELETE_ACCOUNT_ERROR, payload: err.message || "An error occurred while deleting account." });
    }
  };
};
