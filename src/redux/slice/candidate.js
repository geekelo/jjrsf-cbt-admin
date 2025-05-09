import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Constants
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const getAuthToken = () => localStorage.getItem('authToken');

// Async thunk to fetch candidates
export const fetchCandidates = createAsyncThunk(
    'candidates/fetchCandidates',
    async (clacbt_exam_id, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/clacbt_exams/${clacbt_exam_id}/clacbt_candidates?exam_id=${clacbt_exam_id}`,
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
// Async thunks for API calls
export const addCandidate = createAsyncThunk(
  'candidates/addCandidate',
  async ({ clacbt_exam_id, candidateData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/clacbt_exams/${clacbt_exam_id}/clacbt_candidates?exam_id=${clacbt_exam_id}`,
        candidateData,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editCandidate = createAsyncThunk(
  'candidates/editCandidate',
  async ({ clacbt_exam_id, id, candidateData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/clacbt_exams/${clacbt_exam_id}/clacbt_candidates/${id}`,
        candidateData,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCandidate = createAsyncThunk(
  'candidates/deleteCandidate',
  async ({ clacbt_exam_id, id }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/clacbt_exams/${clacbt_exam_id}/clacbt_candidates/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return { id };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const CandidatesSlice = createSlice({
  name: 'clacbtCandidates',
  initialState: {
    candidates: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        console.log(action.payload)
        state.loading = false;
        state.candidates = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        console.log(action.payload)
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCandidate.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates.push(action.payload);
      })
      .addCase(addCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editCandidate.pending, (state) => {
        state.loading = true;
      })
      .addCase(editCandidate.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.candidates.findIndex(
          (candidate) => candidate.id === action.payload.id
        );
        if (index !== -1) {
          state.candidates[index] = action.payload;
        }
      })
      .addCase(editCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCandidate.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = state.candidates.filter(
          (candidate) => candidate.id !== action.payload.id
        );
      })
      .addCase(deleteCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default CandidatesSlice.reducer;
