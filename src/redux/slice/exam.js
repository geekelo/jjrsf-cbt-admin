// features/exams/examsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const getAuthToken = () => localStorage.getItem("authToken");

// --- Thunks ---

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
export const createExam = createAsyncThunk("exams/createExam", async (examData, { rejectWithValue }) => {
  try {
    const token = getAuthToken();
    
    // Format start and end times
    const start_time = new Date(examData.start_time).toISOString();  // Ensure date-time format is valid
    const end_time = new Date(examData.end_time).toISOString();      // Ensure date-time format is valid

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
      .addCase(createExam.fulfilled, (state, action) => {
        state.exams.push(action.payload);
      })
      .addCase(createExam.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default examsSlice.reducer;
