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

const rootReducer = (state, action) => {
  if (action.type === LOGOUT || action.type === LOGIN_START) {
    // Clear all state on logout or when a new login starts to avoid stale errors like "Access Denied"
    state = undefined;
  }
  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
