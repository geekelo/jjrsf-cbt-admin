import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Helper function to get the auth token
const getAuthToken = () => localStorage.getItem("authToken");

// --- Thunks ---

// Fetch exams
export const fetchExams = createAsyncThunk("exams/fetchExams", async (_, { rejectWithValue }) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/clacbt_exams`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch exams");
    return await response.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// Create an exam
export const createExam = createAsyncThunk("exams/createExam", async (examData, { rejectWithValue }) => {
  try {
    const token = getAuthToken();
    const start_time = new Date(`${examData.start_date}T00:00:00`).toISOString();
    const end_time = new Date(`${examData.end_date}T23:59:59`).toISOString();

    const response = await fetch(`${API_BASE_URL}/clacbt_exams`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        clacbt_exam: {
          name: examData.name,
          duration: parseInt(examData.duration),
          start_time,
          end_time,
        },
      }),
    });

    if (!response.ok) throw new Error("Failed to add exam");
    return await response.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});
// Create a question for a specific exam
export const createClacbtQuestion = createAsyncThunk(
  "exams/createClacbtQuestion",
  async ({ examId, questionData, token }, { rejectWithValue }) => {
    try {


      const authToken = token || getAuthToken(); // fallback if token not passed

      const response = await axios.post(
        `${API_BASE_URL}/clacbt_exams/${examId}/clacbt_questions?exam_id=${examId}`,
        { clacbt_question: questionData },
        { headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" } }
      );



      return { examId, question: response.data };
    } catch (err) {
      console.error("[createClacbtQuestion] Error:", err.response ? err.response.data : err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



// --- Slice ---
const examsSlice = createSlice({
  name: "exams",
  initialState: {
    exams: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch exams
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.exams = action.payload;
        state.loading = false;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create exam
      .addCase(createExam.pending, (state) => {
        state.error = null;
      })
      .addCase(createExam.fulfilled, (state, action) => {
        state.exams.push(action.payload);
      })
      .addCase(createExam.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Create question for a specific exam
      .addCase(createClacbtQuestion.fulfilled, (state, action) => {
        const { examId, question } = action.payload;
        const exam = state.exams.find((e) => e.id === examId);
        if (exam) {
          exam.clacbt_questions.push(question); // Push the new question into the exam
        }
        console.log(exam)
        console.log(action.payload)
      })

      .addCase(createClacbtQuestion.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default examsSlice.reducer;
