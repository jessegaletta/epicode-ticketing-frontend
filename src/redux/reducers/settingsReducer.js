import { SET_SETTINGS } from "../actions";

const initialState = {
  darkMode: true,
  timezone: "Europe/Amsterdam",
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
    default:
      return state;
  }
};

export default settingsReducer;
