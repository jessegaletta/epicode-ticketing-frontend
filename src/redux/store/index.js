import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../reducers/authReducer";
import settingsReducer from "../reducers/settingsReducer";
import usersReducer from "../reducers/usersReducer";
import ticketsReducer from "../reducers/ticketsReducer";
import bachelorsReducer from "../reducers/bachelorsReducer";
import coursesReducer from "../reducers/coursesReducer";
import activitiesReducer from "../reducers/activitiesReducer";
import { LOGOUT, LOGIN_START } from "../actions/auth";

const appReducer = combineReducers({
  auth: authReducer,
  settings: settingsReducer,
  users: usersReducer,
  tickets: ticketsReducer,
  bachelors: bachelorsReducer,
  courses: coursesReducer,
  activities: activitiesReducer,
});

/* appReducer is wrapped in a rootReducer to reset the ENTIRE Redux state on logout;
   without this, data from the previous user (like "Access Denied" errors) would still
   be visible when a new user logs in */
const rootReducer = (state, action) => {
  if (action.type === LOGOUT || action.type === LOGIN_START) {
    state = undefined;
  }
  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
