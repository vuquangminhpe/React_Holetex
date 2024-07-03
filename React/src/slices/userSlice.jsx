import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    courses: [],
    assignments: [], // Ensure assignments state is initialized
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    setAssignments: (state, action) => {
      state.assignments = action.payload; // Ensure that this reducer updates assignments correctly
    },
  },
});

export const { setUser, setCourses, setAssignments } = userSlice.actions;

export default userSlice.reducer;
