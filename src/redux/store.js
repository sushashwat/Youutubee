import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

/**
 * Redux store
 * ------------
 * Currently holds only auth state. Other slices (e.g. search) can be
 * added here later if a page needs to share that state globally.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})