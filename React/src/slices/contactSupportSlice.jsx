import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/http";

export const addContactSupport = createAsyncThunk(
  "contactSupport/add",
  async (supportData, { rejectWithValue }) => {
    try {
      const response = await http.post("/contactSupport", supportData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const contactSupportSlice = createSlice({
  name: "contactSupport",
  initialState: {
    submissions: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addContactSupport.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.submissions.push(action.payload);
    });
  },
});

export default contactSupportSlice.reducer;
