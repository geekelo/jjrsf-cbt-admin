import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


// Fetch exams
export const fetchExams = createAsyncThunk("exams/fetchExams", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/clacbt_exams`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch exams");
    return await response.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// Create exam
export const createExam = createAsyncThunk("exams/createExam", async (examData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("authToken");

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
      .addCase(createExam.pending, (state) => {
        state.error = null;
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
