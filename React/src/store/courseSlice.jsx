import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCourse = createAsyncThunk(
  "course/fetchCourse",
  async (courseId) => {
    const response = await axios.get(
      `http://localhost:3001/courses/${courseId}`
    );
    return response.data;
  }
);

export const fetchSlots = createAsyncThunk(
  "course/fetchSlots",
  async (courseId) => {
    const response = await axios.get(
      `http://localhost:3001/slots?courseId=${courseId}`
    );
    return response.data;
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState: {
    course: null,
    slots: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.course = action.payload;
      })
      .addCase(fetchSlots.fulfilled, (state, action) => {
        state.slots = action.payload;
      });
  },
});

export default courseSlice.reducer;
