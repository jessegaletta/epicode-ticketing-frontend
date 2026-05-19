import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/authReducer";
import settingsReducer from "../reducers/settingsReducer";
import usersReducer from "../reducers/usersReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    users: usersReducer,
  },
});

export default store;
