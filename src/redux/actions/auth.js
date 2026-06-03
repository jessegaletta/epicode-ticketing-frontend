import { fetchProfileAction } from "./profile";

export const LOGIN_START = "LOGIN_START";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_ERROR = "LOGIN_ERROR";
export const LOGOUT = "LOGOUT";
export const CLEAR_AUTH_MESSAGES = "CLEAR_AUTH_MESSAGES";
export const REGISTER_START = "REGISTER_START";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_ERROR = "REGISTER_ERROR";

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

        if (token) {
          // the token is saved in localStorage so the user doesn't get logged out on page refresh
          localStorage.setItem("token", token);
          dispatch({
            type: LOGIN_SUCCESS,
            payload: token,
          });
          dispatch(fetchProfileAction(token));
        } else {
          throw new Error("Error getting token from response");
        }
      } else {
        let errorMsg = "Login error";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          // the response body is not JSON, so the default error message is kept
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

export const logoutAction = (navigate, isSessionExpired = false) => {
  return (dispatch) => {
    // remove the token from localStorage so the user is fully logged out
    localStorage.removeItem("token");
    dispatch({ type: LOGOUT });
    const targetPath = isSessionExpired ? "/session-expired" : "/login";
    if (navigate) {
      navigate(targetPath);
    } else {
      /* navigate() is only available inside React components; when logout is called from outside
         (e.g. from another action), window.location is used as a fallback */
      window.location.href = targetPath;
    }
  };
};

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
          // the response body is not JSON, so the default error message is kept
        }
        dispatch({ type: REGISTER_ERROR, payload: errorMsg });
      }
    } catch (err) {
      dispatch({ type: REGISTER_ERROR, payload: "An error occurred during registration." });
    }
  };
};
