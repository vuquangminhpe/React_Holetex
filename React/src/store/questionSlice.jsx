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
    const response = await axios.get(`http://localhost:3001/slots`);
    const slots = response.data;
    const slot = slots.find((slot) =>
      slot.questions.some((question) => question.id === questionId)
    );
    return slot;
  }
);

export const fetchComments = createAsyncThunk(
  "question/fetchComments",
  async (questionId) => {
    const response = await axios.get(
      `http://localhost:3001/comments?questionId=${questionId}&_sort=createdAt&_order=desc`
    );
    const comments = response.data;

    const mainComments = comments.filter((c) => !c.parentId);
    const replies = comments.filter((c) => c.parentId);

    mainComments.forEach((comment) => {
      comment.replies = replies.filter((r) => r.parentId === comment.id);
    });

    return mainComments;
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

export const fetchGroupMembers = createAsyncThunk(
  "question/fetchGroupMembers",
  async (groupId) => {
    const response = await axios.get(`http://localhost:3001/groups/${groupId}`);
    const group = response.data;
    const userPromises = group.members.map((userId) =>
      axios.get(`http://localhost:3001/users/${userId}`)
    );
    const userResponses = await Promise.all(userPromises);
    const users = userResponses.map((response) => response.data);
    return { ...group, members: users };
  }
);

const questionSlice = createSlice({
  name: "question",
  initialState: {
    question: null,
    comments: [],
    users: [],
    currentSlot: null,
    currentGroup: null,
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
        state.comments = action.payload.map((comment) => ({
          ...comment,
          user: state.users.find((user) => user.id === comment.userId),
        }));
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const newComment = {
          ...action.payload,
          user: state.users.find((user) => user.id === action.payload.userId),
        };
        if (newComment.parentId) {
          const parentComment = state.comments.find(
            (c) => c.id === newComment.parentId
          );
          if (parentComment) {
            if (!parentComment.replies) parentComment.replies = [];
            parentComment.replies.push(newComment);
          }
        } else {
          state.comments.unshift(newComment);
        }
      })
      .addCase(voteComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const commentIndex = state.comments.findIndex(
          (c) => c.id === updatedComment.id
        );
        if (commentIndex !== -1) {
          state.comments[commentIndex] = updatedComment;
        } else {
          state.comments.forEach((comment) => {
            if (comment.replies) {
              const replyIndex = comment.replies.findIndex(
                (r) => r.id === updatedComment.id
              );
              if (replyIndex !== -1) {
                comment.replies[replyIndex] = updatedComment;
              }
            }
          });
        }
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchSlot.fulfilled, (state, action) => {
        state.currentSlot = action.payload;
      })
      .addCase(fetchGroupMembers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGroupMembers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentGroup = action.payload;
      })
      .addCase(fetchGroupMembers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default questionSlice.reducer;
