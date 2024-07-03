import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import courseSlice from "./store/courseSlice";
import questionSlice from "./store/questionSlice";
import assignmentSlice from "./slices/assignmentSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    assignment: assignmentSlice,
    course: courseSlice,
    question: questionSlice,
  },
});
