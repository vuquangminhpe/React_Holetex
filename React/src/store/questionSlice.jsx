import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchQuestion = createAsyncThunk(
  "question/fetchQuestion",
  async (questionId) => {
    const response = await axios.get(
      `http://localhost:3001/questions/${questionId}`
    );
    return response.data;
  }
);

export const fetchComments = createAsyncThunk(
  "question/fetchComments",
  async (questionId) => {
    const response = await axios.get(
      `http://localhost:3001/comments?questionId=${questionId}`
    );
    return response.data;
  }
);

export const addComment = createAsyncThunk(
  "question/addComment",
  async ({ questionId, content, userId }) => {
    const response = await axios.post("http://localhost:3001/comments", {
      questionId,
      content,
      userId,
      createdAt: new Date().toISOString(),
      votes: 0,
    });
    return response.data;
  }
);
export const voteComment = createAsyncThunk(
  "question/voteComment",
  async ({ commentId, value }) => {
    const response = await axios.patch(
      `http://localhost:3001/comments/${commentId}`,
      {
        votes: value,
      }
    );
    return response.data;
  }
);

const questionSlice = createSlice({
  name: "question",
  initialState: {
    question: null,
    comments: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestion.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchQuestion.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.question = action.payload;
      })
      .addCase(fetchQuestion.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(voteComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (comment) => comment.id === action.payload.id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      });
  },
});

export default questionSlice.reducer;
