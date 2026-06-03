import { 
  LOGIN_START, LOGIN_SUCCESS, LOGIN_ERROR, LOGOUT, SET_USER,
  CLEAR_AUTH_MESSAGES,
  REGISTER_START, REGISTER_SUCCESS, REGISTER_ERROR,
  UPDATE_PROFILE_START, UPDATE_PROFILE_SUCCESS, UPDATE_PROFILE_ERROR,
  DELETE_ACCOUNT_START, DELETE_ACCOUNT_ERROR
} from "../actions";

/* the token is read from localStorage on startup so the user stays logged in after a page refresh;
   !! converts the string to a boolean: truthy string → true, null → false */
const initialState = {
  isLoggedIn: !!localStorage.getItem("token"),
  token: localStorage.getItem("token") || null,
  user: null,
  loading: false,
  error: null,
  successMessage: null,
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
        user: null,
        loading: false,
        error: null,
        successMessage: null,
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case CLEAR_AUTH_MESSAGES:
      return {
        ...state,
        error: null,
        successMessage: null,
      };
    // these three actions all put the app in "loading" state, so they share the same return
    case REGISTER_START:
    case UPDATE_PROFILE_START:
    case DELETE_ACCOUNT_START:
      return {
        ...state,
        loading: true,
        error: null,
        successMessage: null,
      };
    // same here: both success cases show a success message, so they share the same return
    case REGISTER_SUCCESS:
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        successMessage: action.payload,
        error: null,
      };
    // and the same for errors
    case REGISTER_ERROR:
    case UPDATE_PROFILE_ERROR:
    case DELETE_ACCOUNT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        successMessage: null,
      };
    default:
      return state;
  }
};

export default authReducer;
