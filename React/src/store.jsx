import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import courseSlice from "./store/courseSlice";
import questionSlice from "./store/questionSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    course: courseSlice,
    question: questionSlice,
  },
});
