// features/questions/questionsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const getAuthToken = () => localStorage.getItem("authToken");

// --- Thunks ---
export const fetchClacbtQuestions = createAsyncThunk("questions/fetchClacbtQuestions", async (examId, { rejectWithValue }) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/clacbt_exams/${examId}/clacbt_questions?exam_id=${examId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { examId, questions: response.data };
  } catch (err) {
    console.error("[fetchClacbtQuestions] Error:", err.response?.data || err.message);
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const createClacbtQuestion = createAsyncThunk(
  "questions/createClacbtQuestion",
  async ({ examId, questionData, token }, { rejectWithValue }) => {
    try {
      const authToken = token || getAuthToken();
      const response = await axios.post(
        `${API_BASE_URL}/clacbt_exams/${examId}/clacbt_questions?exam_id=${examId}`,
        { clacbt_question: questionData },
        { headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" } }
      );
      return { examId, question: response.data };
    } catch (err) {
      console.error("[createClacbtQuestion] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateClacbtQuestion = createAsyncThunk(
  "questions/updateClacbtQuestion",
  async ({ examId, questionId, updatedData }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.patch(
        `${API_BASE_URL}/clacbt_exams/${examId}/clacbt_questions/${questionId}/clacbt_answers/:id`,
        { clacbt_question: updatedData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { examId, questionId, updatedQuestion: response.data };
    } catch (err) {
      console.error("[updateClacbtQuestion] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteClacbtQuestion = createAsyncThunk(
  "questions/deleteClacbtQuestion",
  async ({ examId, questionId }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      await axios.delete(`${API_BASE_URL}/clacbt_exams/${examId}/clacbt_questions/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { examId, questionId };
    } catch (err) {
      console.error("[deleteClacbtQuestion] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// --- Slice ---
const questionsSlice = createSlice({
  name: "questions",
  initialState: {
    questionsByExam: {}, // { [examId]: [questions] }
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClacbtQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClacbtQuestions.fulfilled, (state, action) => {
        const { examId, questions } = action.payload;
        state.questionsByExam[examId] = questions;
        state.loading = false;
      })
      .addCase(fetchClacbtQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createClacbtQuestion.fulfilled, (state, action) => {
        const { examId, question } = action.payload;
        if (!state.questionsByExam[examId]) state.questionsByExam[examId] = [];
        state.questionsByExam[examId].push(question);
      })
      .addCase(updateClacbtQuestion.fulfilled, (state, action) => {
        const { examId, questionId, updatedQuestion } = action.payload;
        const questions = state.questionsByExam[examId] || [];
        const index = questions.findIndex((q) => q.id === questionId);
        if (index !== -1) {
          questions[index] = updatedQuestion;
        }
      })
      .addCase(deleteClacbtQuestion.fulfilled, (state, action) => {
        const { examId, questionId } = action.payload;
        const questions = state.questionsByExam[examId] || [];
        state.questionsByExam[examId] = questions.filter((q) => q.id !== questionId);
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected") && action.type.startsWith("questions/"),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export default questionsSlice.reducer;
