import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    courses: [],
    assignments: [],
    users: [],
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    setAssignments: (state, action) => {
      state.assignments = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { setUser, setCourses, setAssignments, setUsers } =
  userSlice.actions;

export default userSlice.reducer;
