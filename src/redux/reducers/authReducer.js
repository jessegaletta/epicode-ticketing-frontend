import { 
  LOGIN_START, LOGIN_SUCCESS, LOGIN_ERROR, LOGOUT, SET_USER,
  CLEAR_AUTH_MESSAGES,
  REGISTER_START, REGISTER_SUCCESS, REGISTER_ERROR,
  UPDATE_PROFILE_START, UPDATE_PROFILE_SUCCESS, UPDATE_PROFILE_ERROR,
  DELETE_ACCOUNT_START, DELETE_ACCOUNT_ERROR
} from "../actions";

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
    case REGISTER_START:
    case UPDATE_PROFILE_START:
    case DELETE_ACCOUNT_START:
      return {
        ...state,
        loading: true,
        error: null,
        successMessage: null,
      };
    case REGISTER_SUCCESS:
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        successMessage: action.payload,
        error: null,
      };
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
