// features/exams/examsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const getAuthToken = () => localStorage.getItem("authToken");

// --- Thunks ---
// Fetch Exams
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

// Create Exam
export const createExam = createAsyncThunk("exams/createExam", async (examData, { rejectWithValue }) => {
  try {
    const token = getAuthToken();
    const start_time = new Date(examData.start_time).toISOString();
    const end_time = new Date(examData.end_time).toISOString();

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

// Update Exam (PUT or PATCH)
export const updateExam = createAsyncThunk("exams/updateExam", async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    const token = getAuthToken();
    const start_time = new Date(updatedData.start_time).toISOString();
    const end_time = new Date(updatedData.end_time).toISOString();

    const response = await fetch(`${API_BASE_URL}/clacbt_exams/${id}`, {
      method: "PUT",  // or "PATCH"
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        clacbt_exam: {
          name: updatedData.name,
          duration: parseInt(updatedData.duration),
          start_time,
          end_time,
        },
      }),
    });

    if (!response.ok) throw new Error("Failed to update exam");
    return await response.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// Delete Exam
export const deleteExam = createAsyncThunk("exams/deleteExam", async (id, { rejectWithValue }) => {
  try {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/clacbt_exams/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to delete exam");
    return id;  // Return the deleted exam ID so we can remove it locally
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
      // fetchExams
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

      // createExam
      .addCase(createExam.fulfilled, (state, action) => {
        state.exams.push(action.payload);
      })
      .addCase(createExam.rejected, (state, action) => {
        state.error = action.payload;
      })

      // updateExam
      .addCase(updateExam.fulfilled, (state, action) => {
        const updatedExam = action.payload;
        const index = state.exams.findIndex((exam) => exam.id === updatedExam.id);
        if (index !== -1) {
          state.exams[index] = updatedExam;
        }
      })
      .addCase(updateExam.rejected, (state, action) => {
        state.error = action.payload;
      })

      // deleteExam
      .addCase(deleteExam.fulfilled, (state, action) => {
        const id = action.payload;
        state.exams = state.exams.filter((exam) => exam.id !== id);
      })
      .addCase(deleteExam.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default examsSlice.reducer;
