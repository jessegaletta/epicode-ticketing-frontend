import { SET_SETTINGS } from "../actions";

const initialState = {
  darkMode: false,
  timezone: "Europe/Rome",
  emailNotifications: false,
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
