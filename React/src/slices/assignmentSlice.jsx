import { createSlice } from "@reduxjs/toolkit";

const assignmentSlice = createSlice({
  name: "assignment",
  initialState: {
    currentAssignment: null,
  },
  reducers: {
    setCurrentAssignment: (state, action) => {
      state.currentAssignment = action.payload;
    },
  },
});

export const { setCurrentAssignment } = assignmentSlice.actions;

export default assignmentSlice.reducer;
