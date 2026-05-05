import { LOGIN_START, LOGIN_SUCCESS, LOGIN_ERROR, LOGOUT } from "../actions";

const initialState = {
  isLoggedIn: !!localStorage.getItem("token"),
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload,
        loading: false,
        error: null,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        token: null,
      };
    default:
      return state;
  }
};

export default authReducer;
