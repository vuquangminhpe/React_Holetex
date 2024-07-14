import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/http";

export const fetchQuestion = createAsyncThunk(
  "question/fetchQuestion",
  async (questionId) => {
    const response = await http.get(`/questions/${questionId}`);
    return response.data;
  }
);

export const fetchSlot = createAsyncThunk(
  "question/fetchSlot",
  async (questionId) => {
    const response = await http.get(`/slots`);
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
    const response = await http.get(
      `/comments?questionId=${questionId}&_sort=createdAt&_order=desc`
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
    try {
      const response = await http.post("/comments", {
        questionId,
        content,
        userId,
        parentId,
        createdAt: new Date().toISOString(),
        votes: 0,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to add comment");
    }
  }
);

export const voteComment = createAsyncThunk(
  "question/voteComment",
  async ({ commentId, value, userId }, { rejectWithValue }) => {
    try {
      const response = await http.get(`/comments/${commentId}`);
      if (!response.data) {
        throw new Error("Comment not found");
      }

      const comment = response.data;
      const newVotes = (comment.votes || 0) + value;

      const updatedComment = {
        ...comment,
        votes: newVotes,
        voters: { ...(comment.voters || {}), [userId]: value },
      };

      const updateResponse = await http.put(
        `/comments/${commentId}`,
        updatedComment
      );
      return updateResponse.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return rejectWithValue("Comment not found");
      }
      return rejectWithValue(error.message || "Failed to vote");
    }
  }
);
export const fetchUsers = createAsyncThunk("question/fetchUsers", async () => {
  const response = await http.get("/users");
  return response.data;
});

export const fetchGroupMembers = createAsyncThunk(
  "question/fetchGroupMembers",
  async (groupId) => {
    const response = await http.get(`/groups/${groupId}`);
    const group = response.data;
    const userPromises = group.members.map((userId) =>
      http.get(`/users/${userId}`)
    );
    const userResponses = await Promise.all(userPromises);
    const users = userResponses.map((response) => response.data);
    return { ...group, members: users };
  }
);
export const editComment = createAsyncThunk(
  "question/editComment",
  async ({ commentId, content }) => {
    const response = await http.patch(`/comments/${commentId}`, { content });
    return response.data;
  }
);

export const deleteComment = createAsyncThunk(
  "question/deleteComment",
  async (commentId) => {
    await http.delete(`/comments/${commentId}`);
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

export const updateGrades = createAsyncThunk(
  "question/updateGrades",
  async ({ slotId, questionId, grades }) => {
    const response = await http.get(`/slots/${slotId}`);
    const slot = response.data;

    const updatedGrades = slot.grades.filter(
      (g) => g.questionId !== questionId
    );
    updatedGrades.push(...grades);

    const updateResponse = await http.patch(`/slots/${slotId}`, {
      grades: updatedGrades,
    });
    return updateResponse.data;
  }
);

export const updateLinkDrive = createAsyncThunk(
  "question/updateLinkDrive",
  async ({ slotId, linkDrive }) => {
    const response = await http.patch(`/slots/${slotId}`, { linkDrive });
    return response.data;
  }
);
export const fetchGradesForQuestion = createAsyncThunk(
  "question/fetchGradesForQuestion",
  async (questionId) => {
    const response = await http.get(`/slots`);
    const slots = response.data;
    const relevantSlot = slots.find((slot) =>
      slot.questions.some((question) => question.id === questionId)
    );
    const grades = relevantSlot
      ? relevantSlot.grades.filter((grade) => grade.questionId === questionId)
      : [];
    console.log("Fetched grades:", grades);
    return grades;
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
  reducers: {
    addRealTimeComment: (state, action) => {
      const newComment = action.payload;
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
    },
    deleteRealTimeComment: (state, action) => {
      const commentId = action.payload;
      state.comments = state.comments.filter((c) => c.id !== commentId);
      state.comments = state.comments.map((comment) => {
        if (comment.replies) {
          comment.replies = comment.replies.filter(
            (reply) => reply.id !== commentId
          );
        }
        return comment;
      });
    },
    editRealTimeComment: (state, action) => {
      const updatedComment = action.payload;
      state.comments = state.comments.map((comment) => {
        if (comment.id === updatedComment.id) {
          return { ...comment, ...updatedComment };
        }
        if (comment.replies) {
          const updatedReplies = comment.replies.map((reply) =>
            reply.id === updatedComment.id
              ? { ...reply, ...updatedComment }
              : reply
          );
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      });
    },
    addRealTimeReply: (state, action) => {
      const newReply = action.payload;
      state.comments = state.comments.map((comment) => {
        if (comment && comment.id === newReply?.parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      });
    },
    voteRealTimeComment: (state, action) => {
      const { commentId, value, userId } = action.payload || {};
      if (!commentId || !userId || value === undefined) {
        console.error("Invalid vote data:", action.payload);
        return;
      }

      state.comments = state.comments.map((comment) => {
        if (comment.id === commentId) {
          const existingVoteIndex = comment.votes
            ? comment.votes.findIndex((v) => v.userId === userId)
            : -1;
          let updatedVotes;
          if (existingVoteIndex !== -1) {
            updatedVotes = [...comment.votes];
            updatedVotes[existingVoteIndex] = { userId, value };
          } else {
            updatedVotes = [...(comment.votes || []), { userId, value }];
          }
          return { ...comment, votes: updatedVotes };
        }

        if (comment.replies) {
          const updatedReplies = comment.replies.map((reply) => {
            if (reply.id === commentId) {
              const existingVoteIndex = reply.votes
                ? reply.votes.findIndex((v) => v.userId === userId)
                : -1;
              let updatedVotes;
              if (existingVoteIndex !== -1) {
                updatedVotes = [...reply.votes];
                updatedVotes[existingVoteIndex] = { userId, value };
              } else {
                updatedVotes = [...(reply.votes || []), { userId, value }];
              }
              return { ...reply, votes: updatedVotes };
            }
            return reply;
          });
          return { ...comment, replies: updatedReplies };
        }

        return comment;
      });
    },

    updateRealTimeRating: (state, action) => {
      const { commentId, rating } = action.payload;
      state.comments = updateCommentOrReply(state.comments, {
        id: commentId,
        rating,
      });
    },
    updateRealTimeGrades: (state, action) => {
      state.currentGrades = action.payload;
    },
  },
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
      })
      .addCase(updateGrades.fulfilled, (state, action) => {
        const updatedSlot = action.payload;
        state.currentSlot = updatedSlot;
      })
      .addCase(updateLinkDrive.fulfilled, (state, action) => {
        const updatedSlot = action.payload;
        const index = state.slots.findIndex(
          (slot) => slot.id === updatedSlot.id
        );
        if (index !== -1) {
          state.slots[index] = updatedSlot;
        }
      })
      .addCase(fetchGradesForQuestion.fulfilled, (state, action) => {
        state.currentGrades = action.payload;
      });
  },
});
export const {
  addRealTimeComment,
  deleteRealTimeComment,
  editRealTimeComment,
  voteRealTimeComment,
  addRealTimeReply,
  updateRealTimeRating,
  updateRealTimeGrades,
} = questionSlice.actions;

export default questionSlice.reducer;
