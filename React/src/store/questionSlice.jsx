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
  async ({ commentId, value, userId }) => {
    const response = await axios.get(
      `http://localhost:3001/comments/${commentId}`
    );
    const comment = response.data;

    let newVotes = comment.votes;
    if (!comment.voters || !comment.voters[userId]) {
      newVotes += value;
    } else {
      newVotes = newVotes - comment.voters[userId] + value;
    }

    const updatedComment = {
      ...comment,
      votes: newVotes,
      voters: { ...comment.voters, [userId]: value },
    };

    const updateResponse = await axios.put(
      `http://localhost:3001/comments/${commentId}`,
      updatedComment
    );
    return updateResponse.data;
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
export const editComment = createAsyncThunk(
  "question/editComment",
  async ({ commentId, content }) => {
    const response = await axios.patch(
      `http://localhost:3001/comments/${commentId}`,
      { content }
    );
    return response.data;
  }
);

export const deleteComment = createAsyncThunk(
  "question/deleteComment",
  async (commentId) => {
    await axios.delete(`http://localhost:3001/comments/${commentId}`);
    return commentId;
  }
);
const updateCommentOrReply = (comments, updatedComment) => {
  return comments.map((comment) => {
    if (comment.id === updatedComment.id) {
      return { ...comment, ...updatedComment };
    }
    if (comment.replies) {
      return {
        ...comment,
        replies: comment.replies.map((reply) =>
          reply.id === updatedComment.id
            ? { ...reply, ...updatedComment }
            : reply
        ),
      };
    }
    return comment;
  });
};
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

      .addCase(fetchQuestion.fulfilled, (state, action) => {
        state.question = action.payload;
      })

      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload.map((comment) => ({
          ...comment,
          user: state.users.find((user) => user.id === comment.userId),
          replies: comment.replies?.map((reply) => ({
            ...reply,
            user: state.users.find((user) => user.id === reply.userId),
          })),
        }));
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const user = state.users.find((u) => u.id === action.payload.userId);
        const newComment = {
          ...action.payload,
          user: user ? { ...user } : null,
        };
        if (newComment.parentId) {
          state.comments = state.comments.map((comment) => {
            if (comment.id === newComment.parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment],
              };
            }
            return comment;
          });
        } else {
          state.comments = [newComment, ...state.comments];
        }
      })
      .addCase(voteComment.fulfilled, (state, action) => {
        state.comments = updateCommentOrReply(state.comments, action.payload);
      })
      .addCase(editComment.fulfilled, (state, action) => {
        state.comments = updateCommentOrReply(state.comments, action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c.id !== action.payload);
        state.comments = state.comments.map((comment) => {
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.filter(
                (reply) => reply.id !== action.payload
              ),
            };
          }
          return comment;
        });
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchSlot.fulfilled, (state, action) => {
        state.currentSlot = action.payload;
      })

      .addCase(fetchGroupMembers.fulfilled, (state, action) => {
        state.currentGroup = action.payload;
      });
  },
});

export default questionSlice.reducer;
