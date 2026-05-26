import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/authReducer";
import settingsReducer from "../reducers/settingsReducer";
import usersReducer from "../reducers/usersReducer";
import ticketsReducer from "../reducers/ticketsReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    users: usersReducer,
    tickets: ticketsReducer,
  },
});

export default store;
