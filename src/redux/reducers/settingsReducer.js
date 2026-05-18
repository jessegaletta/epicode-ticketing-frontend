import { SET_SETTINGS, LOGOUT } from "../actions";

const initialState = {
  darkMode: true,
  timezone: "Europe/Belgrade",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "24h",
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SETTINGS:
      return {
        ...state,
        ...action.payload,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default settingsReducer;
