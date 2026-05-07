export const LOGIN_START = "LOGIN_START";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_ERROR = "LOGIN_ERROR";
export const LOGOUT = "LOGOUT";
export const SET_USER = "SET_USER";
export const SET_SETTINGS = "SET_SETTINGS";

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
          const meResponse = await fetch("http://localhost:3001/users/me", {
            headers: {
              Authorization: `Bearer ${token}`
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
                emailNotifications: userData.emailNotifications
              }
            });
          } else {
             console.log("Failed to fetch user profile");
          }

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

export const logoutAction = () => {
    return (dispatch) => {
        localStorage.removeItem("token");
        dispatch({ type: LOGOUT });
    }
}
