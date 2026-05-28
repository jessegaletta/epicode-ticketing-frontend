import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/authReducer";
import settingsReducer from "../reducers/settingsReducer";
import usersReducer from "../reducers/usersReducer";
import ticketsReducer from "../reducers/ticketsReducer";
import bachelorsReducer from "../reducers/bachelorsReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    users: usersReducer,
    tickets: ticketsReducer,
    bachelors: bachelorsReducer,
  },
});

export default store;
