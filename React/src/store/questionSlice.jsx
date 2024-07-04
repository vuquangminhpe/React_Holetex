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
export const fetchSlot = createAsyncThunk(
  "question/fetchSlot",
  async (questionId) => {
    console.log("Fetching slot for questionId:", questionId);
    const response = await axios.get(`http://localhost:3001/slots`);
    const slots = response.data;
    console.log("All slots:", slots);
    const slot = slots.find((slot) =>
      slot.questions.some((question) => question.id === questionId)
    );
    console.log("Found slot:", slot);
    return slot;
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
  async ({ questionId, content, userId, parentId = null }) => {
    const response = await axios.post("http://localhost:3001/comments", {
      questionId,
      content,
      userId,
      parentId,
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
export const fetchUsers = createAsyncThunk("question/fetchUsers", async () => {
  const response = await axios.get("http://localhost:3001/users");
  return response.data;
});
const questionSlice = createSlice({
  name: "question",
  initialState: {
    question: null,
    comments: [],
    users: [],
    currentSlot: null,
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
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchSlot.fulfilled, (state, action) => {
        console.log("Reducer: Setting currentSlot to", action.payload);
        state.currentSlot = action.payload;
      });
  },
});

export default questionSlice.reducer;
