import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/authReducer";
import settingsReducer from "../reducers/settingsReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
  },
});

export default store;
