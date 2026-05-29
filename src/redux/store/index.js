import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/authReducer";
import settingsReducer from "../reducers/settingsReducer";
import usersReducer from "../reducers/usersReducer";
import ticketsReducer from "../reducers/ticketsReducer";
import bachelorsReducer from "../reducers/bachelorsReducer";
import coursesReducer from "../reducers/coursesReducer";
const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    users: usersReducer,
    tickets: ticketsReducer,
    bachelors: bachelorsReducer,
    courses: coursesReducer,
  },
});

export default store;
